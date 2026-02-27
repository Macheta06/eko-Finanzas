-- supabase/migrations/0000_initial_schema.sql
-- Archivo inicial de esquema de base de datos para Eko-Finanzas.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: homes
CREATE TABLE IF NOT EXISTS public.homes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    share_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Table: members
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID NOT NULL REFERENCES public.homes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    monthly_income NUMERIC(15, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enum: expense_type
CREATE TYPE public.expense_type AS ENUM ('FIXED', 'VARIABLE');

-- Enum: expense_scope
CREATE TYPE public.expense_scope AS ENUM ('SHARED', 'INDIVIDUAL');

-- Table: expenses
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    home_id UUID NOT NULL REFERENCES public.homes(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL DEFAULT 0,
    type public.expense_type NOT NULL,
    scope public.expense_scope NOT NULL,
    member_id_assigned UUID REFERENCES public.members(id) ON DELETE SET NULL, -- Null if SHARED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indices for better performance
CREATE INDEX IF NOT EXISTS idx_homes_share_code ON public.homes(share_code);
CREATE INDEX IF NOT EXISTS idx_members_home_id ON public.members(home_id);
CREATE INDEX IF NOT EXISTS idx_expenses_home_id ON public.expenses(home_id);

-- RLS (Row Level Security) - Basic initial setup
ALTER TABLE public.homes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Note: In this MVP, since we use `share_code` for simplicity without full Supabase Auth users, 
-- we will drop RLS restrictions or setup general authenticated policies based on anon keys for now,
-- but the tables are prepared for strict RLS in the future.
-- For absolute simplicity in this demo MVP (using Offline-First / Sync):
CREATE POLICY "Allow anonymous read access" ON public.homes FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON public.homes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON public.homes FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous read access" ON public.members FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON public.members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON public.members FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON public.members FOR DELETE USING (true);

CREATE POLICY "Allow anonymous read access" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update access" ON public.expenses FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous delete access" ON public.expenses FOR DELETE USING (true);
