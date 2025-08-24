
// Configuração de ambiente segura para Fotos63
// Carrega configurações de variáveis de ambiente ou valores padrão seguros

class EnvironmentConfig {
    constructor() {
        this.config = this.loadConfig();
        this.validateConfig();
    }

    loadConfig() {
        // Tenta carregar de variáveis de ambiente primeiro
        const envConfig = this.loadFromEnvironment();
        if (envConfig.supabase.url && envConfig.supabase.anonKey) {
            return envConfig;
        }

        // Fallback para configuração local (apenas para desenvolvimento)
        const localConfig = this.loadFromLocalConfig();
        if (localConfig) {
            console.warn('AVISO: Usando configuração local. Configure variáveis de ambiente em produção.');
            return localConfig;
        }

        // Se nenhuma configuração foi encontrada, retorna valores placeholder
        console.error('ERRO: Nenhuma configuração válida encontrada. Configure as variáveis de ambiente.');
        return this.getPlaceholderConfig();
    }

    loadFromEnvironment() {
        return {
            app: {
                name: this.getEnvVar('APP_NAME', 'Fotos63'),
                url: this.getEnvVar('APP_URL', 'https://fotos63.com.br'),
                env: this.getEnvVar('APP_ENV', 'development'),
                debug: this.getEnvVar('APP_DEBUG', 'false') === 'true'
            },
            supabase: {
                url: this.getEnvVar('SUPABASE_URL', ''),
                anonKey: this.getEnvVar('SUPABASE_ANON_KEY', ''),
                serviceRoleKey: this.getEnvVar('SUPABASE_SERVICE_ROLE_KEY', '')
            },
            stripe: {
                publicKey: this.getEnvVar('STRIPE_PUBLIC_KEY', ''),
                currency: 'brl'
            },
            mercadoPago: {
                publicKey: this.getEnvVar('MERCADOPAGO_PUBLIC_KEY', ''),
                currency: 'BRL'
            },
            storage: {
                maxFileSize: parseInt(this.getEnvVar('MAX_FILE_SIZE', '10485760')),
                allowedTypes: this.getEnvVar('ALLOWED_FILE_TYPES', 'image/jpeg,image/png,image/webp').split(','),
                cdnUrl: this.getEnvVar('CDN_URL', '')
            },
            google: {
                analyticsId: this.getEnvVar('GA4_MEASUREMENT_ID', ''),
                mapsApiKey: this.getEnvVar('GOOGLE_MAPS_API_KEY', '')
            }
        };
    }

    loadFromLocalConfig() {
        try {
            // Tenta carregar configuração local do arquivo .env.local (apenas desenvolvimento)
            if (typeof window !== 'undefined' && window.LOCAL_CONFIG) {
                return window.LOCAL_CONFIG;
            }
            return null;
        } catch (error) {
            console.warn('Não foi possível carregar configuração local:', error);
            return null;
        }
    }

    getPlaceholderConfig() {
        return {
            app: {
                name: 'Fotos63',
                url: 'https://fotos63.com.br',
                env: 'development',
                debug: true
            },
            supabase: {
                url: 'YOUR_SUPABASE_URL',
                anonKey: 'YOUR_SUPABASE_ANON_KEY',
                serviceRoleKey: 'YOUR_SUPABASE_SERVICE_ROLE_KEY'
            },
            stripe: {
                publicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY',
                currency: 'brl'
            },
            mercadoPago: {
                publicKey: 'TEST-YOUR-MERCADOPAGO-PUBLIC-KEY',
                currency: 'BRL'
            },
            storage: {
                maxFileSize: 10485760, // 10MB
                allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
                cdnUrl: ''
            },
            google: {
                analyticsId: 'G-XXXXXXXXXX',
                mapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
            }
        };
    }

    getEnvVar(name, defaultValue = '') {
        // No browser, tenta acessar variáveis globais definidas no build
        if (typeof window !== 'undefined') {
            return window.ENV?.[name] || defaultValue;
        }
        
        // No Node.js, usa process.env
        if (typeof process !== 'undefined' && process.env) {
            return process.env[name] || defaultValue;
        }
        
        return defaultValue;
    }

    validateConfig() {
        const { supabase } = this.config;
        
        if (!supabase.url || supabase.url === 'YOUR_SUPABASE_URL') {
            console.error('ERRO CRÍTICO: SUPABASE_URL não configurado');
            this.showConfigurationError();
        }
        
        if (!supabase.anonKey || supabase.anonKey === 'YOUR_SUPABASE_ANON_KEY') {
            console.error('ERRO CRÍTICO: SUPABASE_ANON_KEY não configurado');
            this.showConfigurationError();
        }
    }

    showConfigurationError() {
        if (typeof document !== 'undefined') {
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; width: 100%; background: #ff4444; color: white; padding: 10px; z-index: 10000; text-align: center;">
                    <strong>ERRO DE CONFIGURAÇÃO:</strong> As variáveis de ambiente não estão configuradas. 
                    Consulte o README.md para instruções de configuração.
                </div>
            `;
            document.body.insertBefore(errorDiv, document.body.firstChild);
        }
    }

    getConfig() {
        return this.config;
    }

    isProduction() {
        return this.config.app.env === 'production';
    }

    isDevelopment() {
        return this.config.app.env === 'development';
    }
}

// Instância singleton
const environmentConfig = new EnvironmentConfig();

// Exporta a configuração
window.ENV_CONFIG = environmentConfig.getConfig();
window.EnvironmentConfig = environmentConfig;

export { environmentConfig };
export default environmentConfig;
