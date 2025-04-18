-- Drop all existing indexes
DROP INDEX IF EXISTS idx_customers_email CASCADE;
DROP INDEX IF EXISTS idx_customers_auth_id CASCADE;
DROP INDEX IF EXISTS idx_staff_email CASCADE;
DROP INDEX IF EXISTS idx_staff_auth_id CASCADE;
DROP INDEX IF EXISTS idx_bookings_customer_id CASCADE;
DROP INDEX IF EXISTS idx_bookings_service_id CASCADE;
DROP INDEX IF EXISTS idx_bookings_staff_id CASCADE;
DROP INDEX IF EXISTS idx_bookings_start_time CASCADE;
DROP INDEX IF EXISTS idx_visits_booking_id CASCADE;
DROP INDEX IF EXISTS idx_visits_customer_id CASCADE;
DROP INDEX IF EXISTS idx_visits_service_id CASCADE;
DROP INDEX IF EXISTS idx_visits_staff_id CASCADE;
DROP INDEX IF EXISTS idx_visits_visit_date CASCADE;
DROP INDEX IF EXISTS idx_visits_visit_id CASCADE;
DROP INDEX IF EXISTS idx_visits_status CASCADE;
DROP INDEX IF EXISTS idx_visits_overall_satisfaction CASCADE;
DROP INDEX IF EXISTS idx_visits_service_quality_rating CASCADE;
DROP INDEX IF EXISTS idx_payments_booking_id CASCADE;
DROP INDEX IF EXISTS idx_payments_customer_id CASCADE;
DROP INDEX IF EXISTS idx_memberships_customer_id CASCADE;
DROP INDEX IF EXISTS idx_passes_customer_id CASCADE;
DROP INDEX IF EXISTS idx_sales_transactions_customer_id CASCADE;
DROP INDEX IF EXISTS idx_sales_line_items_transaction_id CASCADE;
DROP INDEX IF EXISTS idx_product_variants_product_id CASCADE;

-- Drop all existing tables in the correct order (reverse dependency order)
DROP TABLE IF EXISTS waitlist_notifications CASCADE;
DROP TABLE IF EXISTS waitlist_entries CASCADE;
DROP TABLE IF EXISTS calendar_notifications CASCADE;
DROP TABLE IF EXISTS calendar_blockouts CASCADE;
DROP TABLE IF EXISTS calendar_availability CASCADE;
DROP TABLE IF EXISTS calendar_views CASCADE;
DROP TABLE IF EXISTS calendar_events CASCADE;
DROP TABLE IF EXISTS service_capacity CASCADE;
DROP TABLE IF EXISTS location_inventory CASCADE;
DROP TABLE IF EXISTS location_staff CASCADE;
DROP TABLE IF EXISTS location_services CASCADE;
DROP TABLE IF EXISTS operating_hours CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS membership_usage_log CASCADE;
DROP TABLE IF EXISTS membership_service_allowances CASCADE;
DROP TABLE IF EXISTS membership_benefits CASCADE;
DROP TABLE IF EXISTS pass_log CASCADE;
DROP TABLE IF EXISTS sales_line_items CASCADE;
DROP TABLE IF EXISTS sales_transactions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS visits CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS passes CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS product_attributes CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Drop any existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS is_staff() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS calculate_visit_metrics(TIMESTAMP WITH TIME ZONE, TIMESTAMP WITH TIME ZONE) CASCADE;
DROP FUNCTION IF EXISTS generate_visit_id() CASCADE;
DROP FUNCTION IF EXISTS check_service_ids() CASCADE;

-- Drop any existing views
DROP VIEW IF EXISTS visit_analytics CASCADE;

-- Drop any existing sequences
DROP SEQUENCE IF EXISTS visit_number_seq CASCADE; 