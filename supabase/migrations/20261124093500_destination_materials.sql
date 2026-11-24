create table public.destination_resources (
 id uuid primary key default gen_random_uuid(),
 country_id text not null check (country_id in ('uk','australia','canada','usa','india','ireland','south-africa','new-zealand','jamaica','malta','singapore','hawaii','new-york','texas','california')),
 study_year smallint not null check (study_year between 1 and 4),
 study_level text not null check (study_level in ('ALL','BASIS','KADER','MAVO','HAVO')),
 category text not null check (category in ('handout','extra')),
 title text not null check (char_length(title) between 1 and 120),
 storage_path text not null unique,
 file_name text not null,
 mime_type text not null,
 size_bytes integer not null check (size_bytes between 1 and 20971520),
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 archived_at timestamptz,
 constraint destination_resource_route check (study_year=case
 when country_id in ('uk','australia','canada','usa') then 1
 when country_id in ('india','ireland','south-africa','new-zealand') then 2
 when country_id in ('jamaica','malta','singapore','hawaii') then 3 else 4 end),
 constraint destination_resource_path check (storage_path like country_id||'/%')
);
alter table public.destination_resources enable row level security;
grant select,insert,update on public.destination_resources to authenticated;
create policy resource_read on public.destination_resources for select to authenticated using (
 (select learning_private.is_teacher()) or
 (archived_at is null and exists (select 1 from public.learning_profiles p
 where p.user_id=(select auth.uid()) and (study_level='ALL' or study_level=p.study_level)
 and learning_private.can_study(country_id,study_year,p.study_level)))
);
create policy resource_upload on public.destination_resources for insert to authenticated with check (
 (select learning_private.is_teacher()) and created_by=(select auth.uid())
);
create policy resource_archive on public.destination_resources for update to authenticated using (
 (select learning_private.is_teacher())
) with check ((select learning_private.is_teacher()));
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('destination-materials','destination-materials',false,20971520,array[
 'application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 'application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation',
 'image/png','image/jpeg'
]);
create policy destination_material_download on storage.objects for select to authenticated using (
 bucket_id='destination-materials' and ((select learning_private.is_teacher()) or
 exists(select 1 from public.destination_resources r where r.storage_path=name and r.archived_at is null))
);
create policy destination_material_upload on storage.objects for insert to authenticated with check (
 bucket_id='destination-materials' and (select learning_private.is_teacher())
);
create policy destination_material_cleanup on storage.objects for delete to authenticated using (
 bucket_id='destination-materials' and (select learning_private.is_teacher()) and owner_id=(select auth.uid())::text
);
create index destination_resources_lookup on public.destination_resources(country_id,category,study_level) where archived_at is null;
