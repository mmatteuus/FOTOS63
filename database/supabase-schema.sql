-- Fotos63 Database Schema
-- Criado para Supabase PostgreSQL

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE user_role AS ENUM ('cliente', 'fotografo', 'admin');
CREATE TYPE photo_status AS ENUM ('draft', 'published', 'sold', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'completed', 'cancelled', 'refunded');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE plan_type AS ENUM ('free', 'pro', 'business');

-- Tabela de tenants (multi-tenancy)
CREATE TABLE tenants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plan plan_type DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários (estende auth.users do Supabase)
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'cliente',
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fotógrafos (perfil estendido)
CREATE TABLE photographers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    bio TEXT,
    avatar_url TEXT,
    socials JSONB DEFAULT '{}',
    plan plan_type DEFAULT 'free',
    commission_rate DECIMAL(5,2) DEFAULT 35.00,
    total_sales DECIMAL(10,2) DEFAULT 0.00,
    total_photos INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    pix_key VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fotos
CREATE TABLE photos (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tags TEXT[],
    watermark_url TEXT NOT NULL,
    full_url TEXT NOT NULL,
    thumbnail_url TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    status photo_status DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    file_size BIGINT,
    dimensions JSONB, -- {width: 1920, height: 1080}
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pedidos
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    buyer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    commission DECIMAL(10,2) NOT NULL,
    photographer_amount DECIMAL(10,2) NOT NULL,
    status order_status DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_id VARCHAR(255),
    payment_data JSONB DEFAULT '{}',
    download_url TEXT,
    download_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de saques
CREATE TABLE payouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    status payout_status DEFAULT 'pending',
    pix_key VARCHAR(255) NOT NULL,
    transaction_id VARCHAR(255),
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de carrinho
CREATE TABLE cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, photo_id)
);

-- Tabela de favoritos
CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, photo_id)
);

-- Tabela de avaliações
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    photographer_id UUID REFERENCES photographers(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do sistema
CREATE TABLE system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO categories (name, slug, description, icon) VALUES
('Eventos', 'eventos', 'Casamentos, formaturas, aniversários e celebrações', 'calendar'),
('Esportes', 'esportes', 'Futebol, corrida, natação e atividades esportivas', 'trophy'),
('Natureza', 'natureza', 'Paisagens, animais e vida selvagem', 'leaf'),
('Retratos', 'retratos', 'Ensaios, família e fotografia profissional', 'user'),
('Arquitetura', 'arquitetura', 'Edifícios, interiores e fotografia urbana', 'building'),
('Arte', 'arte', 'Fotografia abstrata, conceitual e experimental', 'palette');

-- Inserir configurações padrão do sistema
INSERT INTO system_settings (key, value, description) VALUES
('commission_rate', '35.0', 'Taxa de comissão padrão em porcentagem'),
('max_file_size', '10485760', 'Tamanho máximo de arquivo em bytes (10MB)'),
('allowed_formats', '["jpg", "jpeg", "png", "webp"]', 'Formatos de arquivo permitidos'),
('watermark_opacity', '0.7', 'Opacidade da marca d''água (0-1)'),
('min_photo_price', '5.00', 'Preço mínimo por foto em reais'),
('max_photo_price', '500.00', 'Preço máximo por foto em reais');

-- Criar tenant padrão
INSERT INTO tenants (name, plan) VALUES ('Fotos63 Default', 'business');

-- Índices para performance
CREATE INDEX idx_photos_photographer_id ON photos(photographer_id);
CREATE INDEX idx_photos_category_id ON photos(category_id);
CREATE INDEX idx_photos_status ON photos(status);
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_photos_price ON photos(price);
CREATE INDEX idx_photos_tags ON photos USING GIN(tags);

CREATE INDEX idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX idx_orders_photo_id ON orders(photo_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_photographers_user_id ON photographers(user_id);
CREATE INDEX idx_photographers_plan ON photographers(plan);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photographers_updated_at BEFORE UPDATE ON photographers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payouts_updated_at BEFORE UPDATE ON payouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar estatísticas do fotógrafo
CREATE OR REPLACE FUNCTION update_photographer_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
        UPDATE photographers 
        SET total_sales = total_sales + NEW.photographer_amount
        WHERE id = (SELECT photographer_id FROM photos WHERE id = NEW.photo_id);
    END IF;
    
    IF TG_OP = 'UPDATE' AND OLD.status != 'completed' AND NEW.status = 'completed' THEN
        UPDATE photographers 
        SET total_sales = total_sales + NEW.photographer_amount
        WHERE id = (SELECT photographer_id FROM photos WHERE id = NEW.photo_id);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_photographer_stats_trigger
    AFTER INSERT OR UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_photographer_stats();

-- Função para atualizar contador de fotos do fotógrafo
CREATE OR REPLACE FUNCTION update_photographer_photo_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE photographers 
        SET total_photos = total_photos + 1
        WHERE id = NEW.photographer_id;
        RETURN NEW;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        UPDATE photographers 
        SET total_photos = total_photos - 1
        WHERE id = OLD.photographer_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_photographer_photo_count_trigger
    AFTER INSERT OR DELETE ON photos
    FOR EACH ROW EXECUTE FUNCTION update_photographer_photo_count();

-- Row Level Security (RLS) Policies

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Políticas para photographers
CREATE POLICY "Anyone can view photographer profiles" ON photographers
    FOR SELECT USING (true);

CREATE POLICY "Photographers can update own profile" ON photographers
    FOR UPDATE USING (user_id = auth.uid());

-- Políticas para photos
CREATE POLICY "Anyone can view published photos" ON photos
    FOR SELECT USING (status = 'published');

CREATE POLICY "Photographers can manage own photos" ON photos
    FOR ALL USING (photographer_id IN (
        SELECT id FROM photographers WHERE user_id = auth.uid()
    ));

-- Políticas para orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (
        buyer_id = auth.uid() OR 
        photo_id IN (
            SELECT p.id FROM photos p 
            JOIN photographers ph ON p.photographer_id = ph.id 
            WHERE ph.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (buyer_id = auth.uid());

-- Políticas para payouts
CREATE POLICY "Photographers can view own payouts" ON payouts
    FOR SELECT USING (photographer_id IN (
        SELECT id FROM photographers WHERE user_id = auth.uid()
    ));

CREATE POLICY "Photographers can create payout requests" ON payouts
    FOR INSERT WITH CHECK (photographer_id IN (
        SELECT id FROM photographers WHERE user_id = auth.uid()
    ));

-- Políticas para cart_items
CREATE POLICY "Users can manage own cart" ON cart_items
    FOR ALL USING (user_id = auth.uid());

-- Políticas para favorites
CREATE POLICY "Users can manage own favorites" ON favorites
    FOR ALL USING (user_id = auth.uid());

-- Políticas para reviews
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews for own orders" ON reviews
    FOR INSERT WITH CHECK (
        reviewer_id = auth.uid() AND
        order_id IN (SELECT id FROM orders WHERE buyer_id = auth.uid())
    );

-- Função para criar perfil de usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_tenant_id UUID;
BEGIN
    -- Buscar o tenant padrão
    SELECT id INTO default_tenant_id FROM tenants WHERE name = 'Fotos63 Default' LIMIT 1;
    
    -- Inserir novo usuário
    INSERT INTO public.users (id, name, email, tenant_id)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email,
        default_tenant_id
    );
    
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger para criar usuário automaticamente após signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comentários nas tabelas
COMMENT ON TABLE users IS 'Usuários do sistema (clientes, fotógrafos, admins)';
COMMENT ON TABLE photographers IS 'Perfis estendidos dos fotógrafos';
COMMENT ON TABLE photos IS 'Fotos disponíveis para venda';
COMMENT ON TABLE orders IS 'Pedidos de compra de fotos';
COMMENT ON TABLE payouts IS 'Solicitações de saque dos fotógrafos';
COMMENT ON TABLE categories IS 'Categorias de fotos';
COMMENT ON TABLE cart_items IS 'Itens no carrinho de compras';
COMMENT ON TABLE favorites IS 'Fotos favoritadas pelos usuários';
COMMENT ON TABLE reviews IS 'Avaliações de fotógrafos';
COMMENT ON TABLE system_settings IS 'Configurações gerais do sistema';

