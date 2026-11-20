-- Already applied to the linked Supabase project on 20 November 2026.
begin;
alter table public.learning_profiles add column study_year smallint,add column study_level text,
 add constraint valid_enrolment check(role='teacher' or (study_year is not null and study_level is not null and study_level in ('BASIS','KADER','MAVO','HAVO') and study_year between 1 and case when study_level='HAVO' then 3 else 4 end));
create table public.module_access (
 country_id text not null check(country_id in ('singapore','malta','hawaii','jamaica','ireland')),
 study_year smallint not null,study_level text not null check(study_level in ('BASIS','KADER','MAVO','HAVO')),
 is_open boolean not null default false,updated_by uuid not null default auth.uid() references public.learning_profiles(user_id),updated_at timestamptz not null default now(),
 primary key(country_id,study_year,study_level),check(study_year between 1 and case when study_level='HAVO' then 3 else 4 end)
);
alter table public.module_access enable row level security;
revoke all on public.module_access from public,anon,authenticated;
grant select,insert,update on public.module_access to authenticated;
grant all on public.module_access to service_role;
create policy modules_read on public.module_access for select to authenticated using ((select learning_private.is_teacher()) or ((select learning_private.account_active()) and exists(select 1 from public.learning_profiles p where p.user_id=(select auth.uid()) and p.study_year=module_access.study_year and p.study_level=module_access.study_level)));
create policy modules_insert on public.module_access for insert to authenticated with check((select learning_private.is_teacher()) and updated_by=(select auth.uid()));
create policy modules_update on public.module_access for update to authenticated using((select learning_private.is_teacher())) with check((select learning_private.is_teacher()) and updated_by=(select auth.uid()));
create or replace function learning_private.can_study(target_country text,target_year smallint,target_level text) returns boolean language sql stable security definer set search_path='' as $$
 select learning_private.account_active() and exists(select 1 from public.learning_profiles p join public.module_access m on m.study_year=p.study_year and m.study_level=p.study_level where p.user_id=(select auth.uid()) and p.role='student' and p.study_year=target_year and p.study_level=target_level and m.country_id=target_country and m.is_open);
$$;
revoke all on function learning_private.can_study(text,smallint,text) from public,anon;
grant execute on function learning_private.can_study(text,smallint,text) to authenticated;
alter table public.learner_progress add column study_year smallint not null default 1,add constraint valid_progress_year check(study_year between 1 and case when level='HAVO' then 3 else 4 end);
alter table public.learner_progress drop constraint learner_progress_pkey;
alter table public.learner_progress add primary key(user_id,country_id,lesson_id,level,study_year);
alter table public.passport_stamps add column study_year smallint not null default 1,add constraint valid_stamp_year check(study_year between 1 and case when level='HAVO' then 3 else 4 end);
alter table public.passport_stamps drop constraint passport_stamps_pkey;
alter table public.passport_stamps add primary key(user_id,country_id,stamp_type,level,study_year);
alter policy progress_insert on public.learner_progress with check((select auth.uid())=user_id and ((select learning_private.is_teacher()) or learning_private.can_study(country_id,study_year,level)));
alter policy progress_update on public.learner_progress using((select auth.uid())=user_id and ((select learning_private.is_teacher()) or learning_private.can_study(country_id,study_year,level))) with check((select auth.uid())=user_id and ((select learning_private.is_teacher()) or learning_private.can_study(country_id,study_year,level)));
commit;
