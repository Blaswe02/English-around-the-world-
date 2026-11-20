-- Follow-up changes already applied to eaatw-hub after learning-accounts.sql.
create schema if not exists learning_archive;
revoke all on schema learning_archive from public,anon,authenticated;
alter table public.lesson_progress set schema learning_archive;
create policy archived_no_client_access on learning_archive.lesson_progress for all to public using(false) with check(false);

