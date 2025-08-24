-- Políticas de Storage para Supabase
-- Configurações de segurança para buckets de arquivos

-- Criar buckets necessários
INSERT INTO storage.buckets (id, name, public) VALUES 
('photos', 'photos', true),
('avatars', 'avatars', true),
('watermarks', 'watermarks', false);

-- Políticas para bucket 'photos'
-- Permitir visualização pública de fotos com marca d'água
CREATE POLICY "Public can view watermarked photos" ON storage.objects
FOR SELECT USING (bucket_id = 'photos' AND (storage.foldername(name))[1] = 'watermarked');

-- Permitir que fotógrafos façam upload de suas fotos
CREATE POLICY "Photographers can upload photos" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND 
    auth.uid()::text = (storage.foldername(name))[2] AND
    auth.uid() IN (
        SELECT user_id FROM photographers
    )
);

-- Permitir que fotógrafos gerenciem suas próprias fotos
CREATE POLICY "Photographers can manage own photos" ON storage.objects
FOR ALL USING (
    bucket_id = 'photos' AND 
    auth.uid()::text = (storage.foldername(name))[2] AND
    auth.uid() IN (
        SELECT user_id FROM photographers
    )
);

-- Permitir acesso a fotos completas apenas para compradores
CREATE POLICY "Buyers can access purchased photos" ON storage.objects
FOR SELECT USING (
    bucket_id = 'photos' AND 
    (storage.foldername(name))[1] = 'full' AND
    (storage.foldername(name))[3] IN (
        SELECT p.id::text FROM photos p
        JOIN orders o ON p.id = o.photo_id
        WHERE o.buyer_id = auth.uid() AND o.status = 'completed'
    )
);

-- Políticas para bucket 'avatars'
-- Permitir visualização pública de avatars
CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Permitir que usuários façam upload de seus próprios avatars
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuários atualizem seus próprios avatars
CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir que usuários deletem seus próprios avatars
CREATE POLICY "Users can delete own avatar" ON storage.objects
FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Políticas para bucket 'watermarks'
-- Apenas admins podem gerenciar marcas d'água
CREATE POLICY "Only admins can manage watermarks" ON storage.objects
FOR ALL USING (
    bucket_id = 'watermarks' AND 
    auth.uid() IN (
        SELECT id FROM users WHERE role = 'admin'
    )
);

-- Permitir que fotógrafos vejam marcas d'água disponíveis
CREATE POLICY "Photographers can view watermarks" ON storage.objects
FOR SELECT USING (
    bucket_id = 'watermarks' AND 
    auth.uid() IN (
        SELECT user_id FROM photographers
    )
);

-- Função para validar tipos de arquivo
CREATE OR REPLACE FUNCTION validate_file_type()
RETURNS TRIGGER AS $$
BEGIN
    -- Validar extensões permitidas para fotos
    IF NEW.bucket_id = 'photos' THEN
        IF NOT (NEW.name ~* '\.(jpg|jpeg|png|webp)$') THEN
            RAISE EXCEPTION 'Tipo de arquivo não permitido. Use apenas JPG, PNG ou WebP.';
        END IF;
    END IF;
    
    -- Validar extensões permitidas para avatars
    IF NEW.bucket_id = 'avatars' THEN
        IF NOT (NEW.name ~* '\.(jpg|jpeg|png|webp)$') THEN
            RAISE EXCEPTION 'Tipo de arquivo não permitido para avatar. Use apenas JPG, PNG ou WebP.';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validação de tipos de arquivo
CREATE TRIGGER validate_file_type_trigger
    BEFORE INSERT ON storage.objects
    FOR EACH ROW EXECUTE FUNCTION validate_file_type();

-- Função para limpar arquivos órfãos
CREATE OR REPLACE FUNCTION cleanup_orphaned_files()
RETURNS void AS $$
BEGIN
    -- Deletar fotos que não têm registro na tabela photos
    DELETE FROM storage.objects 
    WHERE bucket_id = 'photos' 
    AND (storage.foldername(name))[1] = 'watermarked'
    AND (storage.foldername(name))[3] NOT IN (
        SELECT id::text FROM photos
    );
    
    -- Deletar avatars de usuários que não existem mais
    DELETE FROM storage.objects 
    WHERE bucket_id = 'avatars' 
    AND (storage.foldername(name))[1] NOT IN (
        SELECT id::text FROM users
    );
END;
$$ LANGUAGE plpgsql;

-- Função para gerar URL de download temporária
CREATE OR REPLACE FUNCTION generate_download_url(photo_id UUID, user_id UUID)
RETURNS TEXT AS $$
DECLARE
    photo_record RECORD;
    order_record RECORD;
    download_url TEXT;
BEGIN
    -- Verificar se a foto existe
    SELECT * INTO photo_record FROM photos WHERE id = photo_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Foto não encontrada';
    END IF;
    
    -- Verificar se o usuário comprou a foto
    SELECT * INTO order_record 
    FROM orders 
    WHERE photo_id = photo_id AND buyer_id = user_id AND status = 'completed';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usuário não tem permissão para baixar esta foto';
    END IF;
    
    -- Gerar URL de download (implementação simplificada)
    download_url := 'https://your-supabase-url.supabase.co/storage/v1/object/sign/photos/full/' || 
                   photo_record.photographer_id || '/' || photo_id || '_full.jpg?token=temp_token';
    
    -- Atualizar o pedido com a URL e expiração
    UPDATE orders 
    SET download_url = download_url,
        download_expires_at = NOW() + INTERVAL '7 days'
    WHERE id = order_record.id;
    
    RETURN download_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para aplicar marca d'água (placeholder - implementação real seria em Edge Function)
CREATE OR REPLACE FUNCTION apply_watermark(original_path TEXT, watermark_path TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Esta função seria implementada como uma Edge Function do Supabase
    -- que processaria a imagem e aplicaria a marca d'água
    -- Por enquanto, retorna apenas o caminho original
    RETURN original_path;
END;
$$ LANGUAGE plpgsql;

-- Configurações de limite de tamanho por bucket
UPDATE storage.buckets 
SET file_size_limit = 10485760 -- 10MB
WHERE id IN ('photos', 'avatars');

UPDATE storage.buckets 
SET file_size_limit = 1048576 -- 1MB
WHERE id = 'watermarks';

-- Comentários nas políticas
COMMENT ON POLICY "Public can view watermarked photos" ON storage.objects IS 
'Permite visualização pública de fotos com marca d''água para preview';

COMMENT ON POLICY "Photographers can upload photos" ON storage.objects IS 
'Permite que fotógrafos façam upload de fotos em suas próprias pastas';

COMMENT ON POLICY "Buyers can access purchased photos" ON storage.objects IS 
'Permite acesso a fotos em alta resolução apenas para compradores autorizados';

COMMENT ON POLICY "Users can upload own avatar" ON storage.objects IS 
'Permite que usuários façam upload de seus próprios avatars';

COMMENT ON POLICY "Only admins can manage watermarks" ON storage.objects IS 
'Restringe gerenciamento de marcas d''água apenas para administradores';

