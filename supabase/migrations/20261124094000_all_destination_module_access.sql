alter table public.module_access drop constraint module_access_country_id_check;
alter table public.module_access add constraint module_access_country_id_check check (country_id in ('uk','australia','canada','usa','india','ireland','south-africa','new-zealand','jamaica','malta','singapore','hawaii','new-york','texas','california'));
