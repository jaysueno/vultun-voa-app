# Airtable Schema Analysis

## 1. Table Structure Analysis

### Customers Table
- **Primary Fields:**
  - Customer ID (Formula: CUST-YYYY-XXXX-Name)
  - Created (DateTime)
  - Last Modified (DateTime)
  - Email
  - Email Newsletter Sign Up (Single Select)
  - Full Name (Formula: First Name + Last Name)
  - Birthdate (DateTime)
  - Sex (Single Select: Female/Male)
  - First Name
  - Last Name
  - Location
  - WhatsApp Number
  - Medical Condition
  - Interests
  - Profession
  - Visit Purpose (Multiline Text)
  - Siargao Local? (Single Select: Yes/No)
  - Special Notes (Multiline Text)

### Visits Table
- **Primary Fields:**
  - Visit ID (Formula: VISIT-YYYY-MM-XXXX)
  - Date of Visit (DateTime)
  - Created (DateTime)
  - Last Modified (DateTime)
  - Date of Visit New (Lookup from Bookings)
  - Customers (from Bookings ID)
  - Service ID (Multiple Record Links)
  - Therapist ID (Single Record Link)
  - Room or Equipment (Multiple Record Links)
  - Status (Single Select: Pending survey/Survey Completed)
  - Walk-in / Reservation (Single Select: Reservation/n/a/Walk in/Other)
  - Service Type (Lookup from Service ID: Massage/EnergeticHealing/Physio/Pilates/Surfing/Other)
  - Service Location (Lookup from Service ID: OnSite/HomeService)

- **Financial Fields:**
  - Payment Amount (Rollup from Bookings)
  - Price (Lookup from Service ID)
  - Complete Status (Lookup from Bookings: Booking Completed/Booking Cancelled)

### Bookings Table
- **Primary Fields:**
  - Booking ID (Formula)
  - Customer (Link to Customers)
  - Service (Link to Services)
  - Date (DateTime)
  - Time (Time)
  - Status (Single Select: Pending/Confirmed/Completed)
  - Notes (Long Text)
  - Payment Status (Single Select: Paid/Unpaid)
  - Commission Rate (Number)
  - Commission Amount (Formula: Service Price * Commission Rate)

### Services Table
- **Primary Fields:**
  - Service Name (Text)
  - Category (Single Select)
  - Duration (Number, minutes)
  - Price (Currency)
  - Description (Long Text)
  - Service Type (Single Select: Massage/EnergeticHealing/Physio/Pilates/Surfing/Other)
  - Service Location (Single Select: OnSite/HomeService)
  - Is Active (Boolean)

### Staff/Therapists Table
- **Primary Fields:**
  - Name (Text)
  - Is Active (Boolean)
  - Commission Rate (Number)
  - Schedule (Multiple Record Links to Bookings)
  - Performance Metrics (Rollup from Bookings)

### Payments Table
- **Primary Fields:**
  - Payment ID (Formula)
  - Booking ID (Link to Bookings)
  - Customer ID (Link to Customers)
  - Amount (Currency)
  - Payment Method (Single Select: Cash/Card/Transfer)
  - Payment Status (Single Select: Paid/Unpaid/Refunded)
  - Payment Date (DateTime)
  - Transaction Reference (Text)
  - Commission Amount (Formula)
  - Commission Status (Single Select: Pending/Paid)

### Passes Table
- **Primary Fields:**
  - Pass ID (Formula)
  - Customer ID (Link to Customers)
  - Pass Type (Single Select: Single/Monthly/Yearly)
  - Valid From (DateTime)
  - Valid Until (DateTime)
  - Status (Single Select: Active/Expired/Used)
  - Number of Sessions (Number)
  - Sessions Used (Rollup from Visits)
  - Remaining Sessions (Formula)
  - Price (Currency)

### Memberships Table
- **Primary Fields:**
  - Membership ID (Formula)
  - Customer ID (Link to Customers)
  - Membership Type (Single Select: Basic/Premium/VIP)
  - Start Date (DateTime)
  - End Date (DateTime)
  - Status (Single Select: Active/Expired/Cancelled)
  - Benefits (Multiple Select)
  - Discount Rate (Number)
  - Auto-Renewal (Boolean)
  - Monthly Service Allowances (Multiple Record Links to Membership Service Allowances)
  - Unlimited Services (Multiple Record Links to Services)
  - Membership Card Number (Text)
  - Membership Card Status (Single Select: Active/Inactive/Lost)
  - Last Renewal Date (DateTime)
  - Next Renewal Date (DateTime)
  - Payment Plan (Single Select: Monthly/Quarterly/Annual)
  - Payment Status (Single Select: Active/Overdue/Cancelled)

### Membership Service Allowances Table
- **Primary Fields:**
  - Allowance ID (Formula)
  - Membership ID (Link to Memberships)
  - Service ID (Link to Services)
  - Service Category (Single Select: Pilates/Massage/Contrast Therapy/Other)
  - Monthly Allowance (Number)
  - Used Allowance (Rollup from Visits)
  - Remaining Allowance (Formula)
  - Reset Date (DateTime)
  - Carry Over (Boolean)
  - Max Carry Over (Number)
  - Is Unlimited (Boolean)
  - Notes (Long Text)

### Membership Benefits Table
- **Primary Fields:**
  - Benefit ID (Formula)
  - Membership Type (Single Select: Basic/Premium/VIP)
  - Benefit Name (Text)
  - Description (Long Text)
  - Service Category (Single Select: Pilates/Massage/Contrast Therapy/Other)
  - Discount Rate (Number)
  - Is Active (Boolean)
  - Start Date (DateTime)
  - End Date (DateTime)
  - Priority Level (Number)
  - Terms and Conditions (Long Text)

### Membership Usage Log Table
- **Primary Fields:**
  - Log ID (Formula)
  - Membership ID (Link to Memberships)
  - Customer ID (Link to Customers)
  - Service ID (Link to Services)
  - Visit ID (Link to Visits)
  - Usage Date (DateTime)
  - Service Category (Single Select: Pilates/Massage/Contrast Therapy/Other)
  - Allowance Used (Number)
  - Previous Balance (Number)
  - New Balance (Number)
  - Notes (Long Text)

### Sales Transactions Table
- **Primary Fields:**
  - Transaction ID (Formula)
  - Customer ID (Link to Customers)
  - Transaction Date (DateTime)
  - Transaction Type (Single Select: Sale/Refund/Exchange)
  - Payment Method (Single Select: Cash/Card/Transfer)
  - Total Amount (Currency)
  - Discount Amount (Currency)
  - Tax Amount (Currency)
  - Final Amount (Formula: Total Amount - Discount Amount + Tax Amount)
  - Status (Single Select: Pending/Completed/Refunded)
  - Notes (Long Text)

### Sales Line Items Table
- **Primary Fields:**
  - Line Item ID (Formula)
  - Transaction ID (Link to Sales Transactions)
  - Item ID (Link to Items)
  - Quantity (Number)
  - Unit Price (Currency)
  - Discount Rate (Number)
  - Discount Amount (Currency)
  - Tax Rate (Number)
  - Tax Amount (Currency)
  - Total Amount (Formula: (Quantity * Unit Price) - Discount Amount + Tax Amount)
  - Notes (Long Text)

### Items Table
- **Primary Fields:**
  - Item ID (Formula)
  - Item Name (Text)
  - Category (Single Select)
  - Description (Long Text)
  - Unit Price (Currency)
  - Cost Price (Currency)
  - Stock Quantity (Number)
  - Reorder Level (Number)
  - Is Active (Boolean)
  - SKU (Text)
  - Barcode (Text)

### Pass Log Table
- **Primary Fields:**
  - Log ID (Formula)
  - Pass ID (Link to Passes)
  - Customer ID (Link to Customers)
  - Action Type (Single Select: Purchase/Use/Extend/Refund)
  - Action Date (DateTime)
  - Previous Status (Single Select)
  - New Status (Single Select)
  - Sessions Before (Number)
  - Sessions After (Number)
  - Notes (Long Text)

### Additional Relationships
- **Customer Passes:**
  - Multiple Record Links to Passes
  - Special Image (Formula based on membership)
  - Membership Card (Formula with image)
  - Has Membership? (Single Select: Yes/No)

- **Sales Transactions:**
  - Multiple Record Links to Transactions
  - Sanitized Name (Formula: UPPER(SUBSTITUTE(name, " ", "")))

- **Payments:**
  - Multiple Record Links to Payments
  - Bookings 2 and Bookings 3 (Multiple Record Links)

### Relationships
- **Visits Table Link:**
  - Multiple Record Links to Visits
  - Rollup Fields:
    - Number of Visits
    - Last Visit Date
    - Services Used
    - Additional Notes
- **Bookings Table Link:**
  - Bookings field
  - Date of Booking Rollup

### Initial Observations
1. **Customer ID Generation:**
   - Complex formula: "CUST-" + YEAR + "-" + padded number + "-" + name
   - Could be simplified in Supabase using UUID
   - Consider keeping the format for business continuity

2. **Data Types:**
   - Multiple text fields that could be normalized
   - Single Select fields that should be enums
   - Complex rollup calculations that need to be converted

### Products Table
- **Primary Fields:**
  - Product ID (Formula)
  - Product Name (Text)
  - Product Type (Single Select: Physical/Service/Online Course/Retreat Package)
  - Category (Single Select)
  - Description (Long Text)
  - Short Description (Text)
  - SKU (Text)
  - Barcode (Text)
  - Price (Currency)
  - Cost Price (Currency)
  - Sale Price (Currency)
  - Is On Sale (Boolean)
  - Sale Start Date (DateTime)
  - Sale End Date (DateTime)
  - Stock Quantity (Number)
  - Reorder Level (Number)
  - Is Active (Boolean)
  - Is Featured (Boolean)
  - Product Images (Multiple Attachments)
  - Product Videos (Multiple Attachments)
  - Product Documents (Multiple Attachments)
  - SEO Title (Text)
  - SEO Description (Text)
  - SEO Keywords (Text)
  - Tags (Multiple Select)

### Product Variants Table
- **Primary Fields:**
  - Variant ID (Formula)
  - Product ID (Link to Products)
  - Variant Name (Text)
  - SKU (Text)
  - Barcode (Text)
  - Price (Currency)
  - Cost Price (Currency)
  - Sale Price (Currency)
  - Is On Sale (Boolean)
  - Sale Start Date (DateTime)
  - Sale End Date (DateTime)
  - Stock Quantity (Number)
  - Reorder Level (Number)
  - Is Active (Boolean)
  - Attributes (Multiple Record Links to Product Attributes)

### Product Attributes Table
- **Primary Fields:**
  - Attribute ID (Formula)
  - Attribute Name (Text)
  - Attribute Type (Single Select: Text/Number/Select/Color/Size)
  - Is Required (Boolean)
  - Is Filterable (Boolean)
  - Values (Multiple Select)

### Online Courses Table
- **Primary Fields:**
  - Course ID (Formula)
  - Product ID (Link to Products)
  - Course Name (Text)
  - Description (Long Text)
  - Duration (Number, minutes)
  - Level (Single Select: Beginner/Intermediate/Advanced)
  - Prerequisites (Multiple Record Links to Courses)
  - Lessons (Multiple Record Links to Course Lessons)
  - Instructor (Link to Staff)
  - Start Date (DateTime)
  - End Date (DateTime)
  - Max Students (Number)
  - Current Students (Rollup)
  - Status (Single Select: Draft/Published/Archived)
  - Course Materials (Multiple Attachments)
  - Course Requirements (Multiple Select)

### Course Lessons Table
- **Primary Fields:**
  - Lesson ID (Formula)
  - Course ID (Link to Online Courses)
  - Lesson Name (Text)
  - Description (Long Text)
  - Duration (Number, minutes)
  - Video URL (Text)
  - Materials (Multiple Attachments)
  - Order (Number)
  - Is Published (Boolean)

### Retreat Packages Table
- **Primary Fields:**
  - Package ID (Formula)
  - Product ID (Link to Products)
  - Package Name (Text)
  - Description (Long Text)
  - Duration (Number, days)
  - Start Date (DateTime)
  - End Date (DateTime)
  - Location (Text)
  - Max Participants (Number)
  - Current Participants (Rollup)
  - Status (Single Select: Draft/Published/Archived)
  - Activities (Multiple Record Links to Services)
  - Accommodation (Text)
  - Meals (Text)
  - Transportation (Text)
  - Requirements (Multiple Select)
  - Images (Multiple Attachments)

### Additional Relationships
- **Products:**
  - Multiple Record Links to Products

### Locations Table
- **Primary Fields:**
  - Location ID (Formula)
  - Location Name (Text)
  - Address (Long Text)
  - Contact Number (Text)
  - Email (Text)
  - Operating Hours (Multiple Record Links to Operating Hours)
  - Status (Single Select: Active/Inactive/Under Maintenance)
  - Description (Long Text)
  - Images (Multiple Attachments)
  - Amenities (Multiple Select)
  - Notes (Long Text)

### Operating Hours Table
- **Primary Fields:**
  - Schedule ID (Formula)
  - Location ID (Link to Locations)
  - Day of Week (Single Select: Monday-Sunday)
  - Open Time (Time)
  - Close Time (Time)
  - Is Closed (Boolean)
  - Special Notes (Text)
  - Valid From (DateTime)
  - Valid Until (DateTime)

### Location Services Table
- **Primary Fields:**
  - Location Service ID (Formula)
  - Location ID (Link to Locations)
  - Service ID (Link to Services)
  - Price (Currency)
  - Is Available (Boolean)
  - Max Capacity (Number)
  - Room/Area (Text)
  - Equipment Required (Multiple Record Links to Equipment)
  - Staff Required (Multiple Record Links to Staff)
  - Notes (Long Text)

### Equipment Table
- **Primary Fields:**
  - Equipment ID (Formula)
  - Name (Text)
  - Category (Single Select)
  - Description (Long Text)
  - Location ID (Link to Locations)
  - Room/Area (Text)
  - Status (Single Select: Available/In Use/Under Maintenance)
  - Last Maintenance Date (DateTime)
  - Next Maintenance Date (DateTime)
  - Notes (Long Text)

### Rooms/Areas Table
- **Primary Fields:**
  - Room ID (Formula)
  - Location ID (Link to Locations)
  - Room Name (Text)
  - Room Type (Single Select: Treatment/Massage/Pilates/Yoga/IV/Consultation/Storage)
  - Capacity (Number)
  - Status (Single Select: Available/In Use/Under Maintenance)
  - Equipment (Multiple Record Links to Equipment)
  - Notes (Long Text)

### Location Inventory Table
- **Primary Fields:**
  - Inventory ID (Formula)
  - Location ID (Link to Locations)
  - Item ID (Link to Items)
  - Current Stock (Number)
  - Minimum Stock (Number)
  - Reorder Level (Number)
  - Last Stock Count (DateTime)
  - Next Stock Count (DateTime)
  - Notes (Long Text)

### Calendar Events Table
- **Primary Fields:**
  - Event ID (Formula)
  - Event Type (Single Select: Booking/Staff Schedule/Class/Event/Maintenance)
  - Title (Text)
  - Description (Long Text)
  - Start Time (DateTime)
  - End Time (DateTime)
  - Location ID (Link to Locations)
  - Room ID (Link to Rooms)
  - Service ID (Link to Services)
  - Staff ID (Link to Staff)
  - Customer ID (Link to Customers)
  - Status (Single Select: Scheduled/Confirmed/In Progress/Completed/Cancelled)
  - Recurrence Pattern (JSON)
  - Is Recurring (Boolean)
  - Parent Event ID (Link to Calendar Events)
  - Max Participants (Number)
  - Current Participants (Rollup)
  - Notes (Long Text)
  - Created By (Link to Users)
  - Last Modified By (Link to Users)

### Calendar Views Table
- **Primary Fields:**
  - View ID (Formula)
  - View Name (Text)
  - View Type (Single Select: Admin/Staff/Customer)
  - User Role (Single Select: Admin/Staff/Customer)
  - Default View (Boolean)
  - Visible Columns (Multiple Select)
  - Filter Settings (JSON)
  - Sort Settings (JSON)
  - Color Settings (JSON)
  - Is Active (Boolean)

### Calendar Availability Table
- **Primary Fields:**
  - Availability ID (Formula)
  - Staff ID (Link to Staff)
  - Location ID (Link to Locations)
  - Day of Week (Single Select: Monday-Sunday)
  - Start Time (Time)
  - End Time (Time)
  - Is Available (Boolean)
  - Service Types (Multiple Select)
  - Valid From (DateTime)
  - Valid Until (DateTime)
  - Notes (Long Text)

### Calendar Blockouts Table
- **Primary Fields:**
  - Blockout ID (Formula)
  - Location ID (Link to Locations)
  - Room ID (Link to Rooms)
  - Staff ID (Link to Staff)
  - Start Time (DateTime)
  - End Time (DateTime)
  - Blockout Type (Single Select: Maintenance/Holiday/Private Event)
  - Description (Long Text)
  - Affected Services (Multiple Select)
  - Is Recurring (Boolean)
  - Recurrence Pattern (JSON)

### Calendar Notifications Table
- **Primary Fields:**
  - Notification ID (Formula)
  - Event ID (Link to Calendar Events)
  - User ID (Link to Users)
  - Notification Type (Single Select: Email/SMS/In-App)
  - Notification Time (DateTime)
  - Status (Single Select: Pending/Sent/Failed)
  - Message (Long Text)
  - Read Status (Boolean)
  - Action Required (Boolean)

### Waitlist Entries Table
- **Primary Fields:**
  - Waitlist ID (Formula)
  - Customer ID (Link to Customers)
  - Service ID (Link to Services)
  - Location ID (Link to Locations)
  - Room ID (Link to Rooms)
  - Staff ID (Link to Staff)
  - Desired Date (DateTime)
  - Desired Time Range (Text)
  - Priority Level (Single Select: High/Medium/Low)
  - Status (Single Select: Active/Notified/Booked/Cancelled)
  - Position (Number)
  - Notes (Long Text)
  - Created At (DateTime)
  - Last Modified (DateTime)
  - Notification Preferences (Multiple Select: Email/SMS/In-App)
  - Auto-Book (Boolean)
  - Max Wait Time (Number, days)
  - Expiry Date (DateTime)

### Waitlist Notifications Table
- **Primary Fields:**
  - Notification ID (Formula)
  - Waitlist ID (Link to Waitlist Entries)
  - Customer ID (Link to Customers)
  - Service ID (Link to Services)
  - Available Slot ID (Link to Calendar Events)
  - Notification Type (Single Select: Spot Available/Auto-Booked/Position Update)
  - Status (Single Select: Pending/Sent/Failed)
  - Message (Long Text)
  - Created At (DateTime)
  - Sent At (DateTime)
  - Response Status (Single Select: Accepted/Declined/No Response)
  - Response Time (DateTime)

### Service Capacity Table
- **Primary Fields:**
  - Capacity ID (Formula)
  - Service ID (Link to Services)
  - Location ID (Link to Locations)
  - Room ID (Link to Rooms)
  - Equipment ID (Link to Equipment)
  - Max Capacity (Number)
  - Current Bookings (Rollup)
  - Available Slots (Formula)
  - Waitlist Size (Rollup)
  - Average Wait Time (Formula)
  - Notes (Long Text)

## 2. Optimization Opportunities

### Data Types
1. **Consider Changing:**
   - Formula-based IDs → UUID with display format
   - Single Select fields → Enums
   - Multiple text fields → Normalized tables
   - Rollup fields → Views or materialized views

### Relationships
1. **Potential Improvements:**
   - Create proper foreign key constraints
   - Implement cascading updates/deletes
   - Normalize repeated information
   - Create lookup tables for common values
   - Consolidate multiple booking links into a single relationship
   - Create proper membership tracking system
   - Create service type and location enums
   - Implement proper status tracking system
   - Create proper commission tracking system
   - Implement proper schedule management
   - Create proper payment tracking system
   - Implement pass validation system
   - Create membership benefits system
   - Create proper inventory management
   - Implement sales tracking system
   - Create pass usage tracking
   - Create product management system
   - Implement variant tracking
   - Create course management system
   - Implement retreat management

## 3. Migration Strategy

### Phase 1: Core Structure
1. **Tables to Create:**
   ```sql
   -- Locations
   CREATE TABLE locations (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     address TEXT NOT NULL,
     contact_number TEXT,
     email TEXT,
     status TEXT CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
     description TEXT,
     amenities TEXT[],
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Operating Hours
   CREATE TABLE operating_hours (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
     day_of_week TEXT CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
     open_time TIME NOT NULL,
     close_time TIME NOT NULL,
     is_closed BOOLEAN DEFAULT false,
     special_notes TEXT,
     valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
     valid_until TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Services
   CREATE TABLE services (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     service_type TEXT CHECK (service_type IN (
       'Massage', 'EnergeticHealing', 'Pilates', 'Yoga', 'Breathwork',
       'IVTherapy', 'Consultation', 'SurfLesson', 'SurfRental'
     )),
     category TEXT CHECK (category IN ('Wellness', 'Fitness', 'Sports', 'Medical')),
     description TEXT,
     duration INTEGER NOT NULL,
     base_price DECIMAL(10,2) NOT NULL,
     is_active BOOLEAN DEFAULT true,
     requirements TEXT[],
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Location Services
   CREATE TABLE location_services (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
     service_id UUID REFERENCES services(id) ON DELETE CASCADE,
     price DECIMAL(10,2) NOT NULL,
     is_available BOOLEAN DEFAULT true,
     max_capacity INTEGER NOT NULL DEFAULT 1,
     room_id UUID REFERENCES rooms(id),
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Equipment
   CREATE TABLE equipment (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     category TEXT NOT NULL,
     description TEXT,
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
     room_id UUID REFERENCES rooms(id),
     status TEXT CHECK (status IN ('Available', 'In Use', 'Under Maintenance')),
     last_maintenance_date TIMESTAMP WITH TIME ZONE,
     next_maintenance_date TIMESTAMP WITH TIME ZONE,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Rooms/Areas
   CREATE TABLE rooms (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     room_type TEXT CHECK (room_type IN (
       'Treatment', 'Massage', 'Pilates', 'Yoga', 'IV',
       'Consultation', 'Storage'
     )),
     capacity INTEGER NOT NULL DEFAULT 1,
     status TEXT CHECK (status IN ('Available', 'In Use', 'Under Maintenance')),
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Location Inventory
   CREATE TABLE location_inventory (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
     item_id UUID REFERENCES items(id) ON DELETE CASCADE,
     current_stock INTEGER NOT NULL DEFAULT 0,
     minimum_stock INTEGER NOT NULL DEFAULT 0,
     reorder_level INTEGER NOT NULL DEFAULT 0,
     last_stock_count TIMESTAMP WITH TIME ZONE,
     next_stock_count TIMESTAMP WITH TIME ZONE,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Location Staff
   CREATE TABLE location_staff (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
     staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
     role TEXT NOT NULL,
     is_active BOOLEAN DEFAULT true,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Calendar Events
   CREATE TABLE calendar_events (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     event_type TEXT CHECK (event_type IN ('Booking', 'Staff Schedule', 'Class', 'Event', 'Maintenance')),
     title TEXT NOT NULL,
     description TEXT,
     start_time TIMESTAMP WITH TIME ZONE NOT NULL,
     end_time TIMESTAMP WITH TIME ZONE NOT NULL,
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
     room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
     service_id UUID REFERENCES services(id) ON DELETE CASCADE,
     staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     status TEXT CHECK (status IN ('Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled')),
     recurrence_pattern JSONB,
     is_recurring BOOLEAN DEFAULT false,
     parent_event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
     max_participants INTEGER DEFAULT 1,
     notes TEXT,
     created_by UUID REFERENCES users(id) ON DELETE SET NULL,
     last_modified_by UUID REFERENCES users(id) ON DELETE SET NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Calendar Views
   CREATE TABLE calendar_views (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     view_name TEXT NOT NULL,
     view_type TEXT CHECK (view_type IN ('Admin', 'Staff', 'Customer')),
     user_role TEXT CHECK (user_role IN ('Admin', 'Staff', 'Customer')),
     default_view BOOLEAN DEFAULT false,
     visible_columns TEXT[],
     filter_settings JSONB,
     sort_settings JSONB,
     color_settings JSONB,
     is_active BOOLEAN DEFAULT true,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Calendar Availability
   CREATE TABLE calendar_availability (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
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

   -- Calendar Blockouts
   CREATE TABLE calendar_blockouts (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
     room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
     staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
     start_time TIMESTAMP WITH TIME ZONE NOT NULL,
     end_time TIMESTAMP WITH TIME ZONE NOT NULL,
     blockout_type TEXT CHECK (blockout_type IN ('Maintenance', 'Holiday', 'Private Event')),
     description TEXT,
     affected_services TEXT[],
     is_recurring BOOLEAN DEFAULT false,
     recurrence_pattern JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Calendar Notifications
   CREATE TABLE calendar_notifications (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     event_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     notification_type TEXT CHECK (notification_type IN ('Email', 'SMS', 'In-App')),
     notification_time TIMESTAMP WITH TIME ZONE NOT NULL,
     status TEXT CHECK (status IN ('Pending', 'Sent', 'Failed')),
     message TEXT,
     read_status BOOLEAN DEFAULT false,
     action_required BOOLEAN DEFAULT false,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Waitlist Entries
   CREATE TABLE waitlist_entries (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
     service_id UUID REFERENCES services(id) ON DELETE CASCADE,
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
     room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
     staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
     desired_date DATE NOT NULL,
     desired_time_range TEXT,
     priority_level TEXT CHECK (priority_level IN ('High', 'Medium', 'Low')),
     status TEXT CHECK (status IN ('Active', 'Notified', 'Booked', 'Cancelled')),
     position INTEGER NOT NULL,
     notes TEXT,
     notification_preferences TEXT[],
     auto_book BOOLEAN DEFAULT false,
     max_wait_time INTEGER,
     expiry_date TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Waitlist Notifications
   CREATE TABLE waitlist_notifications (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     waitlist_id UUID REFERENCES waitlist_entries(id) ON DELETE CASCADE,
     customer_id UUID REFERENCES users(id) ON DELETE CASCADE,
     service_id UUID REFERENCES services(id) ON DELETE CASCADE,
     available_slot_id UUID REFERENCES calendar_events(id) ON DELETE CASCADE,
     notification_type TEXT CHECK (notification_type IN ('Spot Available', 'Auto-Booked', 'Position Update')),
     status TEXT CHECK (status IN ('Pending', 'Sent', 'Failed')),
     message TEXT,
     response_status TEXT CHECK (response_status IN ('Accepted', 'Declined', 'No Response')),
     response_time TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     sent_at TIMESTAMP WITH TIME ZONE,
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Service Capacity
   CREATE TABLE service_capacity (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     service_id UUID REFERENCES services(id) ON DELETE CASCADE,
     location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
     room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
     equipment_id UUID REFERENCES equipment(id) ON DELETE CASCADE,
     max_capacity INTEGER NOT NULL,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Add calendar-specific functions
   CREATE OR REPLACE FUNCTION check_availability(
     p_location_id UUID,
     p_room_id UUID,
     p_staff_id UUID,
     p_start_time TIMESTAMP WITH TIME ZONE,
     p_end_time TIMESTAMP WITH TIME ZONE
   ) RETURNS BOOLEAN AS $$
   BEGIN
     -- Check for conflicts in calendar_events
     IF EXISTS (
       SELECT 1 FROM calendar_events
       WHERE location_id = p_location_id
       AND room_id = p_room_id
       AND staff_id = p_staff_id
       AND start_time < p_end_time
       AND end_time > p_start_time
       AND status NOT IN ('Cancelled', 'Completed')
     ) THEN
       RETURN FALSE;
     END IF;

     -- Check for blockouts
     IF EXISTS (
       SELECT 1 FROM calendar_blockouts
       WHERE location_id = p_location_id
       AND room_id = p_room_id
       AND staff_id = p_staff_id
       AND start_time < p_end_time
       AND end_time > p_start_time
     ) THEN
       RETURN FALSE;
     END IF;

     RETURN TRUE;
   END;
   $$ LANGUAGE plpgsql;

   -- Add calendar-specific triggers
   CREATE TRIGGER validate_booking_time
   BEFORE INSERT OR UPDATE ON calendar_events
   FOR EACH ROW
   EXECUTE FUNCTION check_availability(
     NEW.location_id,
     NEW.room_id,
     NEW.staff_id,
     NEW.start_time,
     NEW.end_time
   );

   -- Add waitlist-specific functions
   CREATE OR REPLACE FUNCTION check_waitlist_availability(
     p_service_id UUID,
     p_location_id UUID,
     p_room_id UUID,
     p_date DATE,
     p_time_range TEXT
   ) RETURNS TABLE (
     available_slots INTEGER,
     waitlist_size INTEGER,
     estimated_wait_time INTEGER
   ) AS $$
   BEGIN
     RETURN QUERY
     SELECT
       sc.max_capacity - COUNT(ce.id) as available_slots,
       COUNT(we.id) as waitlist_size,
       CASE
         WHEN COUNT(we.id) > 0 THEN
           (SELECT AVG(EXTRACT(DAY FROM (ce.start_time - we.created_at)))
            FROM calendar_events ce
            JOIN waitlist_entries we ON ce.service_id = we.service_id
            WHERE ce.status = 'Completed'
            AND we.status = 'Booked'
            AND ce.service_id = p_service_id
            AND ce.location_id = p_location_id
            AND ce.room_id = p_room_id)
         ELSE 0
       END as estimated_wait_time
     FROM service_capacity sc
     LEFT JOIN calendar_events ce ON ce.service_id = sc.service_id
       AND ce.location_id = sc.location_id
       AND ce.room_id = sc.room_id
       AND ce.start_time::date = p_date
       AND ce.status NOT IN ('Cancelled', 'Completed')
     LEFT JOIN waitlist_entries we ON we.service_id = sc.service_id
       AND we.location_id = sc.location_id
       AND we.room_id = sc.room_id
       AND we.desired_date = p_date
       AND we.status = 'Active'
     WHERE sc.service_id = p_service_id
       AND sc.location_id = p_location_id
       AND sc.room_id = p_room_id
     GROUP BY sc.max_capacity;
   END;
   $$ LANGUAGE plpgsql;

   -- Add waitlist notification trigger
   CREATE OR REPLACE FUNCTION notify_waitlist_customers()
   RETURNS TRIGGER AS $$
   BEGIN
     -- When a booking is cancelled, check waitlist
     IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
       -- Find next customer in waitlist
       INSERT INTO waitlist_notifications (
         waitlist_id,
         customer_id,
         service_id,
         available_slot_id,
         notification_type,
         status,
         message
       )
       SELECT
         we.id,
         we.customer_id,
         we.service_id,
         NEW.id,
         CASE WHEN we.auto_book THEN 'Auto-Booked' ELSE 'Spot Available' END,
         'Pending',
         CASE WHEN we.auto_book THEN 'A spot has become available and you have been automatically booked.' 
              ELSE 'A spot has become available for your waitlisted service.' END
       FROM waitlist_entries we
       WHERE we.service_id = NEW.service_id
         AND we.location_id = NEW.location_id
         AND we.room_id = NEW.room_id
         AND we.desired_date = NEW.start_time::date
         AND we.status = 'Active'
       ORDER BY we.priority_level DESC, we.position ASC
       LIMIT 1;
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   CREATE TRIGGER notify_waitlist_on_cancellation
   AFTER UPDATE ON calendar_events
   FOR EACH ROW
   EXECUTE FUNCTION notify_waitlist_customers();
   ```

### Phase 2: Business Logic
1. **Formulas to Convert:**
   - Customer ID generation → Generated column
   - Visit ID generation → Generated column
   - Membership status → Boolean field with triggers
   - Sanitized names → Application logic
   - Membership card images → Application logic
   - Service type and location → Enums
   - Visit status → Enums
   - Payment calculations → Application logic
   - Commission calculations → Triggers
   - Booking status updates → Triggers
   - Schedule management → Application logic
   - Pass validation → Triggers
   - Membership benefits → Application logic
   - Payment processing → Application logic
   - Sales calculations → Triggers
   - Inventory management → Triggers
   - Pass usage tracking → Triggers
   - Product variant management → Triggers
   - Course enrollment → Triggers
   - Retreat booking → Triggers
   - Membership allowance tracking → Triggers
   - Membership usage validation → Triggers
   - Membership renewal processing → Triggers
   - Membership benefit application → Triggers
   - Membership unlimited service validation → Triggers
   - Age calculation → Database function
   - Birthdate validation → Database triggers
   - Location service availability → Triggers
   - Equipment maintenance scheduling → Triggers
   - Room booking validation → Triggers
   - Inventory management → Triggers
   - Staff scheduling → Triggers
   - Calendar event validation → Triggers
   - Availability checking → Functions
   - Recurring event management → Functions
   - Notification scheduling → Functions
   - Calendar view customization → Application logic
   - Waitlist position calculation → Functions
   - Waitlist notification management → Triggers
   - Auto-booking logic → Functions
   - Capacity tracking → Functions
   - Wait time estimation → Functions

### Phase 3: Data Migration
1. **Steps:**
   - Create initial locations
   - Map existing services to locations
   - Set up location-specific pricing
   - Configure operating hours
   - Set up equipment and rooms
   - Initialize location inventory
   - Migrate existing bookings to calendar events
   - Set up staff availability
   - Configure calendar views
   - Set up notification templates
   - Initialize calendar blockouts
   - Set up service capacity tracking
   - Initialize waitlist entries
   - Configure notification templates
   - Set up auto-booking rules

## 4. Recommendations

### Immediate Actions
1. **Schema Changes:**
   - Implement UUID for all IDs
   - Use proper date/time types
   - Create normalized tables
   - Set up proper constraints
   - Consolidate booking relationships
   - Create proper membership tracking
   - Create service and therapist tables
   - Implement proper status tracking
   - Create commission tracking system
   - Implement schedule management
   - Create payment tracking system
   - Implement pass validation
   - Create membership benefits system
   - Create inventory management system
   - Implement sales tracking
   - Create pass usage tracking
   - Create product management system
   - Implement variant tracking
   - Create course management system
   - Implement retreat management
   - Implement membership service allowances
   - Create membership usage tracking
   - Set up membership benefit management
   - Implement unlimited service tracking
   - Create membership card management
   - Implement birthdate field
   - Create age calculation function
   - Set up birthdate validation
   - Implement location management
   - Create service-location mapping
   - Set up equipment tracking
   - Configure room management
   - Implement location inventory
   - Create staff location assignments
   - Implement calendar event management
   - Create availability tracking
   - Set up notification system
   - Configure calendar views
   - Implement blockout management
   - Implement waitlist management
   - Create notification system
   - Set up capacity tracking
   - Configure auto-booking rules

2. **Business Logic:**
   - Create calendar validation system
   - Implement availability checking
   - Set up notification scheduling
   - Create calendar view management
   - Implement blockout handling
   - Create waitlist prioritization system
   - Implement notification handling
   - Set up auto-booking logic
   - Create capacity management

### Future Considerations
1. **Scalability:**
   - Location expansion planning
   - Service standardization
   - Equipment maintenance optimization
   - Inventory distribution
   - Staff rotation system
   - Calendar performance optimization
   - Notification system scaling
   - View customization options
   - Integration with external calendars
   - Waitlist performance optimization
   - Notification system scaling
   - Auto-booking rule management
   - Capacity planning tools

2. **Maintenance:**
   - Location performance monitoring
   - Service availability tracking
   - Equipment maintenance scheduling
   - Room utilization analysis
   - Inventory optimization
   - Calendar data cleanup
   - Notification delivery monitoring
   - View performance tracking
   - Blockout management optimization
   - Waitlist cleanup procedures
   - Notification delivery monitoring
   - Capacity utilization analysis
   - Wait time optimization

## 5. Next Steps

1. **Documentation:**
   - [x] Initial table analysis
   - [x] Customers table analysis
   - [x] Visits table analysis
   - [x] Bookings table analysis
   - [x] Services table analysis
   - [x] Staff/Therapists table analysis
   - [x] Payments table analysis
   - [x] Passes table analysis
   - [x] Memberships table analysis
   - [x] Sales Transactions table analysis
   - [x] Sales Line Items table analysis
   - [x] Items table analysis
   - [x] Pass Log table analysis
   - [x] Products table analysis
   - [x] Product Variants table analysis
   - [x] Product Attributes table analysis
   - [x] Online Courses table analysis
   - [x] Course Lessons table analysis
   - [x] Retreat Packages table analysis
   - [ ] Document all formulas
   - [ ] Map relationships
   - [ ] Document automations
   - [ ] Document birthdate migration process
   - [ ] Create data validation procedures
   - [ ] Document age calculation logic
   - [ ] Create privacy guidelines for birthdate data

2. **Implementation:**
   - [ ] Create initial schema
   - [ ] Set up migrations
   - [ ] Test data import
   - [ ] Create migration scripts
   - [ ] Set up validation procedures
   - [ ] Implement age calculation function
   - [ ] Create data quality reports

3. **Testing:**
   - [ ] Validate data integrity
   - [ ] Test business logic
   - [ ] Performance testing
   - [ ] Test migration on sample data
   - [ ] Validate age calculations
   - [ ] Test data quality reports
   - [ ] Verify privacy controls 