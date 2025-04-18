-- Enable RLS for customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow select for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customer records" ON public.customers;
DROP POLICY IF EXISTS "Users can delete their own customer records" ON public.customers;

-- DEBUG: Allow SELECT for any authenticated user
CREATE POLICY "Allow select for authenticated users"
    ON public.customers
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- DEBUG: Allow INSERT for any authenticated user (with check on user_id)
CREATE POLICY "Allow insert for authenticated users"
    ON public.customers
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Keep UPDATE and DELETE restricted for now
CREATE POLICY "Users can update their own customer records"
    ON public.customers
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customer records"
    ON public.customers
    FOR DELETE
    USING (auth.uid() = user_id);

-- Add comment to explain the policies
COMMENT ON TABLE public.customers IS 'Customer records with RLS policies for self-management'; 