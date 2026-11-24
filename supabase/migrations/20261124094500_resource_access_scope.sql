alter policy resource_read on public.destination_resources using (
 (select learning_private.is_teacher()) or
 (destination_resources.archived_at is null and exists (
 select 1 from public.learning_profiles p where p.user_id=(select auth.uid())
 and (destination_resources.study_level='ALL' or destination_resources.study_level=p.study_level)
 and learning_private.can_study(destination_resources.country_id,destination_resources.study_year,p.study_level)
 ))
);