-- Reset Program database update 3. Run this once in a NEW query in the Supabase SQL Editor
-- (after update-2.sql). It's safe to run more than once.
--
-- It adds:
--   * visits.times: each day's session times, when staff change them on the daily schedule
--     (for example, Tuesday's shorter bell times). Empty means the normal timetable.
--   * students can save their work in a RIOT group module done on their laptop (as a PDF or
--     interactively), as well as in independent modules, surveys and the morning session.

alter table public.visits add column if not exists times jsonb;

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
    'times', v.times,
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
    and (kind in ('intro', 'independent', 'free', 'debrief', 'survey') or (kind = 'group' and activity = 'riot'))
    and status <> 'done';
  return found;
end $$;
