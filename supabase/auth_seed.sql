-- Create auth schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS auth;

-- Enable the crypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create auth.users table if it doesn't exist
CREATE TABLE IF NOT EXISTS auth.users (
    id uuid NOT NULL PRIMARY KEY,
    email character varying NOT NULL UNIQUE,
    encrypted_password character varying,
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying,
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying,
    recovery_sent_at timestamp with time zone,
    email_change_token character varying,
    email_change character varying,
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::text,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::text,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (email_confirmed_at) STORED,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false,
    deleted_at timestamp with time zone,
    role text DEFAULT 'authenticated'::text
);

-- Clear existing data
TRUNCATE auth.users CASCADE;

-- Insert users into auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role
) VALUES
  (
    '28f796c1-0976-4a83-a9a4-ffdc30ecde45',
    'jay@vultun.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  ),
  (
    'b5f37e7d-6e42-4c8b-9c25-78b5531b0123',
    'staff1@vultun.com',
    crypt('staff123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  ),
  (
    'c6f48e8e-7f53-5d9c-0d36-89c6642c1234',
    'staff2@vultun.com',
    crypt('staff123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  ),
  (
    'd7f59f9f-8f64-6e0d-1e47-90d7753c2345',
    'customer1@example.com',
    crypt('customer123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  ),
  (
    'e8f60f0f-9f75-7f1e-2f58-01e8864d3456',
    'customer2@example.com',
    crypt('customer123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  ),
  (
    'f9f71f1f-0f86-8f2f-3f69-12f9975e4567',
    'customer3@example.com',
    crypt('customer123', gen_salt('bf')),
    now(),
    now(),
    now(),
    'authenticated'
  ); 