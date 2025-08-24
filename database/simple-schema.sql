
-- FOTOS63 - Simplified Database Schema

-- Enable Row Level Security
-- This should be run in Supabase SQL Editor

-- Create photographers table
CREATE TABLE IF NOT EXISTS photographers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    experience VARCHAR(50) DEFAULT 'iniciante',
    portfolio VARCHAR(500),
    bio TEXT,
    specialties TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(100) DEFAULT 'geral',
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create photos table (for future use)
CREATE TABLE IF NOT EXISTS photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    photographer_id UUID REFERENCES photographers(id),
    category VARCHAR(50),
    price DECIMAL(10,2) DEFAULT 0,
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table (for future use)
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE,
    location VARCHAR(255),
    photographer VARCHAR(255),
    image_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for photographers table
CREATE POLICY "Anyone can insert photographers" ON photographers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view active photographers" ON photographers
    FOR SELECT USING (status = 'active');

-- Create policies for contact messages table
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

-- Create policies for photos table
CREATE POLICY "Anyone can view published photos" ON photos
    FOR SELECT USING (status = 'published');

-- Create policies for events table
CREATE POLICY "Anyone can view active events" ON events
    FOR SELECT USING (status = 'active');

-- Insert sample events
INSERT INTO events (title, date, location, photographer, image_url, status) VALUES
    ('Rei e Rainha da Via Lago 2025', '2025-03-15', 'Via Lago, Araguaína', 'Equipe FOTOS63', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400', 'active'),
    ('Corrida do Trabalhador', '2025-05-01', 'Centro de Araguaína', 'Carlos Sports', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', 'active'),
    ('Festival de Verão 2025', '2025-01-20', 'Praia da Tartaruga', 'Ana Eventos', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'active');

-- Insert sample photos
INSERT INTO photos (title, category, price, image_url, status) VALUES
    ('Casamento Elegante', 'casamento', 150.00, 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400', 'published'),
    ('Retrato Profissional', 'retrato', 80.00, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'published'),
    ('Evento Corporativo', 'evento', 200.00, 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400', 'published'),
    ('Ensaio Esportivo', 'esporte', 120.00, 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', 'published'),
    ('Festa de Aniversário', 'evento', 100.00, 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=400', 'published'),
    ('Sessão Familiar', 'retrato', 180.00, 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400', 'published');
