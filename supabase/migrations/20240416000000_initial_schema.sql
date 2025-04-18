-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS extensions;

-- Drop existing views and tables if they exist
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create customers table (consolidated from customers and customer_details)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_number SERIAL UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    email TEXT,
    birthdate DATE,
    sex TEXT,
    location TEXT,
    whatsapp_number TEXT,
    referral_source TEXT,
    medical_conditions TEXT[],
    interests TEXT[],
    profession TEXT,
    visit_reason TEXT,
    email_newsletter BOOLEAN DEFAULT false,
    age INTEGER,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Create staff table
CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    -- Link to auth.users will be added by the ALTER statement below
    full_name TEXT,
    email TEXT UNIQUE, -- Assuming staff email should be unique
    role TEXT CHECK (role IN ('staff', 'admin')) DEFAULT 'staff', -- Example roles
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Update staff table to reference auth.users instead of public.users
ALTER TABLE public.staff 
    DROP CONSTRAINT IF EXISTS staff_user_id_fkey,
    DROP COLUMN IF EXISTS user_id,
    ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Removed ADD COLUMN for first_name, last_name, email as they are in CREATE TABLE now
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS specialties TEXT[],
    ADD COLUMN IF NOT EXISTS schedule_preferences JSONB,
    ADD COLUMN IF NOT EXISTS commission_rate NUMERIC;

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL, -- Or CASCADE if bookings should be deleted with customer
    staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL, -- Or CASCADE
    service_id UUID, -- Assuming service details might be stored elsewhere or duplicated
    room_id UUID, -- Assuming room details might be stored elsewhere
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER, -- Duration in minutes
    base_price NUMERIC(10, 2),
    category TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Create memberships table
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    membership_type TEXT, -- e.g., 'Gold', 'Silver', 'Bronze'
    start_date DATE,
    end_date DATE,
    status TEXT CHECK (status IN ('active', 'inactive', 'cancelled')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method TEXT, -- e.g., 'Credit Card', 'Cash', 'Stripe'
    status TEXT CHECK (status IN ('pending', 'paid', 'failed', 'refunded')) DEFAULT 'pending',
    transaction_id TEXT, -- Optional: ID from payment processor
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Create locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    country TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Create rooms table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL, -- Optional link to location
    name TEXT NOT NULL,
    capacity INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    event_type TEXT, -- e.g., 'booking', 'blockout', 'class'
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE, -- Link to booking if applicable
    room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Create waitlist_entries table
CREATE TABLE IF NOT EXISTS public.waitlist_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    requested_time TIMESTAMPTZ,
    status TEXT CHECK (status IN ('pending', 'contacted', 'booked', 'expired')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Customers can view their own data" ON customers;
DROP POLICY IF EXISTS "Customers can update their own data" ON customers;
DROP POLICY IF EXISTS "Customers can insert their own data" ON customers;
DROP POLICY IF EXISTS "Staff can view all customer data" ON customers;
DROP POLICY IF EXISTS "Staff can update customer data" ON customers;

DROP POLICY IF EXISTS "Bookings access control" ON bookings;
DROP POLICY IF EXISTS "Bookings insert control" ON bookings;
DROP POLICY IF EXISTS "Bookings update control" ON bookings;

DROP POLICY IF EXISTS "Staff can manage services" ON services;

DROP POLICY IF EXISTS "Memberships access control" ON memberships;

DROP POLICY IF EXISTS "Payments access control" ON payments;

-- Create RLS policies for customers
CREATE POLICY "Customers can view their own data"
    ON customers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Customers can update their own data"
    ON customers FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert their own data"
    ON customers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all customer data"
    ON customers FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM staff WHERE auth_id = auth.uid()
    ));

CREATE POLICY "Staff can update customer data"
    ON customers FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM staff WHERE auth_id = auth.uid()
    ));

-- Create RLS policies for bookings
CREATE POLICY "Bookings access control"
    ON bookings FOR SELECT
    USING (
        auth.uid() IN (
            SELECT user_id FROM customers WHERE id = bookings.customer_id
            UNION
            SELECT auth_id FROM staff WHERE id = bookings.staff_id
        )
    );

CREATE POLICY "Bookings insert control"
    ON bookings FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM customers WHERE id = bookings.customer_id
            UNION
            SELECT auth_id FROM staff WHERE id = bookings.staff_id
        )
    );

CREATE POLICY "Bookings update control"
    ON bookings FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT user_id FROM customers WHERE id = bookings.customer_id
            UNION
            SELECT auth_id FROM staff WHERE id = bookings.staff_id
        )
    );

-- Create RLS policies for services
CREATE POLICY "Staff can manage services"
    ON services FOR ALL
    USING (EXISTS (
        SELECT 1 FROM staff WHERE auth_id = auth.uid()
    ));

-- Create RLS policies for memberships
CREATE POLICY "Memberships access control"
    ON memberships FOR ALL
    USING (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM staff WHERE auth_id = auth.uid())
    );

-- Create RLS policies for payments
CREATE POLICY "Payments access control"
    ON payments FOR ALL
    USING (
        auth.uid() = user_id OR
        EXISTS (SELECT 1 FROM staff WHERE auth_id = auth.uid())
    );

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
DROP TRIGGER IF EXISTS update_staff_updated_at ON staff;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at
    BEFORE UPDATE ON staff
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 