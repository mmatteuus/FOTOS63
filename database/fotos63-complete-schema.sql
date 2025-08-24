
-- ====================================
-- FOTOS63 - Complete Database Schema
-- ====================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.photos CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.photographers CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- 1. USERS TABLE
-- ====================================
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('cliente', 'fotografo', 'admin')) DEFAULT 'cliente',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 2. CATEGORIES TABLE
-- ====================================
CREATE TABLE public.categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Casamento', 'casamento', 'Fotografias de casamento e cerimônias', 'bi-heart'),
('Evento Corporativo', 'evento', 'Eventos corporativos e empresariais', 'bi-building'),
('Retrato', 'retrato', 'Retratos e fotografias pessoais', 'bi-person-circle'),
('Produto', 'produto', 'Fotografia de produtos e comercial', 'bi-box'),
('Família', 'familia', 'Fotografias familiares e ensaios', 'bi-people'),
('Natureza', 'natureza', 'Paisagens e fotografia de natureza', 'bi-tree');

-- ====================================
-- 3. PHOTOGRAPHERS TABLE
-- ====================================
CREATE TABLE public.photographers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    specialty TEXT[] DEFAULT ARRAY[]::TEXT[],
    experience_years INTEGER DEFAULT 0,
    bio TEXT,
    portfolio_url TEXT,
    pricing_info JSONB DEFAULT '{}'::JSONB,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    verified BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert test photographer
INSERT INTO public.users (id, email, name, phone, role) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'thayson@fotos63.com', 'Thayson Felipe - Fotografo Teste', '(63) 99999-9999', 'fotografo');

INSERT INTO public.photographers (user_id, specialty, experience_years, bio, rating, total_reviews, verified, active) VALUES 
('550e8400-e29b-41d4-a716-446655440000', ARRAY['casamento', 'evento'], 8, 'Fotógrafo especialista em casamentos e eventos corporativos. Mais de 8 anos de experiência capturando momentos únicos.', 4.9, 127, true, true);

-- ====================================
-- 4. EVENTS TABLE
-- ====================================
CREATE TABLE public.events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location TEXT,
    city TEXT,
    state TEXT DEFAULT 'TO',
    photographer_id UUID REFERENCES public.photographers(id) ON DELETE CASCADE,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    event_type TEXT CHECK (event_type IN ('workshop', 'concurso', 'encontro', 'curso', 'sessao')) NOT NULL,
    status TEXT CHECK (status IN ('ativo', 'lotado', 'cancelado', 'finalizado')) DEFAULT 'ativo',
    image_url TEXT,
    requirements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample events
INSERT INTO public.events (title, description, event_date, event_time, location, city, event_type, max_participants, price, image_url) VALUES
('Workshop de Fotografia de Casamento', 'Aprenda técnicas profissionais de fotografia de casamento com especialistas.', '2024-03-15', '14:00', 'Centro de Convenções', 'Palmas', 'workshop', 30, 150.00, 'https://cdn.abacus.ai/images/f60334d2-2998-48b4-a94a-e068cc275945.png'),
('Concurso FOTOS63', 'Participe do maior concurso de fotografia do Tocantins e ganhe prêmios.', '2024-03-20', '09:00', 'Praça dos Girassóis', 'Palmas', 'concurso', 100, 50.00, 'https://cdn.abacus.ai/images/0f32eb4b-c3c7-4f7c-9912-43e0edbfc78b.png'),
('Encontro de Fotógrafos TO', 'Networking e troca de experiências entre profissionais da fotografia.', '2024-03-25', '19:00', 'Hotel Golden Tulip', 'Palmas', 'encontro', 50, 0.00, 'https://cdn.abacus.ai/images/6ab2e1f1-b2bd-41f2-ae6e-4bfa77dd6d43.png');

-- ====================================
-- 5. PHOTOS TABLE
-- ====================================
CREATE TABLE public.photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    photographer_id UUID REFERENCES public.photographers(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    original_url TEXT NOT NULL,
    watermark_url TEXT NOT NULL,
    thumbnail_url TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    metadata JSONB DEFAULT '{}'::JSONB,
    views INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('draft', 'published', 'archived', 'rejected')) DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample photos
INSERT INTO public.photos (photographer_id, category_id, title, description, watermark_url, price, tags, status, featured) VALUES
((SELECT id FROM public.photographers WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'), 
 (SELECT id FROM public.categories WHERE slug = 'casamento'), 
 'Casamento Elegante', 
 'Momento único capturado durante cerimônia de casamento em Palmas', 
 'https://cdn.abacus.ai/images/59417acd-6078-4d6b-b3f0-d287518ff6a4.png', 
 150.00, 
 ARRAY['casamento', 'cerimonia', 'palmas'], 
 'published', 
 true);

-- ====================================
-- 6. ORDERS TABLE
-- ====================================
CREATE TABLE public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    buyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    photo_id UUID REFERENCES public.photos(id) ON DELETE CASCADE NOT NULL,
    photographer_id UUID REFERENCES public.photographers(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    photographer_earnings DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method TEXT,
    payment_id TEXT,
    status TEXT CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')) DEFAULT 'pending',
    download_url TEXT,
    download_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- 7. INDEXES for Performance
-- ====================================
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_photographers_user_id ON public.photographers(user_id);
CREATE INDEX idx_photographers_specialty ON public.photographers USING GIN(specialty);
CREATE INDEX idx_photographers_verified ON public.photographers(verified);
CREATE INDEX idx_photos_photographer_id ON public.photos(photographer_id);
CREATE INDEX idx_photos_category_id ON public.photos(category_id);
CREATE INDEX idx_photos_status ON public.photos(status);
CREATE INDEX idx_photos_featured ON public.photos(featured);
CREATE INDEX idx_photos_tags ON public.photos USING GIN(tags);
CREATE INDEX idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX idx_orders_photographer_id ON public.orders(photographer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_events_event_date ON public.events(event_date);
CREATE INDEX idx_events_photographer_id ON public.events(photographer_id);
CREATE INDEX idx_events_status ON public.events(status);

-- ====================================
-- 8. ROW LEVEL SECURITY POLICIES
-- ====================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Categories are public
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Photographers policies
CREATE POLICY "Anyone can view verified photographers" ON public.photographers FOR SELECT USING (verified = true AND active = true);
CREATE POLICY "Photographers can view own profile" ON public.photographers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Photographers can update own profile" ON public.photographers FOR UPDATE USING (auth.uid() = user_id);

-- Photos policies
CREATE POLICY "Anyone can view published photos" ON public.photos FOR SELECT USING (status = 'published');
CREATE POLICY "Photographers can view own photos" ON public.photos FOR SELECT USING (photographer_id IN (SELECT id FROM public.photographers WHERE user_id = auth.uid()));
CREATE POLICY "Photographers can insert own photos" ON public.photos FOR INSERT WITH CHECK (photographer_id IN (SELECT id FROM public.photographers WHERE user_id = auth.uid()));
CREATE POLICY "Photographers can update own photos" ON public.photos FOR UPDATE USING (photographer_id IN (SELECT id FROM public.photographers WHERE user_id = auth.uid()));

-- Orders policies
CREATE POLICY "Users can view own orders as buyer" ON public.orders FOR SELECT USING (buyer_id = auth.uid());
CREATE POLICY "Photographers can view own orders" ON public.orders FOR SELECT USING (photographer_id IN (SELECT id FROM public.photographers WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert orders" ON public.orders FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Events policies
CREATE POLICY "Anyone can view active events" ON public.events FOR SELECT USING (status = 'ativo');
CREATE POLICY "Photographers can insert events" ON public.events FOR INSERT WITH CHECK (photographer_id IN (SELECT id FROM public.photographers WHERE user_id = auth.uid()));
CREATE POLICY "Photographers can update own events" ON public.events FOR UPDATE USING (photographer_id IN (SELECT id FROM public.photographers WHERE user_id = auth.uid()));

-- ====================================
-- 9. TRIGGERS for Updated_at
-- ====================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_photographers_updated_at
    BEFORE UPDATE ON public.photographers
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_photos_updated_at
    BEFORE UPDATE ON public.photos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ====================================
-- 10. FUNCTIONS for Business Logic
-- ====================================

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'role', 'cliente')
    );
    
    -- If user is photographer, create photographer profile
    IF COALESCE(NEW.raw_user_meta_data->>'role', 'cliente') = 'fotografo' THEN
        INSERT INTO public.photographers (
            user_id, 
            specialty, 
            experience_years,
            bio
        ) VALUES (
            NEW.id,
            CASE 
                WHEN NEW.raw_user_meta_data->>'specialty' IS NOT NULL 
                THEN ARRAY[NEW.raw_user_meta_data->>'specialty']
                ELSE ARRAY[]::TEXT[]
            END,
            COALESCE((NEW.raw_user_meta_data->>'experience')::INTEGER, 0),
            COALESCE(NEW.raw_user_meta_data->>'bio', 'Fotógrafo profissional')
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to update photo statistics
CREATE OR REPLACE FUNCTION public.update_photo_stats(photo_uuid UUID, stat_type TEXT)
RETURNS VOID AS $$
BEGIN
    CASE stat_type
        WHEN 'view' THEN
            UPDATE public.photos SET views = views + 1 WHERE id = photo_uuid;
        WHEN 'favorite' THEN
            UPDATE public.photos SET favorites = favorites + 1 WHERE id = photo_uuid;
        WHEN 'download' THEN
            UPDATE public.photos SET downloads = downloads + 1 WHERE id = photo_uuid;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate photographer earnings
CREATE OR REPLACE FUNCTION public.calculate_earnings(photographer_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_earnings DECIMAL(10,2) := 0;
BEGIN
    SELECT COALESCE(SUM(photographer_earnings), 0) 
    INTO total_earnings
    FROM public.orders 
    WHERE photographer_id = photographer_uuid AND status = 'paid';
    
    RETURN total_earnings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- 11. STORAGE BUCKETS (Run separately in Supabase dashboard)
-- ====================================
/*
-- These need to be run in Supabase dashboard Storage section:

INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('watermarks', 'watermarks', true);

-- Storage policies for photos bucket
CREATE POLICY "Photographers can upload photos" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'photos' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view photos" ON storage.objects 
FOR SELECT USING (bucket_id = 'photos');

-- Storage policies for avatars bucket  
CREATE POLICY "Users can upload avatars" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view avatars" ON storage.objects 
FOR SELECT USING (bucket_id = 'avatars');
*/

-- ====================================
-- SCHEMA COMPLETE ✅
-- ====================================
