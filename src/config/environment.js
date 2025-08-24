
// Configuração de ambiente para Fotos63
class EnvironmentConfig {
    constructor() {
        this.config = {
            supabase: {
                url: 'https://weckkxjlqeulwpznauj.supabase.co',
                anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlY2treGpscWV1bHdwem5hdWoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc1NTg2NjA2OSwiZXhwIjoyMDcxNDQyMDY5fQ.4G7m0effx4xhHZ_Ipatp3W3zJlvi2vlKNaKzpmxmg6A'
            },
            app: {
                name: 'FOTOS63',
                version: '1.0.0',
                domain: 'fotos63.com.br'
            },
            storage: {
                buckets: {
                    photos: 'photos',
                    avatars: 'avatars',
                    watermarks: 'watermarks'
                }
            }
        };
    }

    getConfig() {
        return this.config;
    }

    getSupabaseUrl() {
        return this.config.supabase.url;
    }

    getSupabaseKey() {
        return this.config.supabase.anonKey;
    }
}

const environmentConfig = new EnvironmentConfig();
export { environmentConfig };
