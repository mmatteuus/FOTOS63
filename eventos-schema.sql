-- Schema para Sistema de Eventos do Fotos63
-- Baseado no TocantinsAventura e adaptado para eventos esportivos e fotografia

-- Tabela de Eventos
CREATE TABLE IF NOT EXISTS eventos (
    id BIGSERIAL PRIMARY KEY,
    organizador_id UUID REFERENCES auth.users(id),
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    tipo_evento VARCHAR(50) NOT NULL, -- corrida, ciclismo, natacao, caminhada, etc
    localizacao VARCHAR(255) NOT NULL,
    endereco_completo TEXT,
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE,
    horario_largada TIME,
    ponto_encontro TEXT,
    preco_inscricao DECIMAL(10,2) DEFAULT 0,
    capacidade_maxima INTEGER,
    participantes_atuais INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'publicado', -- publicado, rascunho, cancelado, finalizado
    link_grupo_whatsapp TEXT,
    telefone_organizador VARCHAR(20),
    email_organizador VARCHAR(255),
    url_imagem TEXT,
    tags TEXT[], -- array de tags
    avaliacao_media DECIMAL(3,2) DEFAULT 0,
    total_avaliacoes INTEGER DEFAULT 0,
    permite_fotografos BOOLEAN DEFAULT true,
    preco_cobertura_fotografica DECIMAL(10,2),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Inscrições em Eventos
CREATE TABLE IF NOT EXISTS inscricoes_eventos (
    id BIGSERIAL PRIMARY KEY,
    evento_id BIGINT REFERENCES eventos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id),
    data_inscricao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pendente_pagamento', -- pendente_pagamento, confirmado, cancelado, reembolsado
    payment_id VARCHAR(255),
    tipo_inscricao VARCHAR(20) DEFAULT 'participante', -- participante, fotografo
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Ofertas de Fotógrafos para Eventos
CREATE TABLE IF NOT EXISTS ofertas_fotograficas (
    id BIGSERIAL PRIMARY KEY,
    evento_id BIGINT REFERENCES eventos(id) ON DELETE CASCADE,
    fotografo_id UUID REFERENCES auth.users(id),
    preco_proposto DECIMAL(10,2) NOT NULL,
    descricao_servico TEXT,
    portfolio_urls TEXT[], -- array de URLs de fotos do portfolio
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, aceito, rejeitado
    data_proposta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Avaliações de Eventos
CREATE TABLE IF NOT EXISTS avaliacoes_eventos (
    id BIGSERIAL PRIMARY KEY,
    evento_id BIGINT REFERENCES eventos(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES auth.users(id),
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Categorias de Eventos
CREATE TABLE IF NOT EXISTS categorias_eventos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao TEXT,
    icone VARCHAR(50), -- nome do ícone Bootstrap
    cor VARCHAR(7), -- código hex da cor
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO categorias_eventos (nome, descricao, icone, cor) VALUES
('Corrida', 'Corridas de rua, trail running e maratonas', 'bi-person-running', '#e74c3c'),
('Ciclismo', 'Passeios ciclísticos e competições de bike', 'bi-bicycle', '#3498db'),
('Natação', 'Competições aquáticas e travessias', 'bi-water', '#1abc9c'),
('Caminhada', 'Caminhadas ecológicas e trekking', 'bi-tree', '#27ae60'),
('Aventura', 'Esportes radicais e aventura', 'bi-mountain', '#f39c12'),
('Família', 'Eventos para toda a família', 'bi-people', '#9b59b6'),
('Competição', 'Eventos competitivos e campeonatos', 'bi-trophy', '#f1c40f'),
('Beneficente', 'Eventos com fins beneficentes', 'bi-heart', '#e91e63')
ON CONFLICT (nome) DO NOTHING;

-- Políticas RLS (Row Level Security)
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscricoes_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas_fotograficas ENABLE ROW LEVEL SECURITY;
ALTER TABLE avaliacoes_eventos ENABLE ROW LEVEL SECURITY;

-- Política para eventos: todos podem ver eventos publicados
CREATE POLICY "Eventos públicos são visíveis para todos" ON eventos
    FOR SELECT USING (status = 'publicado');

-- Política para eventos: organizadores podem gerenciar seus eventos
CREATE POLICY "Organizadores podem gerenciar seus eventos" ON eventos
    FOR ALL USING (auth.uid() = organizador_id);

-- Política para inscrições: usuários podem ver suas próprias inscrições
CREATE POLICY "Usuários podem ver suas inscrições" ON inscricoes_eventos
    FOR SELECT USING (auth.uid() = usuario_id);

-- Política para inscrições: usuários podem se inscrever
CREATE POLICY "Usuários podem se inscrever em eventos" ON inscricoes_eventos
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Política para ofertas fotográficas: fotógrafos podem ver suas ofertas
CREATE POLICY "Fotógrafos podem ver suas ofertas" ON ofertas_fotograficas
    FOR SELECT USING (auth.uid() = fotografo_id);

-- Política para ofertas fotográficas: fotógrafos podem criar ofertas
CREATE POLICY "Fotógrafos podem criar ofertas" ON ofertas_fotograficas
    FOR INSERT WITH CHECK (auth.uid() = fotografo_id);

-- Política para avaliações: usuários podem avaliar eventos que participaram
CREATE POLICY "Usuários podem avaliar eventos" ON avaliacoes_eventos
    FOR INSERT WITH CHECK (
        auth.uid() = usuario_id AND
        EXISTS (
            SELECT 1 FROM inscricoes_eventos 
            WHERE evento_id = avaliacoes_eventos.evento_id 
            AND usuario_id = auth.uid() 
            AND status = 'confirmado'
        )
    );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar updated_at na tabela eventos
CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON eventos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar contador de participantes
CREATE OR REPLACE FUNCTION atualizar_participantes_evento()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'confirmado' AND NEW.tipo_inscricao = 'participante' THEN
        UPDATE eventos 
        SET participantes_atuais = participantes_atuais + 1 
        WHERE id = NEW.evento_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status != 'confirmado' AND NEW.status = 'confirmado' AND NEW.tipo_inscricao = 'participante' THEN
        UPDATE eventos 
        SET participantes_atuais = participantes_atuais + 1 
        WHERE id = NEW.evento_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'confirmado' AND NEW.status != 'confirmado' AND OLD.tipo_inscricao = 'participante' THEN
        UPDATE eventos 
        SET participantes_atuais = participantes_atuais - 1 
        WHERE id = NEW.evento_id;
    ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmado' AND OLD.tipo_inscricao = 'participante' THEN
        UPDATE eventos 
        SET participantes_atuais = participantes_atuais - 1 
        WHERE id = OLD.evento_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

-- Trigger para atualizar contador de participantes
CREATE TRIGGER trigger_atualizar_participantes 
    AFTER INSERT OR UPDATE OR DELETE ON inscricoes_eventos
    FOR EACH ROW EXECUTE FUNCTION atualizar_participantes_evento();

-- Função para atualizar avaliação média do evento
CREATE OR REPLACE FUNCTION atualizar_avaliacao_evento()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE eventos 
    SET 
        avaliacao_media = (
            SELECT COALESCE(AVG(nota), 0) 
            FROM avaliacoes_eventos 
            WHERE evento_id = NEW.evento_id
        ),
        total_avaliacoes = (
            SELECT COUNT(*) 
            FROM avaliacoes_eventos 
            WHERE evento_id = NEW.evento_id
        )
    WHERE id = NEW.evento_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar avaliação média
CREATE TRIGGER trigger_atualizar_avaliacao 
    AFTER INSERT OR UPDATE ON avaliacoes_eventos
    FOR EACH ROW EXECUTE FUNCTION atualizar_avaliacao_evento();

-- Inserir eventos de exemplo
INSERT INTO eventos (
    organizador_id, titulo, descricao, tipo_evento, localizacao, endereco_completo,
    data_inicio, data_fim, horario_largada, ponto_encontro, preco_inscricao,
    capacidade_maxima, status, telefone_organizador, email_organizador,
    url_imagem, tags, permite_fotografos, preco_cobertura_fotografica, observacoes
) VALUES
(
    (SELECT id FROM auth.users LIMIT 1), -- Usar o primeiro usuário como organizador
    'Corrida do Cerrado 2024',
    'Corrida de 5km e 10km pelas trilhas do cerrado tocantinense. Evento beneficente em prol da preservação ambiental.',
    'corrida',
    'Parque Cesamar, Palmas - TO',
    'Parque Cesamar, Quadra 1503 Sul, Palmas - TO, 77023-128',
    '2024-03-15 06:00:00-03',
    '2024-03-15 10:00:00-03',
    '06:30:00',
    'Entrada principal do Parque Cesamar',
    35.00,
    500,
    'publicado',
    '(63) 99999-1234',
    'corrida@cerrado.com',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ARRAY['corrida', 'cerrado', 'beneficente', '5km', '10km'],
    true,
    200.00,
    'Kit do atleta inclui camiseta, medalha e lanche pós-prova'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Pedalada do Jalapão',
    'Passeio ciclístico de 30km pelas dunas douradas do Jalapão. Inclui guia especializado e parada para fotos.',
    'ciclismo',
    'Mateiros - TO',
    'Centro de Mateiros, próximo à entrada do Parque Estadual do Jalapão',
    '2024-03-22 07:00:00-03',
    '2024-03-22 12:00:00-03',
    '07:30:00',
    'Praça central de Mateiros',
    80.00,
    30,
    'publicado',
    '(63) 99888-5678',
    'pedalada@jalapao.com',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ARRAY['ciclismo', 'jalapão', 'aventura', 'dunas', 'natureza'],
    true,
    300.00,
    'Necessário levar bike própria. Capacete obrigatório.'
),
(
    (SELECT id FROM auth.users LIMIT 1),
    'Travessia do Rio Tocantins',
    'Competição de natação em águas abertas. Percurso de 2km atravessando o Rio Tocantins.',
    'natacao',
    'Praia da Graciosa, Palmas - TO',
    'Praia da Graciosa, Orla de Palmas - TO',
    '2024-04-05 16:00:00-03',
    '2024-04-05 18:00:00-03',
    '16:30:00',
    'Deck da Praia da Graciosa',
    50.00,
    100,
    'publicado',
    '(63) 99777-9012',
    'travessia@tocantins.com',
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ARRAY['natação', 'rio tocantins', 'águas abertas', 'competição'],
    true,
    250.00,
    'Obrigatório apresentar atestado médico'
);

