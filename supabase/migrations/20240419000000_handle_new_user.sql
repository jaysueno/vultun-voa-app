-- Function to automatically create a customer profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.customers (user_id, email, full_name, created_at, updated_at)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', -- Extract full_name from metadata
    timezone('utc'::text, now()),
    timezone('utc'::text, now())
  );
  return new;
end;
$$;

-- Trigger to call the function after a new user is inserted into auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 