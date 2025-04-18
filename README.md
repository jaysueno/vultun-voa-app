# Vultun Business Management System

## Project Overview
A comprehensive business management system for Vultun's operations in Siargao, including:
- Massage services
- Energetic healing
- Surf rentals and school
- Airbnb management
- Pilates studio (coming soon)
- Biohacking facility (coming soon)

## Current Airtable Structure

### 1. Core Tables

#### Customers
- Primary fields:
  - Name
  - Contact Information
  - Booking History
  - Membership Status
  - Payment History

#### Services
- Primary fields:
  - Service Type
  - Duration
  - Price
  - Staff Assignment
  - Room Assignment

#### Bookings
- Primary fields:
  - Customer Reference
  - Service Type
  - Date/Time
  - Status
  - Payment Status

#### Staff
- Primary fields:
  - Personal Information
  - Role
  - Schedule
  - Commission Structure

#### Rooms/Spaces
- Primary fields:
  - Room Type
  - Capacity
  - Equipment
  - Availability

### 2. Business Logic

#### Critical Automations
1. Booking Management
   - Auto-scheduling
   - Conflict detection
   - Reminder system

2. Payment Processing
   - Commission calculations
   - Payment tracking
   - Revenue reporting

3. Staff Management
   - Schedule optimization
   - Commission tracking
   - Performance metrics

### 3. Workflows

#### Booking Flow
1. Customer Inquiry
2. Service Selection
3. Staff Assignment
4. Room Allocation
5. Payment Processing
6. Confirmation
7. Follow-up

#### Staff Management Flow
1. Schedule Creation
2. Assignment
3. Performance Tracking
4. Commission Calculation
5. Payment Processing

## Migration Strategy

### Phase 1: Core Structure
- [ ] Database schema setup
- [ ] Basic CRUD operations
- [ ] Authentication system

### Phase 2: Business Logic
- [ ] Booking system
- [ ] Payment processing
- [ ] Staff management

### Phase 3: Advanced Features
- [ ] Reporting system
- [ ] Analytics dashboard
- [ ] Mobile app integration

## Technical Stack
- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: Supabase
- Database: PostgreSQL
- Authentication: Supabase Auth
- Payment Processing: [To be determined]

## Development Guidelines

### Code Organization
```
src/
├── components/     # Reusable UI components
├── lib/           # Utility functions and types
├── pages/         # Next.js pages
├── styles/        # Global styles
└── types/         # TypeScript type definitions
```

### Best Practices
1. TypeScript for type safety
2. Component-based architecture
3. Responsive design
4. Accessibility standards
5. Performance optimization

## Getting Started

### Prerequisites
- Node.js
- npm/yarn
- Supabase account

### Installation
1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run development server

## Future Enhancements
- Mobile app development
- Integration with external services
- Advanced analytics
- AI-powered recommendations

## Support and Maintenance
- Regular backups
- Performance monitoring
- Security updates
- Feature requests 