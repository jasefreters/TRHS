-- Add teachers to the staff list. Paste this into a NEW query in the Supabase SQL Editor
-- (not the full setup script), change the emails, and click Run.
-- One email per line, each in its own brackets and quotes, with a comma between lines and none
-- after the last. Each person also needs a login under Authentication > Users with the same email.

insert into public.staff (email) values
  ('first.teacher@det.nsw.edu.au'),
  ('second.teacher@det.nsw.edu.au')
on conflict (email) do nothing;

-- Check: every row should show the same email in both columns.
select s.email as on_staff_list, u.email as login_account
from public.staff s
full join auth.users u on lower(u.email) = lower(s.email);
