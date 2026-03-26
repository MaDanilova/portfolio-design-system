-- ============================================================
-- 003: Add review preferences to profiles
-- Run this in your Supabase SQL Editor AFTER 002_expand_reviews.sql
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS default_focus text DEFAULT 'full',
  ADD COLUMN IF NOT EXISTS typography_audit boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS storytelling boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_notify boolean DEFAULT false;
