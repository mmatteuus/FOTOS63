# Fotos63 - Marketplace de Fotos do Tocantins

## 📸 Sobre o Projeto

O **Fotos63** é uma aplicação SaaS completa que funciona como marketplace de fotos, conectando fotógrafos talentosos com clientes que buscam imagens profissionais de qualidade. A plataforma foi desenvolvida especialmente para o estado do Tocantins, utilizando uma paleta de cores inspirada no sol tocantinense.

## 🎨 Design e Identidade Visual

- **Paleta de Cores**: Amarelo (#FFD700) e Laranja (#FF8C00) inspirados no sol do Tocantins
- **Tipografia**: Poppins (Google Fonts)
- **Estilo**: Minimalista, moderno e responsivo
- **Framework CSS**: Bootstrap 5

## 🚀 Funcionalidades Principais

### Para Fotógrafos
- ✅ Cadastro e autenticação segura
- ✅ Dashboard completo com estatísticas
- ✅ Upload de fotos com marca d'água automática
- ✅ Gerenciamento de portfólio
- ✅ Sistema de precificação flexível
- ✅ Relatórios de vendas e ganhos
- ✅ Integração com Instagram para importação
- ✅ Notificações via WhatsApp

### Para Clientes
- ✅ Navegação e busca avançada
- ✅ Categorização por tipo de foto
- ✅ Carrinho de compras
- ✅ Múltiplas formas de pagamento
- ✅ Download de fotos em alta resolução
- ✅ Histórico de compras

### Sistema de Pagamentos
- ✅ Cartão de Crédito (Stripe/PagSeguro)
- ✅ PIX instantâneo
- ✅ Boleto bancário
- ✅ Parcelamento sem juros
- ✅ Sistema de comissões automático

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilização avançada com gradientes e animações
- **JavaScript ES6+** - Interatividade e funcionalidades
- **Bootstrap 5** - Framework CSS responsivo
- **Chart.js** - Gráficos e visualizações

### Backend e Banco de Dados
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados relacional
- **Supabase Auth** - Autenticação e autorização
- **Supabase Storage** - Armazenamento de arquivos

### Integrações
- **Stripe** - Processamento de pagamentos internacionais
- **PagSeguro** - Pagamentos nacionais (PIX, Boleto, Cartão)
- **WhatsApp Business API** - Notificações
- **Instagram Basic Display API** - Importação de fotos
- **Google Analytics 4** - Análise de dados

## 📁 Estrutura do Projeto

```
fotos63/
├── index.html              # Página principal (landing page)
├── auth.html               # Página de login/registro
├── dashboard.html          # Dashboard para fotógrafos
├── checkout.html           # Página de finalização de compra
├── supabase-config.js      # Configuração do Supabase
├── supabase-schema.sql     # Esquema do banco de dados
├── storage-policies.sql    # Políticas de storage
├── api-functions.js        # Funções de API e lógica de negócio
├── watermark-processor.js  # Processador de marca d'água
├── payment-integration.js  # Integração com gateways de pagamento
└── README.md              # Documentação do projeto
```

## 🗄️ Banco de Dados

### Tabelas Principais

#### users
- `id` (UUID, PK)
- `email` (VARCHAR, UNIQUE)
- `name` (VARCHAR)
- `role` (ENUM: 'cliente', 'fotografo', 'admin')
- `phone` (VARCHAR)
- `cpf` (VARCHAR)
- `avatar_url` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### photographers
- `id` (UUID, PK, FK users.id)
- `bio` (TEXT)
- `portfolio_url` (TEXT)
- `instagram_handle` (VARCHAR)
- `tier` (ENUM: 'basic', 'premium', 'pro')
- `commission_rate` (DECIMAL)
- `total_sales` (INTEGER)
- `total_earnings` (DECIMAL)

#### photos
- `id` (UUID, PK)
- `photographer_id` (UUID, FK photographers.id)
- `title` (VARCHAR)
- `description` (TEXT)
- `category` (VARCHAR)
- `tags` (TEXT[])
- `price` (DECIMAL)
- `file_url` (TEXT)
- `watermark_url` (TEXT)
- `thumbnail_url` (TEXT)
- `views` (INTEGER)
- `downloads` (INTEGER)
- `status` (ENUM: 'pending', 'approved', 'rejected')
- `created_at` (TIMESTAMP)

#### orders
- `id` (UUID, PK)
- `customer_id` (UUID, FK users.id)
- `total_amount` (DECIMAL)
- `status` (ENUM: 'pending', 'paid', 'cancelled')
- `payment_method` (VARCHAR)
- `payment_id` (VARCHAR)
- `created_at` (TIMESTAMP)

#### order_items
- `id` (UUID, PK)
- `order_id` (UUID, FK orders.id)
- `photo_id` (UUID, FK photos.id)
- `price` (DECIMAL)
- `photographer_earning` (DECIMAL)
- `commission` (DECIMAL)

## 🔧 Configuração e Instalação

### 1. Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Execute o script `supabase-schema.sql` no SQL Editor
4. Configure as políticas de storage com `storage-policies.sql`
5. Obtenha as chaves de API (URL e anon key)

### 2. Configuração das Integrações

#### Stripe
```javascript
// Em supabase-config.js
const STRIPE_PUBLIC_KEY = 'pk_test_...';
```

#### PagSeguro
```javascript
// Em supabase-config.js
const PAGSEGURO_EMAIL = 'seu@email.com';
const PAGSEGURO_TOKEN = 'seu_token_aqui';
```

#### Google Analytics
```javascript
// Em payment-integration.js
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';
```

### 3. Configuração do Ambiente

1. Clone ou baixe os arquivos do projeto
2. Configure as variáveis de ambiente em `supabase-config.js`
3. Abra `index.html` em um servidor web local
4. Teste todas as funcionalidades

## 🎯 Fluxos de Uso

### Fluxo do Fotógrafo
1. **Cadastro**: Registro como fotógrafo
2. **Verificação**: Aprovação da conta (manual/automática)
3. **Upload**: Envio de fotos com metadados
4. **Processamento**: Aplicação automática de marca d'água
5. **Publicação**: Fotos disponibilizadas no marketplace
6. **Vendas**: Notificações de vendas via WhatsApp
7. **Ganhos**: Acompanhamento no dashboard
8. **Saque**: Transferência dos ganhos

### Fluxo do Cliente
1. **Navegação**: Exploração do catálogo de fotos
2. **Busca**: Filtros por categoria, preço, fotógrafo
3. **Seleção**: Adição de fotos ao carrinho
4. **Checkout**: Escolha do método de pagamento
5. **Pagamento**: Processamento seguro
6. **Download**: Acesso às fotos em alta resolução
7. **Histórico**: Acompanhamento de compras

## 💰 Sistema de Comissões

- **Básico**: 15% de comissão
- **Premium**: 10% de comissão
- **Pro**: 5% de comissão

### Cálculo Automático
```javascript
function calculateCommission(amount, tier) {
    const rates = { basic: 0.15, premium: 0.10, pro: 0.05 };
    const commission = amount * rates[tier];
    return {
        commission,
        photographerEarning: amount - commission
    };
}
```

## 📊 Analytics e Métricas

### Eventos Rastreados (GA4)
- Visualizações de fotos
- Adições ao carrinho
- Compras realizadas
- Cadastros de usuários
- Uploads de fotos
- Saques de ganhos

### Métricas do Dashboard
- Total de fotos publicadas
- Vendas realizadas
- Visualizações recebidas
- Ganhos totais
- Performance mensal

## 🔒 Segurança

### Autenticação
- JWT tokens via Supabase Auth
- Verificação de email obrigatória
- Políticas de senha segura

### Autorização
- Row Level Security (RLS) no Supabase
- Políticas baseadas em roles
- Acesso controlado aos recursos

### Pagamentos
- Criptografia SSL/TLS
- Tokenização de cartões
- Compliance PCI DSS

## 📱 Responsividade

O projeto foi desenvolvido com abordagem **mobile-first**:

- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado com navegação otimizada
- **Mobile**: Interface touch-friendly com menu colapsável

### Breakpoints
- `xs`: < 576px
- `sm`: ≥ 576px
- `md`: ≥ 768px
- `lg`: ≥ 992px
- `xl`: ≥ 1200px

## 🚀 Performance

### Otimizações Implementadas
- Lazy loading de imagens
- Compressão automática de fotos
- CDN para assets estáticos
- Minificação de CSS/JS
- Cache de consultas do Supabase

### Métricas Alvo
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 🧪 Testes

### Testes Funcionais
- ✅ Cadastro e login de usuários
- ✅ Upload e processamento de fotos
- ✅ Fluxo de compra completo
- ✅ Processamento de pagamentos
- ✅ Notificações WhatsApp
- ✅ Integração Instagram

### Testes de Responsividade
- ✅ iPhone (375px)
- ✅ iPad (768px)
- ✅ Desktop (1920px)
- ✅ Orientação portrait/landscape

### Testes de Performance
- ✅ Google PageSpeed Insights
- ✅ GTmetrix
- ✅ WebPageTest
- ✅ Lighthouse

## 📈 Roadmap Futuro

### Versão 2.0
- [ ] App mobile nativo (React Native)
- [ ] Sistema de assinatura para fotógrafos
- [ ] Marketplace de presets/filtros
- [ ] Integração com redes sociais (Facebook, TikTok)
- [ ] Sistema de avaliações e comentários

### Versão 3.0
- [ ] Inteligência artificial para categorização
- [ ] Reconhecimento facial automático
- [ ] Sistema de licenciamento avançado
- [ ] Marketplace internacional
- [ ] API pública para desenvolvedores

## 🤝 Contribuição

### Como Contribuir
1. Fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Padrões de Código
- **JavaScript**: ES6+ com async/await
- **CSS**: BEM methodology
- **HTML**: Semântico e acessível
- **Commits**: Conventional Commits

## 📞 Suporte

### Contato
- **Email**: suporte@fotos63.com.br
- **WhatsApp**: (63) 99999-9999
- **Site**: https://fotos63.com.br

### Documentação Técnica
- [Supabase Docs](https://supabase.com/docs)
- [Bootstrap Docs](https://getbootstrap.com/docs/5.3/)
- [Stripe API](https://stripe.com/docs/api)
- [PagSeguro API](https://dev.pagseguro.uol.com.br/)

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Desenvolvido por

**MtsFerreira** - Desenvolvedor Full Stack

---

*Fotos63 - Conectando fotógrafos talentosos com clientes que buscam qualidade* 📸✨

