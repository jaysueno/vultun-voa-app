# Schema Optimization Proposal

## 1. Core Business Flows Analysis

### Key Business Processes
1. **Customer Journey**
   - Inquiries (WhatsApp/in-person)
   - Booking/Reservation
   - Service Delivery
   - Payment Processing
   - Feedback Collection

2. **Membership Management**
   - Pass/Membership Sales
   - Usage Tracking
   - Renewal Processing
   - Benefit Management

3. **Staff Operations**
   - Commission Calculation
   - Schedule Management
   - Performance Tracking
   - Manual Overrides

4. **Inventory Management**
   - Equipment Tracking
   - Room Allocation
   - Service Capacity
   - Waitlist Management

5. **Product Management**
   - Inventory Tracking
   - Sales Processing
   - Stock Management
   - Product Categories

6. **Calendar Management**
   - Event Scheduling
   - Resource Allocation
   - Availability Tracking
   - Recurring Events

## 2. Schema Structure

### User Management
1. **Customers**
   ```sql
   CREATE TABLE customers (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       email TEXT UNIQUE NOT NULL,
       phone TEXT,
       full_name TEXT NOT NULL,
       birthdate DATE,
       medical_conditions TEXT[],
       interests TEXT[],
       profession TEXT,
       visit_purpose TEXT,
       is_local BOOLEAN DEFAULT false,
       special_notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Staff**
   ```sql
   CREATE TABLE staff (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       email TEXT UNIQUE NOT NULL,
       phone TEXT,
       full_name TEXT NOT NULL,
       role TEXT CHECK (role IN ('therapist', 'instructor', 'admin')),
       qualifications TEXT[],
       commission_rate DECIMAL(5,2),
       is_active BOOLEAN DEFAULT true,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Core Business Tables
1. **Services**
   ```sql
   CREATE TABLE services (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name TEXT NOT NULL,
       category TEXT CHECK (category IN ('Massage', 'EnergeticHealing', 'Physio', 'Pilates', 'Surfing', 'Other')),
       duration INTEGER NOT NULL,
       base_price DECIMAL(10,2) NOT NULL,
       description TEXT,
       service_type TEXT CHECK (service_type IN ('OnSite', 'HomeService')),
       is_active BOOLEAN DEFAULT true,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Visits**
   ```sql
   CREATE TABLE visits (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       customer_id UUID REFERENCES customers(id),
       booking_id UUID REFERENCES bookings(id),
       service_id UUID REFERENCES services(id),
       staff_id UUID REFERENCES staff(id),
       visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
       status TEXT CHECK (status IN ('pending_survey', 'survey_completed')),
       walk_in_status TEXT CHECK (walk_in_status IN ('reservation', 'walk_in', 'other')),
       service_type TEXT CHECK (service_type IN ('Massage', 'EnergeticHealing', 'Physio', 'Pilates', 'Surfing', 'Other')),
       service_location TEXT CHECK (service_location IN ('OnSite', 'HomeService')),
       payment_amount DECIMAL(10,2),
       price DECIMAL(10,2),
       complete_status TEXT CHECK (complete_status IN ('Booking Completed', 'Booking Cancelled')),
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Bookings**
   ```sql
   CREATE TABLE bookings (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       customer_id UUID REFERENCES customers(id),
       service_id UUID REFERENCES services(id),
       staff_id UUID REFERENCES staff(id),
       room_id UUID REFERENCES rooms(id),
       start_time TIMESTAMP WITH TIME ZONE NOT NULL,
       end_time TIMESTAMP WITH TIME ZONE NOT NULL,
       status TEXT CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
       notes TEXT,
       payment_status TEXT CHECK (payment_status IN ('paid', 'unpaid')),
       commission_rate DECIMAL(5,2),
       commission_amount DECIMAL(10,2),
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **Payments**
   ```sql
   CREATE TABLE payments (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       booking_id UUID REFERENCES bookings(id),
       customer_id UUID REFERENCES customers(id),
       amount DECIMAL(10,2) NOT NULL,
       payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer')),
       status TEXT CHECK (status IN ('pending', 'completed', 'refunded')),
       payment_date TIMESTAMP WITH TIME ZONE NOT NULL,
       transaction_reference TEXT,
       commission_amount DECIMAL(10,2),
       commission_status TEXT CHECK (commission_status IN ('pending', 'paid')),
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Membership Management
1. **Passes**
   ```sql
   CREATE TABLE passes (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       customer_id UUID REFERENCES customers(id),
       pass_type TEXT CHECK (pass_type IN ('single', 'monthly', 'yearly')),
       valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
       valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
       status TEXT CHECK (status IN ('active', 'expired', 'used')),
       number_of_sessions INTEGER NOT NULL,
       sessions_used INTEGER DEFAULT 0,
       remaining_sessions INTEGER GENERATED ALWAYS AS (number_of_sessions - sessions_used) STORED,
       price DECIMAL(10,2) NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Memberships**
   ```sql
   CREATE TABLE memberships (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       customer_id UUID REFERENCES customers(id),
       membership_type TEXT CHECK (membership_type IN ('basic', 'premium', 'vip')),
       start_date TIMESTAMP WITH TIME ZONE NOT NULL,
       end_date TIMESTAMP WITH TIME ZONE NOT NULL,
       status TEXT CHECK (status IN ('active', 'expired', 'cancelled')),
       benefits TEXT[],
       discount_rate DECIMAL(5,2),
       auto_renewal BOOLEAN DEFAULT false,
       membership_card_number TEXT,
       membership_card_status TEXT CHECK (membership_card_status IN ('active', 'inactive', 'lost')),
       last_renewal_date TIMESTAMP WITH TIME ZONE,
       next_renewal_date TIMESTAMP WITH TIME ZONE,
       payment_plan TEXT CHECK (payment_plan IN ('monthly', 'quarterly', 'annual')),
       payment_status TEXT CHECK (payment_status IN ('active', 'overdue', 'cancelled')),
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Membership Service Allowances**
   ```sql
   CREATE TABLE membership_service_allowances (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       membership_id UUID REFERENCES memberships(id),
       service_id UUID REFERENCES services(id),
       service_category TEXT CHECK (service_category IN ('Pilates', 'Massage', 'Contrast Therapy', 'Other')),
       monthly_allowance INTEGER NOT NULL,
       used_allowance INTEGER DEFAULT 0,
       remaining_allowance INTEGER GENERATED ALWAYS AS (monthly_allowance - used_allowance) STORED,
       reset_date TIMESTAMP WITH TIME ZONE NOT NULL,
       carry_over BOOLEAN DEFAULT false,
       max_carry_over INTEGER,
       is_unlimited BOOLEAN DEFAULT false,
       notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **Membership Benefits**
   ```sql
   CREATE TABLE membership_benefits (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       membership_type TEXT CHECK (membership_type IN ('basic', 'premium', 'vip')),
       benefit_name TEXT NOT NULL,
       description TEXT,
       service_category TEXT CHECK (service_category IN ('Pilates', 'Massage', 'Contrast Therapy', 'Other')),
       discount_rate DECIMAL(5,2),
       is_active BOOLEAN DEFAULT true,
       start_date TIMESTAMP WITH TIME ZONE,
       end_date TIMESTAMP WITH TIME ZONE,
       priority_level INTEGER,
       terms_and_conditions TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Membership Usage Log**
   ```sql
   CREATE TABLE membership_usage_log (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       membership_id UUID REFERENCES memberships(id),
       customer_id UUID REFERENCES customers(id),
       service_id UUID REFERENCES services(id),
       visit_id UUID REFERENCES visits(id),
       usage_date TIMESTAMP WITH TIME ZONE NOT NULL,
       service_category TEXT CHECK (service_category IN ('Pilates', 'Massage', 'Contrast Therapy', 'Other')),
       allowance_used INTEGER NOT NULL,
       previous_balance INTEGER NOT NULL,
       new_balance INTEGER NOT NULL,
       notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Product Management
1. **Products**
   ```sql
   CREATE TABLE products (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name TEXT NOT NULL,
       product_type TEXT CHECK (product_type IN ('physical', 'service', 'online_course', 'retreat_package')),
       category TEXT NOT NULL,
       description TEXT,
       short_description TEXT,
       sku TEXT UNIQUE NOT NULL,
       barcode TEXT UNIQUE,
       price DECIMAL(10,2) NOT NULL,
       cost_price DECIMAL(10,2) NOT NULL,
       sale_price DECIMAL(10,2),
       is_on_sale BOOLEAN DEFAULT false,
       sale_start_date TIMESTAMP WITH TIME ZONE,
       sale_end_date TIMESTAMP WITH TIME ZONE,
       stock_quantity INTEGER NOT NULL DEFAULT 0,
       reorder_level INTEGER NOT NULL DEFAULT 0,
       is_active BOOLEAN DEFAULT true,
       is_featured BOOLEAN DEFAULT false,
       seo_title TEXT,
       seo_description TEXT,
       seo_keywords TEXT[],
       tags TEXT[],
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Product Variants**
   ```sql
   CREATE TABLE product_variants (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       product_id UUID REFERENCES products(id),
       variant_name TEXT NOT NULL,
       sku TEXT UNIQUE NOT NULL,
       barcode TEXT UNIQUE,
       price DECIMAL(10,2) NOT NULL,
       cost_price DECIMAL(10,2) NOT NULL,
       sale_price DECIMAL(10,2),
       is_on_sale BOOLEAN DEFAULT false,
       sale_start_date TIMESTAMP WITH TIME ZONE,
       sale_end_date TIMESTAMP WITH TIME ZONE,
       stock_quantity INTEGER NOT NULL DEFAULT 0,
       reorder_level INTEGER NOT NULL DEFAULT 0,
       is_active BOOLEAN DEFAULT true,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Product Attributes**
   ```sql
   CREATE TABLE product_attributes (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       attribute_name TEXT NOT NULL,
       attribute_type TEXT CHECK (attribute_type IN ('text', 'number', 'select', 'color', 'size')),
       is_required BOOLEAN DEFAULT false,
       is_filterable BOOLEAN DEFAULT false,
       values TEXT[],
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Sales Management
1. **Sales Transactions**
   ```sql
   CREATE TABLE sales_transactions (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       customer_id UUID REFERENCES customers(id),
       transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
       transaction_type TEXT CHECK (transaction_type IN ('sale', 'refund', 'exchange')),
       payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'transfer')),
       total_amount DECIMAL(10,2) NOT NULL,
       discount_amount DECIMAL(10,2) DEFAULT 0,
       tax_amount DECIMAL(10,2) DEFAULT 0,
       final_amount DECIMAL(10,2) NOT NULL,
       status TEXT CHECK (status IN ('pending', 'completed', 'refunded')),
       notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Sales Line Items**
   ```sql
   CREATE TABLE sales_line_items (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       transaction_id UUID REFERENCES sales_transactions(id),
       product_id UUID REFERENCES products(id),
       quantity INTEGER NOT NULL,
       unit_price DECIMAL(10,2) NOT NULL,
       discount_rate DECIMAL(5,2) DEFAULT 0,
       discount_amount DECIMAL(10,2) DEFAULT 0,
       tax_rate DECIMAL(5,2) DEFAULT 0,
       tax_amount DECIMAL(10,2) DEFAULT 0,
       total_amount DECIMAL(10,2) NOT NULL,
       notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Calendar Management
1. **Calendar Events**
   ```sql
   CREATE TABLE calendar_events (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       event_type TEXT CHECK (event_type IN ('booking', 'staff_schedule', 'class', 'event', 'maintenance')),
       title TEXT NOT NULL,
       description TEXT,
       start_time TIMESTAMP WITH TIME ZONE NOT NULL,
       end_time TIMESTAMP WITH TIME ZONE NOT NULL,
       location_id UUID REFERENCES locations(id),
       room_id UUID REFERENCES rooms(id),
       service_id UUID REFERENCES services(id),
       staff_id UUID REFERENCES staff(id),
       customer_id UUID REFERENCES customers(id),
       status TEXT CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled')),
       recurrence_pattern JSONB,
       is_recurring BOOLEAN DEFAULT false,
       parent_event_id UUID REFERENCES calendar_events(id),
       max_participants INTEGER DEFAULT 1,
       notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Calendar Views**
   ```sql
   CREATE TABLE calendar_views (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       view_name TEXT NOT NULL,
       view_type TEXT CHECK (view_type IN ('admin', 'staff', 'customer')),
       user_role TEXT CHECK (user_role IN ('admin', 'staff', 'customer')),
       default_view BOOLEAN DEFAULT false,
       visible_columns TEXT[],
       filter_settings JSONB,
       sort_settings JSONB,
       color_settings JSONB,
       is_active BOOLEAN DEFAULT true,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Calendar Availability**
   ```sql
   CREATE TABLE calendar_availability (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       staff_id UUID REFERENCES staff(id),
       location_id UUID REFERENCES locations(id),
       day_of_week TEXT CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
       start_time TIME NOT NULL,
       end_time TIME NOT NULL,
       is_available BOOLEAN DEFAULT true,
       service_types TEXT[],
       valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
       valid_until TIMESTAMP WITH TIME ZONE,
       notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **Calendar Blockouts**
   ```sql
   CREATE TABLE calendar_blockouts (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       location_id UUID REFERENCES locations(id),
       room_id UUID REFERENCES rooms(id),
       staff_id UUID REFERENCES staff(id),
       start_time TIMESTAMP WITH TIME ZONE NOT NULL,
       end_time TIMESTAMP WITH TIME ZONE NOT NULL,
       blockout_type TEXT CHECK (blockout_type IN ('maintenance', 'holiday', 'private_event')),
       description TEXT,
       affected_services TEXT[],
       is_recurring BOOLEAN DEFAULT false,
       recurrence_pattern JSONB,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Resource Management
1. **Locations**
   ```sql
   CREATE TABLE locations (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name TEXT NOT NULL,
       address TEXT NOT NULL,
       contact_number TEXT,
       email TEXT,
       status TEXT CHECK (status IN ('active', 'inactive', 'under_maintenance')),
       description TEXT,
       amenities TEXT[],
       notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Rooms**
   ```sql
   CREATE TABLE rooms (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       location_id UUID REFERENCES locations(id),
       name TEXT NOT NULL,
       room_type TEXT CHECK (room_type IN ('treatment', 'massage', 'pilates', 'yoga', 'iv', 'consultation', 'storage')),
       capacity INTEGER NOT NULL,
       status TEXT CHECK (status IN ('available', 'in_use', 'under_maintenance')),
       notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

3. **Equipment**
   ```sql
   CREATE TABLE equipment (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       name TEXT NOT NULL,
       category TEXT NOT NULL,
       description TEXT,
       location_id UUID REFERENCES locations(id),
       room_id UUID REFERENCES rooms(id),
       status TEXT CHECK (status IN ('available', 'in_use', 'under_maintenance')),
       last_maintenance_date TIMESTAMP WITH TIME ZONE,
       next_maintenance_date TIMESTAMP WITH TIME ZONE,
       notes TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

### Waitlist Management
1. **Waitlist Entries**
   ```sql
   CREATE TABLE waitlist_entries (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       customer_id UUID REFERENCES customers(id),
       service_id UUID REFERENCES services(id),
       location_id UUID REFERENCES locations(id),
       room_id UUID REFERENCES rooms(id),
       staff_id UUID REFERENCES staff(id),
       desired_date DATE NOT NULL,
       desired_time_range TEXT,
       priority_level TEXT CHECK (priority_level IN ('high', 'medium', 'low')),
       status TEXT CHECK (status IN ('active', 'notified', 'booked', 'cancelled')),
       position INTEGER NOT NULL,
       notes TEXT,
       notification_preferences TEXT[],
       auto_book BOOLEAN DEFAULT false,
       max_wait_time INTEGER,
       expiry_date TIMESTAMP WITH TIME ZONE,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Waitlist Notifications**
   ```sql
   CREATE TABLE waitlist_notifications (
       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
       waitlist_id UUID REFERENCES waitlist_entries(id),
       customer_id UUID REFERENCES customers(id),
       service_id UUID REFERENCES services(id),
       available_slot_id UUID REFERENCES calendar_events(id),
       notification_type TEXT CHECK (notification_type IN ('spot_available', 'auto_booked', 'position_update')),
       status TEXT CHECK (status IN ('pending', 'sent', 'failed')),
       message TEXT,
       response_status TEXT CHECK (response_status IN ('accepted', 'declined', 'no_response')),
       response_time TIMESTAMP WITH TIME ZONE,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       sent_at TIMESTAMP WITH TIME ZONE,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

## 3. Key Optimizations

### 1. Business Logic Implementation
```sql
-- Booking Status Update
CREATE OR REPLACE FUNCTION update_booking_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'paid' AND NEW.start_time >= CURRENT_TIMESTAMP THEN
        NEW.status := 'confirmed';
    ELSIF NEW.start_time < CURRENT_TIMESTAMP THEN
        NEW.status := 'completed';
    ELSE
        NEW.status := 'pending';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Commission Calculation
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
    NEW.commission_amount := NEW.amount * (
        SELECT commission_rate 
        FROM staff 
        WHERE id = NEW.staff_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Membership Usage Tracking
CREATE OR REPLACE FUNCTION track_membership_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- Update membership service allowance
    UPDATE membership_service_allowances
    SET used_allowance = used_allowance + 1
    WHERE membership_id = NEW.membership_id
    AND service_id = NEW.service_id;
    
    -- Log the usage
    INSERT INTO membership_usage_log (
        membership_id, customer_id, service_id, visit_id,
        usage_date, service_category, allowance_used,
        previous_balance, new_balance
    )
    SELECT 
        NEW.membership_id, NEW.customer_id, NEW.service_id, NEW.id,
        CURRENT_TIMESTAMP, s.category, 1,
        msa.used_allowance - 1, msa.used_allowance
    FROM services s
    JOIN membership_service_allowances msa ON s.id = msa.service_id
    WHERE s.id = NEW.service_id
    AND msa.membership_id = NEW.membership_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Waitlist Processing
CREATE OR REPLACE FUNCTION process_waitlist()
RETURNS TRIGGER AS $$
BEGIN
    -- When a booking is cancelled, check waitlist
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        -- Find next customer in waitlist
        INSERT INTO bookings (
            customer_id, service_id, staff_id, room_id,
            start_time, end_time, status
        )
        SELECT 
            we.customer_id, we.service_id, 
            (SELECT id FROM staff WHERE is_active = true ORDER BY RANDOM() LIMIT 1),
            (SELECT id FROM rooms WHERE status = 'available' ORDER BY RANDOM() LIMIT 1),
            NEW.start_time, NEW.end_time, 'confirmed'
        FROM waitlist_entries we
        WHERE we.service_id = NEW.service_id
        AND we.desired_date = NEW.start_time::date
        AND we.status = 'active'
        AND we.auto_book = true
        ORDER BY we.priority_level DESC, we.position ASC
        LIMIT 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2. Performance Views
```sql
-- Visit Analytics View
CREATE VIEW visit_analytics AS
SELECT 
    v.id as visit_id,
    v.visit_date,
    c.full_name as customer_name,
    s.name as service_name,
    st.full_name as staff_name,
    v.satisfaction_rating,
    v.service_quality_rating,
    v.staff_rating,
    v.facility_rating,
    v.overall_experience_rating,
    v.would_recommend,
    v.payment_status,
    v.amount_paid,
    v.commission_amount
FROM visits v
JOIN customers c ON v.customer_id = c.id
JOIN services s ON v.service_id = s.id
JOIN staff st ON v.staff_id = st.id
ORDER BY v.visit_date DESC;

-- Staff Performance View
CREATE VIEW staff_performance AS
SELECT 
    s.id as staff_id,
    s.full_name as staff_name,
    COUNT(v.id) as total_visits,
    AVG(v.staff_rating) as avg_rating,
    COUNT(CASE WHEN v.would_recommend = true THEN 1 END) as recommended_count,
    SUM(v.commission_amount) as total_commission,
    COUNT(DISTINCT v.customer_id) as unique_customers
FROM staff s
LEFT JOIN visits v ON s.id = v.staff_id
WHERE v.status = 'completed'
GROUP BY s.id, s.full_name;

-- Calendar Availability View
CREATE VIEW calendar_availability_summary AS
SELECT 
    s.id as staff_id,
    s.full_name as staff_name,
    l.id as location_id,
    l.name as location_name,
    r.id as room_id,
    r.name as room_name,
    ce.start_time,
    ce.end_time,
    ce.event_type,
    ce.status
FROM staff s
CROSS JOIN locations l
CROSS JOIN rooms r
LEFT JOIN calendar_events ce ON ce.staff_id = s.id 
    AND ce.location_id = l.id 
    AND ce.room_id = r.id
WHERE s.is_active = true
    AND r.status = 'available'
ORDER BY s.full_name, l.name, r.name, ce.start_time;
```

## 4. Implementation Strategy

### Phase 1: MVP Setup
1. Core tables (Customers, Staff, Services, Bookings)
2. Basic payment processing
3. Simple booking system
4. Equipment tracking

### Phase 2: Enhanced Features
1. Waitlist system
2. Membership management
3. Advanced reporting
4. Staff scheduling

### Phase 3: Optimization
1. Performance tuning
2. Advanced analytics
3. Automated notifications
4. Integration features

## 5. Benefits

### 1. Business Focus
- Clear separation of concerns
- Specific user type handling
- Detailed resource tracking
- Comprehensive waitlist management

### 2. Technical Advantages
- Optimized queries
- Efficient data access
- Scalable structure
- Maintainable code

### 3. Future Growth
- Easy to extend
- Flexible for new features
- Supports multiple locations
- Handles increased load

## 6. Next Steps

1. **Documentation**
   - [ ] Update schema documentation
   - [ ] Create migration guide
   - [ ] Document business rules
   - [ ] Create user guides

2. **Implementation**
   - [ ] Create migration scripts
   - [ ] Set up testing environment
   - [ ] Implement core features
   - [ ] Test performance

3. **Training**
   - [ ] Create training materials
   - [ ] Document best practices
   - [ ] Set up support system
   - [ ] Create troubleshooting guide 