-- Clear existing data in reverse dependency order
-- Assuming calendar_events and waitlist_entries depend on bookings
TRUNCATE TABLE public.calendar_events, public.waitlist_entries CASCADE;
TRUNCATE TABLE public.payments CASCADE; -- Depends on bookings
TRUNCATE TABLE public.bookings CASCADE; -- Depends on customers, staff, services, rooms
TRUNCATE TABLE public.memberships CASCADE; -- Depends on auth.users
TRUNCATE TABLE public.customers CASCADE; -- Depends on auth.users
TRUNCATE TABLE public.staff CASCADE; -- Depends on auth.users
TRUNCATE TABLE public.services CASCADE;
TRUNCATE TABLE public.rooms CASCADE; -- Depends on locations
TRUNCATE TABLE public.locations CASCADE;
-- NOTE: We typically don't truncate auth.users directly via seed unless absolutely necessary
-- TRUNCATE TABLE auth.users CASCADE;

-- Insert test locations
INSERT INTO public.locations (id, name, address, city, country, is_active)
VALUES
  ('99999999-9999-9999-9999-999999999999', 'Main Studio', '123 Main St', 'Los Angeles', 'USA', true);

-- Insert test services
-- Removed capacity column as it's not in the schema
INSERT INTO public.services (id, name, description, duration, base_price, category, is_active)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Reformer Pilates - Private', 'Private Pilates session on the reformer', 60, 75.00, 'Pilates', true),
  ('22222222-2222-2222-2222-222222222222', 'Pilates Mat Class', 'Group mat Pilates class', 45, 25.00, 'Pilates', true),
  ('33333333-3333-3333-3333-333333333333', 'Therapeutic Massage', 'Full body therapeutic massage', 60, 85.00, 'Massage', true);

-- Insert test rooms
-- Removed equipment_type column as it's not in the schema
-- Assuming location_id needs to be added to the rooms schema later if needed
INSERT INTO public.rooms (id, name, capacity, is_active)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Reformer Studio 1', 1, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Mat Studio', 8, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Massage Room 1', 1, true);

-- -- Insert test staff (COMMENTED OUT - Requires existing auth.users)
-- INSERT INTO public.staff (id, auth_id, full_name, email, role, bio, specialties, commission_rate, is_active)
-- VALUES
--   -- Replace 'AUTH_STAFF_ID_1'/'AUTH_STAFF_ID_2' with actual auth.users IDs
--   ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'b5f37e7d-6e42-4c8b-9c25-78b5531b0123', 'Staff One', 'staff1@vultun.com', 'staff', 'Experienced Pilates instructor', ARRAY['Pilates', 'Yoga'], 0.60, true),
--   ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'c6f48e8e-7f53-5d9c-0d36-89c6642c1234', 'Staff Two', 'staff2@vultun.com', 'staff', 'Licensed massage therapist', ARRAY['Massage', 'Physical Therapy'], 0.60, true);

-- -- Insert test customers (COMMENTED OUT - Requires existing auth.users)
-- INSERT INTO public.customers (id, user_id, customer_number, first_name, last_name, email, birthdate, sex, location, whatsapp_number, referral_source, medical_conditions, interests, profession, visit_reason, email_newsletter)
-- VALUES
--   -- Replace 'AUTH_USER_ID_1' etc. with actual auth.users IDs
--   ('41e6bea0-e9e9-4e7c-aeaf-de7fef8c63bd', 'd7f59f9f-8f64-6e0d-1e47-90d7753c2345', 1, 'Customer', 'One', 'customer1@example.com', '1990-01-01', 'Male', 'Location A', '+639123456792', 'Website', ARRAY[]::TEXT[], ARRAY['Surfing', 'Hiking'], 'Developer', 'Relaxation', TRUE),
--   ('2883b88e-4d29-4ff5-b3b4-d08bc9803347', 'e8f60f0f-9f75-7f1e-2f58-01e8864d3456', 2, 'Customer', 'Two', 'customer2@example.com', '1985-05-10', 'Female', 'Location B', '+639123456793', 'Friend', ARRAY['Allergy to Nuts'], ARRAY['Yoga', 'Reading'], 'Manager', 'Wellness', FALSE);

-- -- Insert test bookings (COMMENTED OUT - Requires existing customers, staff, etc.)
-- INSERT INTO public.bookings (id, customer_id, staff_id, service_id, room_id, start_time, end_time, status, notes)
-- VALUES
--   (uuid_generate_v4(), '41e6bea0-e9e9-4e7c-aeaf-de7fef8c63bd', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', timezone('utc', now() + interval '1 day'), timezone('utc', now() + interval '1 day' + interval '60 minutes'), 'confirmed', 'First booking test'),
--   (uuid_generate_v4(), '2883b88e-4d29-4ff5-b3b4-d08bc9803347', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'cccccccc-cccc-cccc-cccc-cccccccccccc', timezone('utc', now() + interval '2 days'), timezone('utc', now() + interval '2 days' + interval '60 minutes'), 'pending', 'Massage booking test');

-- Note: Removed complex recursive booking and calendar event creation for simplicity.
-- Note: Removed seed data referencing the old public.users table.
-- Note: Updated TRUNCATE statements to use CASCADE and correct table names.
-- Note: Ensure UUIDs used for foreign keys (user_id, staff_id, etc.) actually exist in their respective tables.
-- Note: Removed columns from INSERT statements that are not defined in the initial schema (e.g., capacity, equipment_type, state, date_of_birth). 