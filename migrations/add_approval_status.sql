-- Add approval_status column to track pending/approved/rejected
ALTER TABLE supporters
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending';

-- Add rejected_at timestamp to track when rejection happened
ALTER TABLE supporters
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP;

-- Update approval_status based on existing is_approved column
-- Approved supporters will have status = 'approved'
-- Unapproved (pending) supporters will have status = 'pending'
UPDATE supporters SET approval_status = 'approved' WHERE is_approved = true;
UPDATE supporters SET approval_status = 'pending' WHERE is_approved = false OR is_approved IS NULL;
