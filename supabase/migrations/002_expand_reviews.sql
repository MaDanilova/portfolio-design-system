-- ============================================================
-- 002: Expand reviews table to store full ReviewData
-- Run this in your Supabase SQL Editor AFTER 001_initial_schema.sql
-- ============================================================

-- The `feedback` jsonb column now stores the FULL ReviewData object.
-- Add dedicated columns for queryable/sortable fields.

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS initials text,
  ADD COLUMN IF NOT EXISTS focus text,
  ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}';

-- Index for faster listing + sorting
CREATE INDEX IF NOT EXISTS reviews_user_created
  ON public.reviews (user_id, created_at DESC);
