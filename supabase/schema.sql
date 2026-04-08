-- ============================================================
-- The Awareness Cafe — Supabase Database Schema
-- Run this SQL in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_pincode TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'COD',
  notes TEXT DEFAULT '',
  is_custom_order BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL,
  emoji TEXT DEFAULT '🍽️',
  price TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. GALLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'food'
    CHECK (category IN ('food','interior','exterior','team')),
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT DEFAULT '',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. ADMIN SETTINGS TABLE
CREATE TABLE IF NOT EXISTS admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings
INSERT INTO admin_settings (key, value) VALUES
  ('delivery_fee', '0'),
  ('delivery_radius_km', '5'),
  ('estimated_delivery_time', '30-45 minutes'),
  ('cafe_phone', '+918750155505'),
  ('cafe_address', 'Garhi-Buredha Road, Sadharana Ki Dhani, Sadharana Village, Gurugram, Haryana 122505')
ON CONFLICT (key) DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- ORDERS: anyone can insert, only service role can read/update
CREATE POLICY "Anyone can place orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can read orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Service role can update orders" ON orders FOR UPDATE USING (true);

-- MENU ITEMS: anyone can read available items, service role manages
CREATE POLICY "Anyone can view menu" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Service role can insert menu" ON menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update menu" ON menu_items FOR UPDATE USING (true);
CREATE POLICY "Service role can delete menu" ON menu_items FOR DELETE USING (true);

-- GALLERY: anyone can view, service role manages
CREATE POLICY "Anyone can view gallery" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Service role can insert gallery" ON gallery_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can update gallery" ON gallery_images FOR UPDATE USING (true);
CREATE POLICY "Service role can delete gallery" ON gallery_images FOR DELETE USING (true);

-- REVIEWS: anyone can submit, public can see approved, service role manages all
CREATE POLICY "Anyone can submit reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view approved reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Service role can update reviews" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Service role can delete reviews" ON reviews FOR DELETE USING (true);

-- ADMIN SETTINGS: read-only for all, service role manages
CREATE POLICY "Anyone can read settings" ON admin_settings FOR SELECT USING (true);
CREATE POLICY "Service role can update settings" ON admin_settings FOR UPDATE USING (true);

-- ============================================================
-- STORAGE BUCKETS (run these separately if needed)
-- ============================================================
-- Note: Storage buckets are typically created via Supabase Dashboard
-- Go to Storage → New Bucket → Create:
--   1. "gallery" — Public bucket
--   2. "menu-images" — Public bucket

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_sort_order ON menu_items(sort_order);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery_images(category);
