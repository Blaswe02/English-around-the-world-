create schema if not exists learning_private;
revoke all on schema learning_private from public, anon;
grant usage on schema learning_private to authenticated;
create table public.learning_profiles (
 user_id uuid primary key references auth.users(id) on delete cascade,
 username text not null unique check (username ~ '^[a-z0-9][a-z0-9._-]{2,31}$'),
 display_name text not null check (char_length(display_name) between 1 and 60),
 role text not null default 'student' check (role in ('student','teacher')),
 class_name text not null default '' check (char_length(class_name)<=40),
 active boolean not null default true,
 session_valid_after timestamptz not null default '1970-01-01 UTC',
 created_at timestamptz not null default now()
);
alter table public.learning_profiles enable row level security;
create or replace function learning_private.account_active()
returns boolean language sql stable security definer set search_path=''
as $$
 select (select auth.uid()) is not null and exists (
 select 1 from public.learning_profiles p where p.user_id=(select auth.uid()) and p.active
 and coalesce(((select auth.jwt())->>'iat')::bigint,0) >= extract(epoch from p.session_valid_after)::bigint);
$$;
create or replace function learning_private.is_teacher()
returns boolean language sql stable security definer set search_path=''
as $$
 select learning_private.account_active() and exists (
 select 1 from public.learning_profiles p where p.user_id=(select auth.uid()) and p.role='teacher');
$$;
revoke all on function learning_private.account_active(),learning_private.is_teacher() from public, anon;
grant execute on function learning_private.account_active(),learning_private.is_teacher() to authenticated;
revoke all on public.learning_profiles from public,anon,authenticated;
grant select on public.learning_profiles to authenticated;
grant all on public.learning_profiles to service_role;
create policy profiles_read on public.learning_profiles for select to authenticated
 using (((select auth.uid())=user_id and (select learning_private.account_active())) or (select learning_private.is_teacher()));
create table public.learner_progress (
 user_id uuid not null references public.learning_profiles(user_id) on delete cascade,
 country_id text not null check (country_id ~ '^[a-z0-9-]{1,60}$'),
 lesson_id text not null check (lesson_id ~ '^[a-z0-9-]{1,100}$'),
 level text not null check (level in ('BASIS','KADER','MAVO','HAVO')),
 completed_at timestamptz not null default now(),
 primary key (user_id,country_id,lesson_id,level)
);
alter table public.learner_progress enable row level security;
revoke all on public.learner_progress from public,anon,authenticated;
grant select,insert,update on public.learner_progress to authenticated;
grant all on public.learner_progress to service_role;
create policy progress_read on public.learner_progress for select to authenticated using
 (((select auth.uid())=user_id and (select learning_private.account_active())) or (select learning_private.is_teacher()));
create policy progress_insert on public.learner_progress for insert to authenticated with check
 ((select auth.uid())=user_id and (select learning_private.account_active()));
create policy progress_update on public.learner_progress for update to authenticated using
 ((select auth.uid())=user_id and (select learning_private.account_active())) with check
 ((select auth.uid())=user_id and (select learning_private.account_active()));
create table public.passport_stamps (
 user_id uuid not null references public.learning_profiles(user_id) on delete cascade,
 country_id text not null check(country_id ~ '^[a-z0-9-]{1,60}$'),
 stamp_type text not null check(stamp_type in ('fact','taste','story','heritage','diplomat','archive')),
 level text not null check(level in ('BASIS','KADER','MAVO','HAVO')),
 awarded_by uuid not null default auth.uid() references public.learning_profiles(user_id),
 awarded_at timestamptz not null default now(),
 primary key(user_id,country_id,stamp_type,level)
);
alter table public.passport_stamps enable row level security;
revoke all on public.passport_stamps from public,anon,authenticated;
grant select,insert,delete on public.passport_stamps to authenticated;
grant all on public.passport_stamps to service_role;
create policy stamps_read on public.passport_stamps for select to authenticated using
 (((select auth.uid())=user_id and (select learning_private.account_active())) or (select learning_private.is_teacher()));
create policy stamps_award on public.passport_stamps for insert to authenticated with check
 ((select learning_private.is_teacher()) and awarded_by=(select auth.uid()));
create policy stamps_revoke on public.passport_stamps for delete to authenticated using
 ((select learning_private.is_teacher()));
-- Preserve old nickname data, but retire anonymous access.
drop policy if exists anyone_can_manage_progress on public.lesson_progress;
revoke all on public.lesson_progress from public,anon,authenticated;

