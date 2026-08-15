-- Auto-creates a `public.profiles` row whenever Supabase Auth inserts a
-- new `auth.users` row. `full_name` and `role` come from the signup
-- call's metadata (see src/application/auth/sign-up.ts) — `role`
-- defaults to 'STUDENT' so a signup that somehow omits it still gets a
-- valid, least-privileged role rather than failing the insert.
--
-- This lives outside prisma/schema.prisma on purpose: Prisma doesn't
-- model `auth.users` (Supabase owns that schema), so a trigger on it
-- can't be expressed as a Prisma migration. Apply/re-apply with:
--   npx prisma db execute --file prisma/triggers/handle-new-user.sql

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'STUDENT')::public.user_role
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- A real foreign key from `profiles.id` to `auth.users.id` would need
-- Prisma's multiSchema preview feature enabled project-wide (so `prisma
-- db push`/introspection can resolve the cross-schema reference) just
-- for this one constraint. A delete trigger gets the same outcome —
-- deleting an auth user also deletes their profile, no orphaned row
-- left behind — without that cost.
alter table public.profiles
  drop constraint if exists profiles_id_fkey;

create or replace function public.handle_deleted_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.profiles where id = old.id;
  return old;
end;
$$;

drop trigger if exists on_auth_user_deleted on auth.users;

create trigger on_auth_user_deleted
  before delete on auth.users
  for each row
  execute function public.handle_deleted_user();
