
// Configuração segura do Supabase para Fotos63
import { environmentConfig } from './environment.js';

class SupabaseManager {
    constructor() {
        this.config = environmentConfig.getConfig();
        this.client = null;
        this.isInitialized = false;
        this.initializeClient();
    }

    initializeClient() {
        try {
            if (!window.supabase) {
                throw new Error('Supabase SDK não carregado. Inclua o script do Supabase.');
            }

            const { supabase } = this.config;
            
            if (!supabase.url || !supabase.anonKey) {
                throw new Error('Credenciais do Supabase não configuradas');
            }

            this.client = window.supabase.createClient(supabase.url, supabase.anonKey, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true,
                    flowType: 'pkce'
                },
                realtime: {
                    params: {
                        eventsPerSecond: 10
                    }
                }
            });

            this.isInitialized = true;
            console.log('✅ Supabase cliente inicializado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Supabase:', error);
            this.isInitialized = false;
        }
    }

    getClient() {
        if (!this.isInitialized) {
            throw new Error('Supabase não inicializado. Verifique as configurações.');
        }
        return this.client;
    }

    // Métodos de autenticação
    async signUp(email, password, userData = {}) {
        const client = this.getClient();
        const { data, error } = await client.auth.signUp({
            email,
            password,
            options: {
                data: userData,
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });
        return { data, error };
    }

    async signIn(email, password) {
        const client = this.getClient();
        const { data, error } = await client.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    }

    async signInWithGoogle() {
        const client = this.getClient();
        const { data, error } = await client.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        return { data, error };
    }

    async signOut() {
        const client = this.getClient();
        const { error } = await client.auth.signOut();
        return { error };
    }

    async getCurrentUser() {
        const client = this.getClient();
        const { data: { user }, error } = await client.auth.getUser();
        return { user, error };
    }

    async resetPassword(email) {
        const client = this.getClient();
        const { data, error } = await client.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });
        return { data, error };
    }

    // Métodos de banco de dados
    async query(table) {
        const client = this.getClient();
        return client.from(table);
    }

    async getPhotos(filters = {}) {
        const client = this.getClient();
        let query = client
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
    }

    // Métodos de storage
    async uploadFile(bucket, path, file) {
        const client = this.getClient();
        const { data, error } = await client.storage
            .from(bucket)
            .upload(path, file, {
                cacheControl: '3600',
                upsert: false
            });
        return { data, error };
    }

    async getPublicUrl(bucket, path) {
        const client = this.getClient();
        const { data } = client.storage
            .from(bucket)
            .getPublicUrl(path);
        return data.publicUrl;
    }

    async deleteFile(bucket, path) {
        const client = this.getClient();
        const { data, error } = await client.storage
            .from(bucket)
            .remove([path]);
        return { data, error };
    }

    // Real-time subscriptions
    subscribeToPhotos(callback) {
        const client = this.getClient();
        return client
            .channel('photos')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'photos' }, 
                callback
            )
            .subscribe();
    }

    subscribeToOrders(userId, callback) {
        const client = this.getClient();
        return client
            .channel(`orders-${userId}`)
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

    // Health check
    async healthCheck() {
        try {
            const client = this.getClient();
            const { data, error } = await client
                .from('health_check')
                .select('count')
                .limit(1);
            
            return { healthy: !error, data, error };
        } catch (error) {
            return { healthy: false, error };
        }
    }
}

// Instância singleton
const supabaseManager = new SupabaseManager();

// Compatibilidade com código existente
window.supabase = supabaseManager.getClient();
window.SupabaseManager = supabaseManager;

export { supabaseManager };
export default supabaseManager;
