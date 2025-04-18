# Airtable Migration Details

## Current Airtable Structure

### 1. Tables and Fields

#### Customers Table
```markdown
| Field Name | Type | Description | Migration Strategy |
|------------|------|-------------|-------------------|
| Name | Text | Customer's full name | Direct mapping to users table |
| Email | Email | Primary contact | Direct mapping to users table |
| Phone | Phone | Contact number | Direct mapping to users table |
| Notes | Long Text | Additional information | Store in user profile |
| Created | Date | Account creation date | Use created_at timestamp |
```

#### Services Table
```markdown
| Field Name | Type | Description | Migration Strategy |
|------------|------|-------------|-------------------|
| Service Name | Text | Name of service | Direct mapping |
| Category | Single Select | Service category | Use enum type |
| Duration | Number | Service duration in minutes | Direct mapping |
| Price | Currency | Service price | Direct mapping |
| Description | Long Text | Service details | Direct mapping |
```

#### Bookings Table
```markdown
| Field Name | Type | Description | Migration Strategy |
|------------|------|-------------|-------------------|
| Customer | Link | Reference to customer | Foreign key to users |
| Service | Link | Reference to service | Foreign key to services |
| Date | Date | Booking date | Direct mapping |
| Time | Time | Booking time | Combine with date for timestamp |
| Status | Single Select | Booking status | Use enum type |
| Notes | Long Text | Additional notes | Direct mapping |
```

### 2. Formulas and Automations

#### Booking Status Formula
```javascript
// Current Airtable formula
IF(
  AND(
    {Payment Status} = "Paid",
    {Date} >= TODAY()
  ),
  "Confirmed",
  IF(
    {Date} < TODAY(),
    "Completed",
    "Pending"
  )
)

// Supabase equivalent
CREATE OR REPLACE FUNCTION update_booking_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'paid' AND NEW.date >= CURRENT_DATE THEN
    NEW.status := 'confirmed';
  ELSIF NEW.date < CURRENT_DATE THEN
    NEW.status := 'completed';
  ELSE
    NEW.status := 'pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### Commission Calculation
```javascript
// Current Airtable formula
{Service Price} * {Commission Rate}

// Supabase equivalent
CREATE OR REPLACE FUNCTION calculate_commission()
RETURNS TRIGGER AS $$
BEGIN
  NEW.commission := NEW.service_price * (
    SELECT commission_rate 
    FROM staff 
    WHERE id = NEW.staff_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 3. Views and Filters

#### Active Bookings View
```sql
-- Supabase equivalent of Airtable view
CREATE VIEW active_bookings AS
SELECT 
  b.*,
  u.full_name as customer_name,
  s.name as service_name,
  st.full_name as staff_name
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN services s ON b.service_id = s.id
JOIN staff st ON b.staff_id = st.id
WHERE b.status IN ('pending', 'confirmed')
  AND b.date >= CURRENT_DATE
ORDER BY b.date, b.time;
```

#### Staff Schedule View
```sql
-- Supabase equivalent of Airtable view
CREATE VIEW staff_schedule AS
SELECT 
  st.*,
  b.date,
  b.time,
  s.name as service_name,
  u.full_name as customer_name
FROM staff st
LEFT JOIN bookings b ON st.id = b.staff_id
LEFT JOIN services s ON b.service_id = s.id
LEFT JOIN users u ON b.user_id = u.id
WHERE b.date >= CURRENT_DATE
ORDER BY st.id, b.date, b.time;
```

## Migration Steps

### 1. Data Preparation
- [ ] Export Airtable data
- [ ] Clean and validate data
- [ ] Create mapping documentation
- [ ] Prepare import scripts

### 2. Schema Implementation
- [ ] Create database tables
- [ ] Set up relationships
- [ ] Implement constraints
- [ ] Create indexes

### 3. Business Logic Migration
- [ ] Implement formulas as functions
- [ ] Set up triggers
- [ ] Create views
- [ ] Test automations

### 4. Data Migration
- [ ] Import customer data
- [ ] Import service data
- [ ] Import booking history
- [ ] Import staff data

### 5. Testing and Validation
- [ ] Verify data integrity
- [ ] Test business logic
- [ ] Validate automations
- [ ] Check performance

## Open Questions
1. How to handle historical data?
2. What to do with incomplete records?
3. How to maintain data consistency during migration?
4. What validation rules to implement?

## Decisions Made
1. Use UUID for all primary keys
2. Implement soft deletion for records
3. Use timestamps for all date/time fields
4. Implement row-level security

## Next Steps
1. Review and confirm table structures
2. Create data migration scripts
3. Set up testing environment
4. Plan go-live strategy 