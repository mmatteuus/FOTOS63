// API Functions para Fotos63
// Lógica de negócio e funções auxiliares para o backend

// Classe principal para gerenciar APIs
class Fotos63API {
    constructor() {
        this.supabase = window.supabase;
        this.config = window.SUPABASE_CONFIG;
    }

    // ==================== AUTENTICAÇÃO ====================
    
    async register(userData) {
        try {
            const { email, password, name, role = 'cliente' } = userData;
            
            // Validar dados
            if (!this.validateEmail(email)) {
                throw new Error('Email inválido');
            }
            
            if (!this.validatePassword(password)) {
                throw new Error('Senha deve ter pelo menos 8 caracteres');
            }
            
            // Criar usuário no Supabase Auth
            const { data: authData, error: authError } = await this.supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        role
                    }
                }
            });
            
            if (authError) throw authError;
            
            return {
                success: true,
                data: authData,
                message: 'Usuário criado com sucesso! Verifique seu email.'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async login(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) throw error;
            
            // Buscar perfil completo do usuário
            const profile = await this.getUserProfile(data.user.id);
            
            return {
                success: true,
                data: {
                    user: data.user,
                    profile: profile.data
                },
                message: 'Login realizado com sucesso!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            
            return {
                success: true,
                message: 'Logout realizado com sucesso!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // ==================== PERFIL DE USUÁRIO ====================
    
    async getUserProfile(userId) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .select(`
                    *,
                    photographers(*)
                `)
                .eq('id', userId)
                .single();
                
            if (error) throw error;
            
            return {
                success: true,
                data
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async updateUserProfile(userId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('users')
                .update(updates)
                .eq('id', userId)
                .select()
                .single();
                
            if (error) throw error;
            
            return {
                success: true,
                data,
                message: 'Perfil atualizado com sucesso!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async becomePhotographer(userId, photographerData) {
        try {
            // Atualizar role do usuário
            await this.supabase
                .from('users')
                .update({ role: 'fotografo' })
                .eq('id', userId);
            
            // Criar perfil de fotógrafo
            const { data, error } = await this.supabase
                .from('photographers')
                .insert({
                    user_id: userId,
                    ...photographerData
                })
                .select()
                .single();
                
            if (error) throw error;
            
            return {
                success: true,
                data,
                message: 'Perfil de fotógrafo criado com sucesso!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // ==================== FOTOS ====================
    
    async getPhotos(filters = {}) {
        try {
            let query = this.supabase
                .from('photos')
                .select(`
                    *,
                    photographers!inner(
                        id,
                        user_id,
                        users!inner(name, avatar_url)
                    ),
                    categories(name, slug)
                `)
                .eq('status', 'published');
            
            // Aplicar filtros
            if (filters.category) {
                query = query.eq('category_id', filters.category);
            }
            
            if (filters.photographer) {
                query = query.eq('photographer_id', filters.photographer);
            }
            
            if (filters.minPrice) {
                query = query.gte('price', filters.minPrice);
            }
            
            if (filters.maxPrice) {
                query = query.lte('price', filters.maxPrice);
            }
            
            if (filters.search) {
                query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
            }
            
            if (filters.tags && filters.tags.length > 0) {
                query = query.overlaps('tags', filters.tags);
            }
            
            // Ordenação
            const orderBy = filters.orderBy || 'created_at';
            const ascending = filters.ascending || false;
            query = query.order(orderBy, { ascending });
            
            // Paginação
            if (filters.limit) {
                query = query.limit(filters.limit);
            }
            
            if (filters.offset) {
                query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
            }
            
            const { data, error } = await query;
            
            if (error) throw error;
            
            return {
                success: true,
                data
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async getPhotoById(photoId) {
        try {
            const { data, error } = await this.supabase
                .from('photos')
                .select(`
                    *,
                    photographers(
                        *,
                        users(name, email, avatar_url)
                    ),
                    categories(name, slug)
                `)
                .eq('id', photoId)
                .single();
                
            if (error) throw error;
            
            // Incrementar contador de visualizações
            await this.incrementPhotoViews(photoId);
            
            return {
                success: true,
                data
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async uploadPhoto(photographerId, photoData, file) {
        try {
            // Validar arquivo
            if (!this.validateImageFile(file)) {
                throw new Error('Arquivo inválido. Use apenas JPG, PNG ou WebP.');
            }
            
            // Gerar nome único para o arquivo
            const fileName = `${Date.now()}_${this.sanitizeFileName(file.name)}`;
            const filePath = `watermarked/${photographerId}/${fileName}`;
            
            // Upload do arquivo
            const { data: uploadData, error: uploadError } = await this.supabase.storage
                .from('photos')
                .upload(filePath, file);
                
            if (uploadError) throw uploadError;
            
            // Obter URL pública
            const { data: urlData } = this.supabase.storage
                .from('photos')
                .getPublicUrl(filePath);
            
            // Criar registro no banco
            const { data, error } = await this.supabase
                .from('photos')
                .insert({
                    photographer_id: photographerId,
                    watermark_url: urlData.publicUrl,
                    full_url: urlData.publicUrl, // Temporário - será processado depois
                    file_size: file.size,
                    ...photoData
                })
                .select()
                .single();
                
            if (error) throw error;
            
            return {
                success: true,
                data,
                message: 'Foto enviada com sucesso!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async updatePhoto(photoId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('photos')
                .update(updates)
                .eq('id', photoId)
                .select()
                .single();
                
            if (error) throw error;
            
            return {
                success: true,
                data,
                message: 'Foto atualizada com sucesso!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async deletePhoto(photoId) {
        try {
            // Buscar dados da foto para deletar arquivo
            const { data: photo } = await this.supabase
                .from('photos')
                .select('watermark_url, full_url')
                .eq('id', photoId)
                .single();
            
            // Deletar registro do banco
            const { error } = await this.supabase
                .from('photos')
                .delete()
                .eq('id', photoId);
                
            if (error) throw error;
            
            // Deletar arquivos do storage (opcional - pode ser feito por cleanup job)
            if (photo) {
                const watermarkPath = this.extractPathFromUrl(photo.watermark_url);
                const fullPath = this.extractPathFromUrl(photo.full_url);
                
                if (watermarkPath) {
                    await this.supabase.storage.from('photos').remove([watermarkPath]);
                }
                if (fullPath && fullPath !== watermarkPath) {
                    await this.supabase.storage.from('photos').remove([fullPath]);
                }
            }
            
            return {
                success: true,
                message: 'Foto deletada com sucesso!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // ==================== PEDIDOS ====================
    
    async createOrder(orderData) {
        try {
            const { photo_id, buyer_id, amount } = orderData;
            
            // Buscar dados da foto e fotógrafo
            const { data: photo } = await this.supabase
                .from('photos')
                .select(`
                    *,
                    photographers(commission_rate, plan)
                `)
                .eq('id', photo_id)
                .single();
            
            if (!photo) {
                throw new Error('Foto não encontrada');
            }
            
            // Calcular comissão
            const commissionRate = photo.photographers.commission_rate || 35;
            const commission = (amount * commissionRate) / 100;
            const photographerAmount = amount - commission;
            
            // Criar pedido
            const { data, error } = await this.supabase
                .from('orders')
                .insert({
                    photo_id,
                    buyer_id,
                    amount,
                    commission,
                    photographer_amount: photographerAmount,
                    status: 'pending'
                })
                .select()
                .single();
                
            if (error) throw error;
            
            return {
                success: true,
                data,
                message: 'Pedido criado com sucesso!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async completeOrder(orderId, paymentData) {
        try {
            // Atualizar status do pedido
            const { data, error } = await this.supabase
                .from('orders')
                .update({
                    status: 'completed',
                    payment_method: paymentData.method,
                    payment_id: paymentData.id,
                    payment_data: paymentData
                })
                .eq('id', orderId)
                .select()
                .single();
                
            if (error) throw error;
            
            // Gerar URL de download
            const downloadUrl = await this.generateDownloadUrl(data.photo_id, data.buyer_id);
            
            // Atualizar pedido com URL de download
            await this.supabase
                .from('orders')
                .update({
                    download_url: downloadUrl,
                    download_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
                })
                .eq('id', orderId);
            
            return {
                success: true,
                data: { ...data, download_url: downloadUrl },
                message: 'Pagamento processado com sucesso!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async getUserOrders(userId, type = 'buyer') {
        try {
            let query = this.supabase
                .from('orders')
                .select(`
                    *,
                    photos(
                        title,
                        watermark_url,
                        photographers(
                            users(name)
                        )
                    )
                `);
            
            if (type === 'buyer') {
                query = query.eq('buyer_id', userId);
            } else {
                // Para fotógrafos - buscar pedidos de suas fotos
                query = query.in('photo_id', 
                    this.supabase
                        .from('photos')
                        .select('id')
                        .eq('photographer_id', userId)
                );
            }
            
            const { data, error } = await query.order('created_at', { ascending: false });
            
            if (error) throw error;
            
            return {
                success: true,
                data
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // ==================== CARRINHO ====================
    
    async addToCart(userId, photoId) {
        try {
            const { data, error } = await this.supabase
                .from('cart_items')
                .insert({
                    user_id: userId,
                    photo_id: photoId
                })
                .select()
                .single();
                
            if (error) {
                if (error.code === '23505') { // Unique constraint violation
                    throw new Error('Item já está no carrinho');
                }
                throw error;
            }
            
            return {
                success: true,
                data,
                message: 'Item adicionado ao carrinho!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async removeFromCart(userId, photoId) {
        try {
            const { error } = await this.supabase
                .from('cart_items')
                .delete()
                .eq('user_id', userId)
                .eq('photo_id', photoId);
                
            if (error) throw error;
            
            return {
                success: true,
                message: 'Item removido do carrinho!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async getCartItems(userId) {
        try {
            const { data, error } = await this.supabase
                .from('cart_items')
                .select(`
                    *,
                    photos(
                        *,
                        photographers(
                            users(name)
                        )
                    )
                `)
                .eq('user_id', userId);
                
            if (error) throw error;
            
            return {
                success: true,
                data
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async clearCart(userId) {
        try {
            const { error } = await this.supabase
                .from('cart_items')
                .delete()
                .eq('user_id', userId);
                
            if (error) throw error;
            
            return {
                success: true,
                message: 'Carrinho limpo com sucesso!'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // ==================== CATEGORIAS ====================
    
    async getCategories() {
        try {
            const { data, error } = await this.supabase
                .from('categories')
                .select('*')
                .eq('is_active', true)
                .order('name');
                
            if (error) throw error;
            
            return {
                success: true,
                data
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // ==================== DASHBOARD ====================
    
    async getPhotographerStats(photographerId) {
        try {
            // Buscar estatísticas básicas
            const { data: photographer } = await this.supabase
                .from('photographers')
                .select('total_sales, total_photos')
                .eq('id', photographerId)
                .single();
            
            // Buscar vendas do mês atual
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0, 0, 0, 0);
            
            const { data: monthlyOrders } = await this.supabase
                .from('orders')
                .select('photographer_amount')
                .in('photo_id', 
                    this.supabase
                        .from('photos')
                        .select('id')
                        .eq('photographer_id', photographerId)
                )
                .eq('status', 'completed')
                .gte('created_at', startOfMonth.toISOString());
            
            const monthlySales = monthlyOrders?.reduce((sum, order) => sum + parseFloat(order.photographer_amount), 0) || 0;
            
            // Buscar fotos mais visualizadas
            const { data: topPhotos } = await this.supabase
                .from('photos')
                .select('title, views, downloads')
                .eq('photographer_id', photographerId)
                .order('views', { ascending: false })
                .limit(5);
            
            return {
                success: true,
                data: {
                    totalSales: photographer?.total_sales || 0,
                    totalPhotos: photographer?.total_photos || 0,
                    monthlySales,
                    topPhotos: topPhotos || []
                }
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // ==================== FUNÇÕES AUXILIARES ====================
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validatePassword(password) {
        return password && password.length >= 8;
    }
    
    validateImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB
        
        return allowedTypes.includes(file.type) && file.size <= maxSize;
    }
    
    sanitizeFileName(fileName) {
        return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    }
    
    extractPathFromUrl(url) {
        if (!url) return null;
        const match = url.match(/\/storage\/v1\/object\/public\/[^\/]+\/(.+)$/);
        return match ? match[1] : null;
    }
    
    async incrementPhotoViews(photoId) {
        try {
            await this.supabase.rpc('increment_photo_views', { photo_id: photoId });
        } catch (error) {
            console.error('Erro ao incrementar visualizações:', error);
        }
    }
    
    async generateDownloadUrl(photoId, userId) {
        // Esta função seria implementada como uma Edge Function
        // Por enquanto, retorna uma URL simulada
        return `https://fotos63.com/download/${photoId}?user=${userId}&token=${Date.now()}`;
    }
    
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
    }
}

// Função SQL para incrementar visualizações (deve ser criada no Supabase)
const incrementViewsSQL = `
CREATE OR REPLACE FUNCTION increment_photo_views(photo_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE photos 
    SET views = views + 1 
    WHERE id = photo_id;
END;
$$ LANGUAGE plpgsql;
`;

// Instanciar API globalmente
window.Fotos63API = new Fotos63API();

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Fotos63API;
}

