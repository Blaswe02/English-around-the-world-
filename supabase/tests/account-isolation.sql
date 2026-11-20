begin;
select set_config('test.a',gen_random_uuid()::text,true),set_config('test.b',gen_random_uuid()::text,true),set_config('test.teacher',gen_random_uuid()::text,true);
insert into auth.users(id,aud,role,email,raw_app_meta_data,raw_user_meta_data)
select current_setting('test.'||v)::uuid,'authenticated','authenticated','rls-'||v||'@example.invalid','{}'::jsonb,'{}'::jsonb from (values('a'),('b'),('teacher')) as x(v);
insert into public.learning_profiles(user_id,username,display_name,role,study_year,study_level)
select current_setting('test.'||v)::uuid,'rls-test-'||v,'Test '||v,case when v='teacher' then 'teacher' else 'student' end,case when v='teacher' then null else 1 end,case when v='teacher' then null else 'KADER' end from (values('a'),('b'),('teacher')) as x(v);
insert into public.learner_progress(user_id,country_id,lesson_id,level) values(current_setting('test.b')::uuid,'singapore','sg-mrt','KADER');
insert into public.module_access(country_id,study_year,study_level,is_open,updated_by) values('singapore',1,'KADER',true,current_setting('test.teacher')::uuid) on conflict(country_id,study_year,study_level) do update set is_open=true;
set local role authenticated;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.a'),'role','authenticated','iat',extract(epoch from now())::bigint)::text,true);
insert into public.learner_progress(user_id,country_id,lesson_id,level) values(current_setting('test.a')::uuid,'singapore','sg-hawker','KADER');
do $$ begin
 if (select count(*) from public.learning_profiles where username like 'rls-test-%')<>1 then raise exception 'Student profile isolation failed'; end if;
 if (select count(*) from public.learner_progress where user_id in(current_setting('test.a')::uuid,current_setting('test.b')::uuid))<>1 then raise exception 'Student progress isolation failed'; end if;
 begin
  insert into public.learner_progress(user_id,country_id,lesson_id,level) values(current_setting('test.b')::uuid,'singapore','sg-hawker','KADER');
  raise exception 'Cross-student insert allowed';
 exception when insufficient_privilege then null; end;
 begin
  update public.learning_profiles set role='teacher' where user_id=current_setting('test.a')::uuid;
  raise exception 'Student role promotion allowed';
 exception when insufficient_privilege then null; end;
 begin
  insert into public.passport_stamps(user_id,country_id,stamp_type,level) values(current_setting('test.a')::uuid,'singapore','fact','KADER');
  raise exception 'Student stamp award allowed';
 exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.teacher'),'role','authenticated','iat',extract(epoch from now())::bigint)::text,true);
do $$ begin
 if (select count(*) from public.learning_profiles where username like 'rls-test-%')<>3 then raise exception 'Teacher profile access failed'; end if;
 if (select count(*) from public.learner_progress where user_id in(current_setting('test.a')::uuid,current_setting('test.b')::uuid))<>2 then raise exception 'Teacher progress access failed'; end if;
end $$;
insert into public.passport_stamps(user_id,country_id,stamp_type,level) values(current_setting('test.a')::uuid,'singapore','fact','KADER');
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.a'),'role','authenticated','iat',extract(epoch from now())::bigint)::text,true);
do $$ begin if (select count(*) from public.passport_stamps where user_id in(current_setting('test.a')::uuid,current_setting('test.b')::uuid))<>1 then raise exception 'Own passport read failed'; end if; end $$;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.b'),'role','authenticated','iat',extract(epoch from now())::bigint)::text,true);
do $$ begin if (select count(*) from public.passport_stamps where user_id in(current_setting('test.a')::uuid,current_setting('test.b')::uuid))<>0 then raise exception 'Other passport exposed'; end if; end $$;
reset role;
update public.learning_profiles set session_valid_after=now()+interval '5 minutes' where user_id=current_setting('test.a')::uuid;
set local role authenticated;
select set_config('request.jwt.claims',json_build_object('sub',current_setting('test.a'),'role','authenticated','iat',extract(epoch from now())::bigint)::text,true);
do $$ begin if (select count(*) from public.learner_progress where user_id in(current_setting('test.a')::uuid,current_setting('test.b')::uuid))<>0 then raise exception 'Old session accepted after password reset'; end if; end $$;
set local role anon;
do $$ begin
 begin perform count(*) from public.learner_progress;raise exception 'Anonymous progress exposed';exception when insufficient_privilege then null;end;
 begin perform count(*) from public.learning_profiles;raise exception 'Anonymous profiles exposed';exception when insufficient_privilege then null;end;
 begin perform count(*) from public.passport_stamps;raise exception 'Anonymous passports exposed';exception when insufficient_privilege then null;end;
end $$;
rollback;
select 'All account isolation, teacher role, passport ownership, password-reset cutoff and anonymous-access checks passed; fixtures rolled back.' as result;


