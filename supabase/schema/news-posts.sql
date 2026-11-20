-- Already applied to the linked Supabase project on 20 November 2026.
create table public.news_posts (
 id uuid primary key default gen_random_uuid(),
 title text not null check (char_length(trim(title)) between 1 and 140),
 summary text not null check (char_length(trim(summary)) between 1 and 500),
 body text not null default '' check (char_length(body)<=12000),
 category text not null check(category in ('Method update','New lessons','Classroom stories','Platform news')),
 published boolean not null default false,published_at timestamptz,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now(),
 created_by uuid not null references public.learning_profiles(user_id),
 updated_by uuid not null references public.learning_profiles(user_id),
 check (not published or published_at is not null)
);
alter table public.news_posts enable row level security;
revoke all on public.news_posts from public,anon,authenticated;
grant select (id,title,summary,body,category,published,published_at,created_at) on public.news_posts to anon,authenticated;
grant insert,update on public.news_posts to authenticated;
grant all on public.news_posts to service_role;
create policy news_public_read on public.news_posts for select to anon,authenticated using (published);
create policy news_teacher_read on public.news_posts for select to authenticated using ((select learning_private.is_teacher()));
create policy news_teacher_insert on public.news_posts for insert to authenticated with check ((select learning_private.is_teacher()) and created_by=(select auth.uid()) and updated_by=(select auth.uid()));
create policy news_teacher_update on public.news_posts for update to authenticated using ((select learning_private.is_teacher())) with check ((select learning_private.is_teacher()) and updated_by=(select auth.uid()));
