-- Reset Program database update 2.
-- Paste this whole file into a NEW query in the Supabase SQL Editor and click Run, once.
-- It adds: who's staffing each session, pausing a program, follow-up surveys, and morning surveys.
-- It doesn't change or remove any existing students, programs or answers.

-- Which staff member is running each session on each date (their name, as staff want it shown).
create table if not exists public.staffing (
  date date not null,
  slot smallint not null check (slot between 1 and 10),
  staff text not null default '' check (length(staff) <= 80),
  primary key (date, slot)
);
alter table public.staffing enable row level security;
drop policy if exists staff_all_staffing on public.staffing;
create policy staff_all_staffing on public.staffing for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Programs can be paused (for example if a student is away), and a "follow-up" program is just
-- the follow-up survey a few weeks after the student returns to class.
alter table public.visits add column if not exists kind text not null default 'program';
alter table public.visits add column if not exists paused boolean not null default false;
alter table public.visits drop constraint if exists visits_kind_check;
alter table public.visits add constraint visits_kind_check check (kind in ('program', 'followup'));

-- A session can be a stand-alone survey (used for the follow-up survey).
alter table public.sessions drop constraint if exists sessions_kind_check;
alter table public.sessions add constraint sessions_kind_check
  check (kind in ('intro', 'group', 'independent', 'one_to_one', 'break', 'debrief', 'free', 'survey'));

-- Students' plans now say whether the program is paused and whether it's a follow-up.
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

-- Students can now also save surveys (the morning survey is part of the morning session).
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
