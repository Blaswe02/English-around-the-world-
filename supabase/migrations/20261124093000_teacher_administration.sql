alter table public.learning_profiles add column is_admin boolean not null default false;
alter table public.learning_profiles add constraint learning_profiles_admin_teacher check (not is_admin or role = 'teacher');
comment on column public.learning_profiles.is_admin is 'Server-managed administration permission. Never set from user metadata or client input.';
update public.learning_profiles p set is_admin=true from auth.users u where u.id=p.user_id and lower(u.email)='d.blasweiler@haarlemcollege.nl' and p.role='teacher' and p.active;
