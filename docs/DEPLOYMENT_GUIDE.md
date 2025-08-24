# 🚀 Guia de Implantação - Fotos63

## Visão Geral

O **Fotos63** é uma aplicação SaaS completa para marketplace de fotos profissionais, desenvolvida especificamente para o mercado do Tocantins. Este guia fornece instruções detalhadas para implantar e configurar toda a aplicação.

## 📋 Pré-requisitos

### Serviços Necessários
- **Supabase** (Banco de dados e autenticação)
- **Vercel/Netlify** (Hospedagem do frontend)
- **Stripe** (Processamento de pagamentos)
- **SendGrid** (Envio de emails)
- **WhatsApp Business API** (Notificações)
- **Google Analytics 4** (Analytics)

### Ferramentas de Desenvolvimento
- Node.js 18+
- npm ou yarn
- Git

## 🏗️ Arquitetura da Aplicação

```
Fotos63/
├── Frontend (HTML/CSS/JavaScript)
├── Backend (Supabase + Edge Functions)
├── Banco de Dados (PostgreSQL via Supabase)
├── Storage (Supabase Storage)
├── Autenticação (Supabase Auth)
└── Integrações (APIs externas)
```

## 📦 Estrutura de Arquivos

```
fotos63/
├── index.html                    # Página principal
├── auth.html                     # Autenticação
├── dashboard.html                # Dashboard
├── checkout.html                 # Checkout
├── supabase-schema.sql          # Schema do banco
├── supabase-config.js           # Configuração Supabase
├── storage-policies.sql         # Políticas de storage
├── api-functions.js             # Funções da API
├── facial-recognition.js        # Reconhecimento facial
├── gallery-customization.js     # Personalização de galeria
├── withdrawal-system.js         # Sistema de saque
├── print-on-demand.js          # Impressão sob demanda
├── event-management.js         # Gestão de eventos
├── email-marketing.js          # Email marketing
├── seo-optimization.js         # Otimização SEO
├── premium-subscription.js     # Assinatura premium
├── physical-products.js        # Produtos físicos
├── intuitive-ux.js            # UX intuitiva
├── intelligent-upsell.js      # Upsell inteligente
├── payment-integration.js     # Integração pagamentos
├── watermark-processor.js     # Processador de marca d'água
├── test-suite.js             # Suite de testes
├── package.json              # Dependências
└── README.md                 # Documentação
```

## 🔧 Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Configure:
   - **Name**: fotos63-production
   - **Database Password**: [senha segura]
   - **Region**: South America (São Paulo)

### 2. Configurar Banco de Dados

Execute o script SQL no editor do Supabase:

```sql
-- Copie e execute o conteúdo de supabase-schema.sql
```

### 3. Configurar Storage

1. Vá para Storage no painel do Supabase
2. Crie os buckets:
   - `photos` (público)
   - `watermarked` (público)
   - `thumbnails` (público)
   - `user-uploads` (privado)

Execute as políticas de storage:

```sql
-- Copie e execute o conteúdo de storage-policies.sql
```

### 4. Configurar Autenticação

1. Vá para Authentication > Settings
2. Configure:
   - **Site URL**: https://seudominio.com
   - **Redirect URLs**: 
     - https://seudominio.com/auth/callback
     - https://seudominio.com/dashboard

3. Habilite provedores:
   - Email/Password ✅
   - Google OAuth (opcional)
   - Facebook OAuth (opcional)

## 🌐 Configuração do Frontend

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Google Analytics
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# APIs
VITE_WHATSAPP_API_URL=https://api.whatsapp.com/send
VITE_INSTAGRAM_API_URL=https://graph.instagram.com

# Configurações
VITE_APP_NAME=Fotos63
VITE_APP_URL=https://fotos63.com
VITE_SUPPORT_EMAIL=suporte@fotos63.com
```

### 2. Atualizar Configurações

Edite o arquivo `supabase-config.js`:

```javascript
const supabaseUrl = 'https://seu-projeto.supabase.co'
const supabaseKey = 'sua-chave-anonima'
```

### 3. Deploy do Frontend

#### Opção A: Vercel

1. Instale a CLI do Vercel:
```bash
npm install -g vercel
```

2. Faça o deploy:
```bash
vercel --prod
```

3. Configure as variáveis de ambiente no painel do Vercel

#### Opção B: Netlify

1. Conecte seu repositório ao Netlify
2. Configure as variáveis de ambiente
3. Deploy automático será executado

## 💳 Configuração de Pagamentos

### 1. Stripe

1. Crie conta no [Stripe](https://stripe.com)
2. Obtenha as chaves da API (publishable e secret)
3. Configure webhooks:
   - **URL**: https://seudominio.com/api/webhooks/stripe
   - **Eventos**: 
     - payment_intent.succeeded
     - subscription.created
     - subscription.updated
     - subscription.deleted

### 2. PagSeguro (Opcional)

1. Crie conta no PagSeguro
2. Obtenha token de integração
3. Configure notificações automáticas

## 📧 Configuração de Email

### 1. SendGrid

1. Crie conta no [SendGrid](https://sendgrid.com)
2. Obtenha API Key
3. Configure domínio de envio
4. Crie templates de email:
   - Boas-vindas
   - Notificação de nova foto
   - Confirmação de compra
   - Relatório mensal

### 2. Configurar SMTP

Adicione as configurações no Supabase:

```sql
-- Configurações de email
INSERT INTO app_settings (key, value) VALUES 
('smtp_host', 'smtp.sendgrid.net'),
('smtp_port', '587'),
('smtp_user', 'apikey'),
('smtp_password', 'sua-api-key-sendgrid');
```

## 📱 Configuração do WhatsApp

### 1. WhatsApp Business API

1. Registre-se no WhatsApp Business
2. Obtenha token de acesso
3. Configure webhook para notificações

### 2. Integração

Atualize as configurações da API no arquivo `api-functions.js`

## 📊 Configuração do Analytics

### 1. Google Analytics 4

1. Crie propriedade GA4
2. Obtenha Measurement ID
3. Configure eventos personalizados:
   - photo_view
   - photo_purchase
   - user_registration
   - subscription_created

### 2. Google Tag Manager (Opcional)

1. Crie container GTM
2. Configure tags para eventos
3. Adicione código GTM no HTML

## 🔐 Configurações de Segurança

### 1. SSL/TLS

- Certifique-se de que HTTPS está habilitado
- Configure redirecionamento HTTP → HTTPS

### 2. CORS

Configure CORS no Supabase para permitir seu domínio:

```sql
-- Configurar CORS
UPDATE auth.config SET 
site_url = 'https://fotos63.com',
additional_redirect_urls = 'https://fotos63.com/auth/callback';
```

### 3. Rate Limiting

Configure rate limiting nas Edge Functions do Supabase

## 🧪 Testes

### 1. Executar Suite de Testes

```bash
node test-suite.js
```

### 2. Testes Manuais

1. **Autenticação**
   - Registro de usuário
   - Login/logout
   - Recuperação de senha

2. **Upload de Fotos**
   - Upload individual
   - Upload em lote
   - Processamento de marca d'água

3. **Pagamentos**
   - Compra individual
   - Compra em lote
   - Assinatura premium

4. **Eventos**
   - Criação de evento
   - Mapeamento de fotos
   - Exportação de dados

## 📈 Monitoramento

### 1. Logs

- Configure logs no Supabase
- Monitor erros em tempo real
- Configure alertas para falhas críticas

### 2. Performance

- Monitor tempo de resposta das APIs
- Acompanhe uso de storage
- Monitor taxa de conversão

### 3. Uptime

- Configure monitoramento de uptime
- Alertas para indisponibilidade
- Status page para usuários

## 🔄 Backup e Recuperação

### 1. Backup do Banco

```sql
-- Configurar backup automático no Supabase
-- Frequência: Diária
-- Retenção: 30 dias
```

### 2. Backup de Storage

- Configure backup automático dos arquivos
- Replicação em múltiplas regiões

## 📱 Configuração Mobile

### 1. PWA

- Manifest configurado
- Service Worker implementado
- Instalação offline disponível

### 2. Responsividade

- Testado em dispositivos móveis
- Touch-friendly interface
- Performance otimizada

## 🚀 Deploy em Produção

### 1. Checklist Pré-Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados configurado
- [ ] Storage configurado
- [ ] Pagamentos testados
- [ ] Emails funcionando
- [ ] Analytics configurado
- [ ] SSL habilitado
- [ ] Testes passando
- [ ] Backup configurado

### 2. Deploy

1. **Frontend**: Deploy via Vercel/Netlify
2. **Backend**: Edge Functions no Supabase
3. **Banco**: Já configurado no Supabase

### 3. Pós-Deploy

1. Teste todas as funcionalidades
2. Configure monitoramento
3. Documente URLs e credenciais
4. Treine equipe de suporte

## 🛠️ Manutenção

### 1. Atualizações

- Atualize dependências regularmente
- Monitor vulnerabilidades de segurança
- Teste atualizações em ambiente de staging

### 2. Otimização

- Monitor performance
- Otimize consultas lentas
- Comprima imagens automaticamente

### 3. Suporte

- Configure sistema de tickets
- Documente problemas comuns
- Mantenha FAQ atualizado

## 📞 Suporte

Para suporte técnico:
- **Email**: dev@fotos63.com
- **Documentação**: https://docs.fotos63.com
- **Status**: https://status.fotos63.com

## 📄 Licença

Este projeto está licenciado sob os termos da licença MIT.

---

**Desenvolvido por MtsFerreira**  
*Marketplace de Fotos do Tocantins*

