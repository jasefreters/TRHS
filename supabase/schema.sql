-- Reset Program database setup.
-- Paste this whole file into Supabase: SQL Editor > New query > Run.
-- It is safe to run on a new, empty project. No student names are stored anywhere:
-- each student is a random code, and the code-to-name list is kept offline by staff.

-- ---------------------------------------------------------------------------
-- Staff: teachers who may use the dashboard. Add their login emails at the bottom.
-- ---------------------------------------------------------------------------
create table public.staff (
  email text primary key
);

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.staff
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------------------------------------------------------------------------
-- Student codes: 8 characters with no look-alikes (no I, L, O, 0, 1), e.g. K7Q3M2XD.
-- Long enough that a student can't guess someone else's code.
-- ---------------------------------------------------------------------------
create or replace function public.new_student_code() returns text
language plpgsql volatile set search_path = '' as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  bytes bytea := extensions.gen_random_bytes(8);
  code text := '';
begin
  for i in 0..7 loop
    code := code || substr(alphabet, (get_byte(bytes, i) % length(alphabet)) + 1, 1);
  end loop;
  return code;
end $$;

-- Accepts "k7q3-m2xd", "K7Q3 M2XD" etc.
create or replace function public.normalise_code(p_code text) returns text
language sql immutable set search_path = '' as $$
  select upper(regexp_replace(coalesce(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.students (
  id uuid primary key default gen_random_uuid(),
  code text not null unique default public.new_student_code(),
  year_level smallint check (year_level between 7 and 12),
  created_at timestamptz not null default now()
);

-- One visit = one time through the 2-day program. A returning student gets a new visit,
-- so their earlier visits stay as a record of what they did.
create table public.visits (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  start_date date not null default current_date,
  current_day smallint not null default 1 check (current_day in (1, 2)),
  active boolean not null default true,
  kind text not null default 'program' constraint visits_kind_check check (kind in ('program', 'followup')),
  paused boolean not null default false,
  help_requested_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index visits_one_active_per_student on public.visits (student_id) where active;

-- The day plan: one row per session slot, with the student's progress on it.
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  day smallint not null check (day in (1, 2)),
  slot smallint not null check (slot between 1 and 20),
  kind text not null constraint sessions_kind_check check (kind in ('intro', 'group', 'independent', 'one_to_one', 'break', 'debrief', 'free', 'survey')),
  activity text,                 -- which module, e.g. 'numeracy' or 'self-regulation'
  title text not null,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'done')),
  result jsonb,                  -- score and level, as shown on the certificate
  state jsonb,                   -- where the student is up to inside a module
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (visit_id, day, slot),
  check (state is null or octet_length(state::text) <= 50000),
  check (result is null or octet_length(result::text) <= 5000)
);
create index sessions_visit on public.sessions (visit_id);

-- Which staff member is running each session on each date.
create table public.staffing (
  date date not null,
  slot smallint not null check (slot between 1 and 10),
  staff text not null default '' check (length(staff) <= 80),
  primary key (date, slot)
);

-- ---------------------------------------------------------------------------
-- Access rules. Staff (logged in and listed in public.staff) can do everything.
-- Students never read tables directly; they only use the student_* functions below,
-- which need their code.
-- ---------------------------------------------------------------------------
alter table public.staff enable row level security;
alter table public.students enable row level security;
alter table public.visits enable row level security;
alter table public.sessions enable row level security;
alter table public.staffing enable row level security;

create policy staff_read_staff on public.staff for select to authenticated using (public.is_staff());
create policy staff_all_students on public.students for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy staff_all_visits on public.visits for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy staff_all_sessions on public.sessions for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy staff_all_staffing on public.staffing for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- Student functions (called from the laptop with the student's code)
-- ---------------------------------------------------------------------------
create or replace function public.active_visit_for_code(p_code text) returns uuid
language sql stable security definer set search_path = '' as $$
  select v.id
  from public.visits v
  join public.students s on s.id = v.student_id
  where s.code = public.normalise_code(p_code) and v.active;
$$;

-- Returns the student's plan and progress, or null if the code isn't active.
create or replace function public.student_load(p_code text) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  v public.visits;
begin
  select * into v from public.visits where id = public.active_visit_for_code(p_code);
  if not found then
    return null;
  end if;
  return jsonb_build_object(
    'current_day', v.current_day,
    'help', v.help_requested_at is not null,
    'paused', v.paused,
    'kind', v.kind,
    'sessions', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', s.id, 'day', s.day, 'slot', s.slot, 'kind', s.kind, 'activity', s.activity,
          'title', s.title, 'status', s.status, 'result', s.result, 'state', s.state
        ) order by s.day, s.slot)
      from public.sessions s where s.visit_id = v.id
    ), '[]'::jsonb)
  );
end $$;

-- Saves progress on one session. Students can only update their own independent work;
-- group sessions and 1:1s are ticked off by the teacher. A finished session can't be
-- changed again, so a certificate is only ever issued once.
create or replace function public.student_save(
  p_code text, p_session uuid, p_status text, p_result jsonb default null, p_state jsonb default null
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  v_visit uuid := public.active_visit_for_code(p_code);
begin
  if v_visit is null then
    return false;
  end if;
  update public.sessions
  set status = coalesce(p_status, status),
      result = coalesce(p_result, result),
      state = coalesce(p_state, state),
      updated_at = now(),
      completed_at = case when p_status = 'done' then now() else completed_at end
  where id = p_session
    and visit_id = v_visit
    and kind in ('intro', 'independent', 'free', 'debrief', 'survey')
    and status <> 'done';
  return found;
end $$;

-- The "I need help" button.
create or replace function public.student_help(p_code text, p_on boolean) returns boolean
language plpgsql security definer set search_path = '' as $$
begin
  update public.visits
  set help_requested_at = case when p_on then now() else null end
  where id = public.active_visit_for_code(p_code);
  return found;
end $$;

-- Only the student_* functions and is_staff are callable from the website.
revoke execute on function public.active_visit_for_code(text) from public, anon, authenticated;
grant execute on function public.student_load(text) to anon, authenticated;
grant execute on function public.student_save(text, uuid, text, jsonb, jsonb) to anon, authenticated;
grant execute on function public.student_help(text, boolean) to anon, authenticated;

-- Live updates for the teacher dashboard.
alter publication supabase_realtime add table public.visits, public.sessions;

-- ---------------------------------------------------------------------------
-- Add each teacher's login email here (the same email you create them with under
-- Authentication > Users), then run this file. One email per line, each in its own
-- brackets and quotes, with a comma between lines and none after the last.
-- To add teachers later, don't run this whole file again: use add-staff.sql.
-- ---------------------------------------------------------------------------
insert into public.staff (email) values
  ('first.teacher@det.nsw.edu.au'),
  ('second.teacher@det.nsw.edu.au')
on conflict (email) do nothing;
