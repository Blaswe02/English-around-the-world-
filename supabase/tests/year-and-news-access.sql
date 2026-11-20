begin;
select set_config('test.student',gen_random_uuid()::text,true),set_config('test.teacher',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,raw_app_meta_data,raw_user_meta_data)
select current_setting('test.'||v)::uuid,'authenticated','authenticated','qa-'||gen_random_uuid()||'@example.invalid','{}','{}' from (values('student'),('teacher')) x(v);
insert into public.learning_profiles(user_id,username,display_name,role,study_year,study_level)
select current_setting('test.'||v)::uuid,'qa-'||substr(gen_random_uuid()::text,1,24),'QA',v,case when v='student' then 3 end,case when v='student' then 'KADER' end from (values('student'),('teacher')) x(v);
set local role authenticated;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.teacher'),'role','authenticated','iat',extract(epoch from now())::bigint)::text,true);
insert into public.news_posts(title,summary,category,created_by,updated_by) values('QA draft','QA summary','Method update',auth.uid(),auth.uid());
select set_config('test.news',(select id::text from public.news_posts where title='QA draft'),true);
update public.news_posts set published=true,published_at=now() where id=current_setting('test.news')::uuid;
set local role anon;
do $$ begin
 if not exists(select id from public.news_posts where id=current_setting('test.news')::uuid) then raise exception 'Public news hidden';end if;
 begin perform created_by from public.news_posts;raise exception 'Author IDs exposed';exception when insufficient_privilege then null;end;
end $$;
set local role authenticated;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.teacher'),'role','authenticated','iat',extract(epoch from now())::bigint)::text,true);
update public.news_posts set published=false,published_at=null where id=current_setting('test.news')::uuid;
insert into public.module_access(country_id,study_year,study_level,is_open) values('singapore',3,'KADER',true) on conflict(country_id,study_year,study_level) do update set is_open=true,updated_by=auth.uid();
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.student'),'role','authenticated','iat',extract(epoch from now())::bigint)::text,true);
do $$ begin
 if exists(select id from public.news_posts where id=current_setting('test.news')::uuid) then raise exception 'Student can see draft';end if;
 begin insert into public.news_posts(title,summary,category,created_by,updated_by) values('Bad','Bad','Platform news',auth.uid(),auth.uid());raise exception 'Student can publish';exception when insufficient_privilege then null;end;
 if not learning_private.can_study('singapore',3::smallint,'KADER') then raise exception 'Unlocked module blocked';end if;
 if learning_private.can_study('singapore',2::smallint,'KADER') or learning_private.can_study('singapore',3::smallint,'MAVO') then raise exception 'Wrong enrolment allowed';end if;
 begin update public.learning_profiles set study_year=4 where user_id=auth.uid();raise exception 'Student changed year';exception when insufficient_privilege then null;end;
 begin insert into public.module_access(country_id,study_year,study_level,is_open) values('malta',3,'KADER',true);raise exception 'Student unlocked module';exception when insufficient_privilege then null;end;
end $$;
insert into public.learner_progress(user_id,country_id,lesson_id,level,study_year) values(auth.uid(),'singapore','qa-lesson','KADER',3) on conflict(user_id,country_id,lesson_id,level,study_year) do update set completed_at=now();
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.teacher'),'role','authenticated','iat',extract(epoch from now())::bigint)::text,true);
update public.module_access set is_open=false,updated_by=auth.uid() where country_id='singapore' and study_year=3 and study_level='KADER';
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.student'),'role','authenticated','iat',extract(epoch from now())::bigint)::text,true);
do $$ begin
 if learning_private.can_study('singapore',3::smallint,'KADER') then raise exception 'Relocked module allowed';end if;
 if not exists(select 1 from public.learner_progress where user_id=auth.uid() and lesson_id='qa-lesson') then raise exception 'Progress lost';end if;
 begin insert into public.learner_progress(user_id,country_id,lesson_id,level,study_year) values(auth.uid(),'singapore','qa-locked','KADER',3);raise exception 'Locked progress saved';exception when insufficient_privilege then null;end;
end $$;
set local role anon;
do $$ begin if exists(select id from public.news_posts where id=current_setting('test.news')::uuid) then raise exception 'Public draft exposed';end if;end $$;
reset role;
do $$ begin begin update public.learning_profiles set study_year=4,study_level='HAVO' where user_id=current_setting('test.student')::uuid;raise exception 'HAVO Year 4 accepted';exception when check_violation then null;end;end $$;
rollback;
select 'PASS: news visibility, teacher publishing, year/level access, relocking and retained progress; all test data rolled back.' as result;
