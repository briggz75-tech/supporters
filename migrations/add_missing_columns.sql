-- Migration: Add missing columns to supporters table
-- Run this SQL in your Supabase dashboard to add the missing columns

-- Add is_approved column
ALTER TABLE supporters
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add image_url column
ALTER TABLE supporters
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add coordinator_id column
ALTER TABLE supporters
ADD COLUMN IF NOT EXISTS coordinator_id UUID;

-- Add coordinator_notes column
ALTER TABLE supporters
ADD COLUMN IF NOT EXISTS coordinator_notes TEXT;

-- Add title column
ALTER TABLE supporters
ADD COLUMN IF NOT EXISTS title TEXT;

-- Add district column
ALTER TABLE supporters
ADD COLUMN IF NOT EXISTS district TEXT;

-- Add updated_at column with default NOW() and trigger to auto-update
ALTER TABLE supporters
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Create a trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_supporters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the trigger if it already exists
DROP TRIGGER IF EXISTS supporters_updated_at_trigger ON supporters;

-- Create the trigger
CREATE TRIGGER supporters_updated_at_trigger
BEFORE UPDATE ON supporters
FOR EACH ROW
EXECUTE FUNCTION update_supporters_updated_at();
