export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  role: 'customer' | 'staff' | 'admin'
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  duration: number // in minutes
  base_price: number
  category: 'massage' | 'healing' | 'surf' | 'pilates' | 'biohacking'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  service_id: string
  staff_id: string
  room_id: string
  start_time: string
  end_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Membership {
  id: string
  user_id: string
  type: string
  start_date: string
  end_date: string
  status: 'active' | 'expired' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Staff {
  id: string
  user_id: string
  position: string
  services: string[] // array of service IDs
  working_hours: {
    [key: string]: {
      start: string
      end: string
    }
  }
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  name: string
  type: string
  capacity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  user_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  booking_id?: string
  product_id?: string
  membership_id?: string
  created_at: string
  updated_at: string
} 