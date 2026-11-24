begin;
select set_config('eatw.test_student_id',gen_random_uuid()::text,true);
select set_config('eatw.test_resource_prefix','uk/test-'||gen_random_uuid()::text,true);
insert into auth.users(id,email,aud,role) values (current_setting('eatw.test_student_id')::uuid,'resource-check-'||current_setting('eatw.test_student_id')||'@accounts.eatw.invalid','authenticated','authenticated');
insert into public.learning_profiles(user_id,username,display_name,role,study_year,study_level) values (current_setting('eatw.test_student_id')::uuid,'test-'||substr(replace(current_setting('eatw.test_student_id'),'-',''),1,20),'Resource permission check','student',1,'BASIS');
insert into public.module_access(country_id,study_year,study_level,is_open,updated_by) select 'uk',1,'BASIS',true,user_id from public.learning_profiles where username='daan' on conflict(country_id,study_year,study_level) do update set is_open=true;
insert into public.destination_resources(country_id,study_year,study_level,category,title,storage_path,file_name,mime_type,size_bytes,created_by,archived_at)
select 'uk',1,v.level,'handout','Permission check',current_setting('eatw.test_resource_prefix')||v.suffix,'check.pdf','application/pdf',100,p.user_id,v.archived from public.learning_profiles p cross join (values ('ALL','-all.pdf',null::timestamptz),('MAVO','-mavo.pdf',null::timestamptz),('ALL','-archived.pdf',now())) v(level,suffix,archived) where p.username='daan';
select set_config('request.jwt.claims',json_build_object('sub',(select user_id from public.learning_profiles where username='daan'),'iat',extract(epoch from now())::bigint,'role','authenticated')::text,true);
set local role authenticated;
do $$begin
 if (select count(*) from public.destination_resources where storage_path like current_setting('eatw.test_resource_prefix')||'%')<>3 then raise exception 'Teacher read failed'; end if;
 if has_table_privilege('authenticated','public.learning_profiles','UPDATE') then raise exception 'Client profile escalation permitted'; end if;
end$$;
reset role;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('eatw.test_student_id'),'iat',extract(epoch from now())::bigint,'role','authenticated')::text,true);
set local role authenticated;
do $$declare changed integer;begin
 if (select count(*) from public.destination_resources where storage_path like current_setting('eatw.test_resource_prefix')||'%')<>1 then raise exception 'Student level and archive filter failed'; end if;
 update public.destination_resources set title='Unauthorized change' where storage_path like current_setting('eatw.test_resource_prefix')||'%';
 get diagnostics changed=row_count;
 if changed<>0 then raise exception 'Student can modify resources'; end if;
end$$;
reset role;
update public.module_access set is_open=false where country_id='uk' and study_year=1 and study_level='BASIS';
set local role authenticated;
do $$begin
 if (select count(*) from public.destination_resources where storage_path like current_setting('eatw.test_resource_prefix')||'%')<>0 then raise exception 'Locked resources visible'; end if;
 if has_table_privilege('anon','public.destination_resources','SELECT') then raise exception 'Anonymous read exposed'; end if;
end$$;
reset role;
rollback;