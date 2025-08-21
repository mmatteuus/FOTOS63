// Configuração do Supabase para Fotos63
// Este arquivo deve ser configurado com as credenciais reais do projeto

// Configurações do Supabase (substituir pelos valores reais)
const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_URL', // Ex: https://xyzcompany.supabase.co
    anonKey: 'YOUR_SUPABASE_ANON_KEY', // Chave pública do projeto
    serviceRoleKey: 'YOUR_SUPABASE_SERVICE_ROLE_KEY' // Apenas para operações administrativas
};

// Inicialização do cliente Supabase
const supabase = supabase.createClient(
    SUPABASE_CONFIG.url,
    SUPABASE_CONFIG.anonKey
);

// Configurações de Storage
const STORAGE_CONFIG = {
    buckets: {
        photos: 'photos', // Bucket para fotos
        avatars: 'avatars', // Bucket para avatars
        watermarks: 'watermarks' // Bucket para marcas d'água
    },
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    imageQuality: 0.8, // Qualidade de compressão
    thumbnailSize: { width: 300, height: 300 },
    watermarkOpacity: 0.7
};

// Configurações de autenticação
const AUTH_CONFIG = {
    redirectTo: window.location.origin,
    providers: {
        google: {
            enabled: true,
            scopes: 'email profile'
        }
    },
    passwordRequirements: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true
    }
};

// Configurações de pagamento
const PAYMENT_CONFIG = {
    stripe: {
        publishableKey: 'pk_test_...', // Chave pública do Stripe
        currency: 'brl'
    },
    mercadoPago: {
        publicKey: 'TEST-...', // Chave pública do Mercado Pago
        currency: 'BRL'
    },
    commission: {
        free: 35, // 35% para plano gratuito
        pro: 25,  // 25% para plano pro
        business: 15 // 15% para plano business
    }
};

// Configurações de planos
const PLANS_CONFIG = {
    free: {
        name: 'Gratuito',
        price: 0,
        maxPhotos: 50,
        storageGB: 1,
        commission: 35,
        features: ['Upload básico', 'Galeria pública', 'Suporte por email']
    },
    pro: {
        name: 'Profissional',
        price: 29.90,
        maxPhotos: 500,
        storageGB: 10,
        commission: 25,
        features: ['Analytics avançado', 'Marca d\'água personalizada', 'Suporte prioritário']
    },
    business: {
        name: 'Empresarial',
        price: 59.90,
        maxPhotos: -1, // Ilimitado
        storageGB: 50,
        commission: 15,
        features: ['Fotos ilimitadas', 'API personalizada', 'Marca própria', 'Suporte 24/7']
    }
};

// Funções utilitárias para Supabase
const SupabaseUtils = {
    // Autenticação
    async signUp(email, password, userData = {}) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        });
        return { data, error };
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    },

    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: AUTH_CONFIG.redirectTo
            }
        });
        return { data, error };
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    },

    async resetPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });
        return { data, error };
    },

    // Database operations
    async getUserProfile(userId) {
        const { data, error } = await supabase
            .from('users')
            .select('*, photographers(*)')
            .eq('id', userId)
            .single();
        return { data, error };
    },

    async updateUserProfile(userId, updates) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
        return { data, error };
    },

    async createPhotographerProfile(userId, profileData) {
        const { data, error } = await supabase
            .from('photographers')
            .insert({ user_id: userId, ...profileData })
            .select()
            .single();
        return { data, error };
    },

    // Photos operations
    async getPhotos(filters = {}) {
        let query = supabase
            .from('photos')
            .select(`
                *,
                photographers(user_id, users(name)),
                categories(name, slug)
            `)
            .eq('status', 'published');

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

        const { data, error } = await query.order('created_at', { ascending: false });
        return { data, error };
    },

    async getPhotoById(photoId) {
        const { data, error } = await supabase
            .from('photos')
            .select(`
                *,
                photographers(*, users(name, email)),
                categories(name, slug)
            `)
            .eq('id', photoId)
            .single();
        return { data, error };
    },

    async uploadPhoto(photographerId, photoData, file) {
        // Upload do arquivo
        const fileName = `${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('photos')
            .upload(`watermarked/${photographerId}/${fileName}`, file);

        if (uploadError) return { data: null, error: uploadError };

        // Criar registro no banco
        const { data, error } = await supabase
            .from('photos')
            .insert({
                photographer_id: photographerId,
                watermark_url: uploadData.path,
                ...photoData
            })
            .select()
            .single();

        return { data, error };
    },

    // Orders operations
    async createOrder(photoId, buyerId, paymentData) {
        const { data, error } = await supabase
            .from('orders')
            .insert({
                photo_id: photoId,
                buyer_id: buyerId,
                ...paymentData
            })
            .select()
            .single();
        return { data, error };
    },

    async getUserOrders(userId) {
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                photos(title, watermark_url, photographers(users(name)))
            `)
            .eq('buyer_id', userId)
            .order('created_at', { ascending: false });
        return { data, error };
    },

    // Storage operations
    async uploadFile(bucket, path, file) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file);
        return { data, error };
    },

    async getPublicUrl(bucket, path) {
        const { data } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);
        return data.publicUrl;
    },

    async deleteFile(bucket, path) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .remove([path]);
        return { data, error };
    },

    // Real-time subscriptions
    subscribeToPhotos(callback) {
        return supabase
            .channel('photos')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'photos' }, 
                callback
            )
            .subscribe();
    },

    subscribeToOrders(userId, callback) {
        return supabase
            .channel('orders')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'orders',
                    filter: `buyer_id=eq.${userId}`
                }, 
                callback
            )
            .subscribe();
    }
};

// Middleware de autenticação
const AuthMiddleware = {
    async requireAuth() {
        const { user } = await SupabaseUtils.getCurrentUser();
        if (!user) {
            window.location.href = '/login.html';
            return null;
        }
        return user;
    },

    async requireRole(requiredRole) {
        const user = await this.requireAuth();
        if (!user) return null;

        const { data: profile } = await SupabaseUtils.getUserProfile(user.id);
        if (!profile || profile.role !== requiredRole) {
            alert('Acesso negado. Você não tem permissão para acessar esta página.');
            window.location.href = '/';
            return null;
        }
        return { user, profile };
    },

    async requirePhotographer() {
        return await this.requireRole('fotografo');
    },

    async requireAdmin() {
        return await this.requireRole('admin');
    }
};

// Event listeners para mudanças de autenticação
supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session);
    
    // Atualizar UI baseado no estado de autenticação
    if (event === 'SIGNED_IN') {
        updateUIForAuthenticatedUser(session.user);
    } else if (event === 'SIGNED_OUT') {
        updateUIForUnauthenticatedUser();
    }
});

// Funções para atualizar UI
function updateUIForAuthenticatedUser(user) {
    // Mostrar elementos para usuários logados
    document.querySelectorAll('.auth-required').forEach(el => {
        el.style.display = 'block';
    });
    
    // Esconder elementos para usuários não logados
    document.querySelectorAll('.guest-only').forEach(el => {
        el.style.display = 'none';
    });
    
    // Atualizar informações do usuário
    document.querySelectorAll('.user-email').forEach(el => {
        el.textContent = user.email;
    });
}

function updateUIForUnauthenticatedUser() {
    // Esconder elementos para usuários logados
    document.querySelectorAll('.auth-required').forEach(el => {
        el.style.display = 'none';
    });
    
    // Mostrar elementos para usuários não logados
    document.querySelectorAll('.guest-only').forEach(el => {
        el.style.display = 'block';
    });
}

// Exportar configurações e utilitários
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
window.STORAGE_CONFIG = STORAGE_CONFIG;
window.AUTH_CONFIG = AUTH_CONFIG;
window.PAYMENT_CONFIG = PAYMENT_CONFIG;
window.PLANS_CONFIG = PLANS_CONFIG;
window.supabase = supabase;
window.SupabaseUtils = SupabaseUtils;
window.AuthMiddleware = AuthMiddleware;

