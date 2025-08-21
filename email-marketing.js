// Email Marketing System for Fotos63
// Sistema Completo de E-mail Marketing Integrado

class EmailMarketingSystem {
    constructor() {
        this.campaigns = [];
        this.templates = [];
        this.subscribers = [];
        this.segments = [];
        this.automations = [];
        this.analytics = {};
        this.initializeSystem();
    }

    initializeSystem() {
        this.loadCampaigns();
        this.loadTemplates();
        this.loadSubscribers();
        this.loadSegments();
        this.setupEmailProviders();
    }

    // Setup email providers (SendGrid, Mailgun, etc.)
    setupEmailProviders() {
        this.emailProviders = {
            sendgrid: {
                name: 'SendGrid',
                apiKey: process.env.SENDGRID_API_KEY,
                endpoint: 'https://api.sendgrid.com/v3/mail/send'
            },
            mailgun: {
                name: 'Mailgun',
                apiKey: process.env.MAILGUN_API_KEY,
                domain: process.env.MAILGUN_DOMAIN
            },
            ses: {
                name: 'Amazon SES',
                accessKey: process.env.AWS_ACCESS_KEY,
                secretKey: process.env.AWS_SECRET_KEY,
                region: process.env.AWS_REGION
            }
        };
    }

    // Create email marketing interface
    createEmailMarketingInterface(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = `
            <div class="email-marketing">
                <div class="email-header">
                    <h3><i class="bi bi-envelope-heart"></i> E-mail Marketing</h3>
                    <div class="header-actions">
                        <button class="btn btn-outline-primary" onclick="showTemplateLibrary()">
                            <i class="bi bi-collection"></i> Templates
                        </button>
                        <button class="btn btn-primary" onclick="createNewCampaign()">
                            <i class="bi bi-plus-circle"></i> Nova Campanha
                        </button>
                    </div>
                </div>

                <!-- Email Marketing Stats -->
                <div class="email-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-people"></i>
                        </div>
                        <div class="stat-info">
                            <h4 id="totalSubscribers">0</h4>
                            <p>Assinantes</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-send"></i>
                        </div>
                        <div class="stat-info">
                            <h4 id="emailsSent">0</h4>
                            <p>E-mails Enviados</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-eye"></i>
                        </div>
                        <div class="stat-info">
                            <h4 id="openRate">0%</h4>
                            <p>Taxa de Abertura</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-cursor"></i>
                        </div>
                        <div class="stat-info">
                            <h4 id="clickRate">0%</h4>
                            <p>Taxa de Clique</p>
                        </div>
                    </div>
                </div>

                <!-- Campaign Tabs -->
                <div class="campaign-tabs">
                    <button class="tab-btn active" data-tab="campaigns">Campanhas</button>
                    <button class="tab-btn" data-tab="automations">Automações</button>
                    <button class="tab-btn" data-tab="segments">Segmentos</button>
                    <button class="tab-btn" data-tab="analytics">Analytics</button>
                </div>

                <!-- Campaigns Tab -->
                <div class="tab-content active" id="campaigns-tab">
                    <div class="campaign-filters">
                        <select class="form-control" id="campaignStatusFilter">
                            <option value="all">Todos os Status</option>
                            <option value="draft">Rascunho</option>
                            <option value="scheduled">Agendada</option>
                            <option value="sending">Enviando</option>
                            <option value="sent">Enviada</option>
                            <option value="paused">Pausada</option>
                        </select>
                        <input type="text" class="form-control" id="campaignSearch" placeholder="Buscar campanhas...">
                    </div>

                    <div class="campaigns-list" id="campaignsList">
                        <!-- Campaigns will be loaded here -->
                    </div>
                </div>

                <!-- Automations Tab -->
                <div class="tab-content" id="automations-tab">
                    <div class="automations-header">
                        <h4>Automações de E-mail</h4>
                        <button class="btn btn-primary" onclick="createAutomation()">
                            <i class="bi bi-gear"></i> Nova Automação
                        </button>
                    </div>

                    <div class="automation-templates">
                        <div class="template-grid">
                            <div class="automation-template" onclick="createWelcomeAutomation()">
                                <i class="bi bi-hand-thumbs-up"></i>
                                <h5>Boas-vindas</h5>
                                <p>Sequência de boas-vindas para novos usuários</p>
                            </div>
                            <div class="automation-template" onclick="createEventAutomation()">
                                <i class="bi bi-calendar-event"></i>
                                <h5>Eventos</h5>
                                <p>Notificações automáticas de eventos</p>
                            </div>
                            <div class="automation-template" onclick="createPhotoAutomation()">
                                <i class="bi bi-camera"></i>
                                <h5>Fotos Disponíveis</h5>
                                <p>Avisos quando fotos estão disponíveis</p>
                            </div>
                            <div class="automation-template" onclick="createRetentionAutomation()">
                                <i class="bi bi-arrow-repeat"></i>
                                <h5>Retenção</h5>
                                <p>Campanhas para reativar usuários inativos</p>
                            </div>
                        </div>
                    </div>

                    <div class="active-automations" id="activeAutomations">
                        <!-- Active automations will be shown here -->
                    </div>
                </div>

                <!-- Segments Tab -->
                <div class="tab-content" id="segments-tab">
                    <div class="segments-header">
                        <h4>Segmentação de Audiência</h4>
                        <button class="btn btn-primary" onclick="createSegment()">
                            <i class="bi bi-funnel"></i> Novo Segmento
                        </button>
                    </div>

                    <div class="segments-list" id="segmentsList">
                        <!-- Segments will be loaded here -->
                    </div>
                </div>

                <!-- Analytics Tab -->
                <div class="tab-content" id="analytics-tab">
                    <div class="analytics-dashboard">
                        <div class="analytics-header">
                            <h4>Analytics de E-mail Marketing</h4>
                            <div class="date-range-picker">
                                <input type="date" id="analyticsStartDate" class="form-control">
                                <input type="date" id="analyticsEndDate" class="form-control">
                                <button class="btn btn-outline-primary" onclick="updateAnalytics()">Atualizar</button>
                            </div>
                        </div>

                        <div class="analytics-charts">
                            <div class="chart-container">
                                <canvas id="emailPerformanceChart"></canvas>
                            </div>
                            <div class="chart-container">
                                <canvas id="subscriberGrowthChart"></canvas>
                            </div>
                        </div>

                        <div class="analytics-details">
                            <div class="detail-card">
                                <h5>Top Campanhas</h5>
                                <div id="topCampaigns">
                                    <!-- Top campaigns will be shown here -->
                                </div>
                            </div>
                            <div class="detail-card">
                                <h5>Segmentos Mais Engajados</h5>
                                <div id="topSegments">
                                    <!-- Top segments will be shown here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Campaign Builder Modal -->
                <div class="modal fade" id="campaignBuilderModal" tabindex="-1">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Criar Campanha de E-mail</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="campaign-builder">
                                    <!-- Campaign builder steps -->
                                    <div class="builder-steps">
                                        <div class="step active" data-step="1">
                                            <span class="step-number">1</span>
                                            <span class="step-title">Configuração</span>
                                        </div>
                                        <div class="step" data-step="2">
                                            <span class="step-number">2</span>
                                            <span class="step-title">Audiência</span>
                                        </div>
                                        <div class="step" data-step="3">
                                            <span class="step-number">3</span>
                                            <span class="step-title">Conteúdo</span>
                                        </div>
                                        <div class="step" data-step="4">
                                            <span class="step-number">4</span>
                                            <span class="step-title">Revisão</span>
                                        </div>
                                    </div>

                                    <!-- Step 1: Configuration -->
                                    <div class="builder-step active" id="step-1">
                                        <h5>Configuração da Campanha</h5>
                                        <div class="row">
                                            <div class="col-md-8">
                                                <div class="form-group">
                                                    <label>Nome da Campanha</label>
                                                    <input type="text" class="form-control" id="campaignName" placeholder="Ex: Promoção de Verão 2024">
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label>Tipo de Campanha</label>
                                                    <select class="form-control" id="campaignType">
                                                        <option value="promotional">Promocional</option>
                                                        <option value="newsletter">Newsletter</option>
                                                        <option value="event">Evento</option>
                                                        <option value="announcement">Anúncio</option>
                                                        <option value="educational">Educacional</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Assunto do E-mail</label>
                                                    <input type="text" class="form-control" id="emailSubject" placeholder="Assunto atrativo para o e-mail">
                                                    <small class="text-muted">Dica: Use emojis e personalização para aumentar a taxa de abertura</small>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Nome do Remetente</label>
                                                    <input type="text" class="form-control" id="senderName" value="Fotos63" placeholder="Nome que aparecerá como remetente">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label>Texto de Prévia</label>
                                            <input type="text" class="form-control" id="previewText" placeholder="Texto que aparece na prévia do e-mail">
                                        </div>

                                        <div class="scheduling-options">
                                            <h6>Agendamento</h6>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="sendOption" id="sendNow" value="now" checked>
                                                <label class="form-check-label" for="sendNow">Enviar Agora</label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="sendOption" id="sendLater" value="later">
                                                <label class="form-check-label" for="sendLater">Agendar Envio</label>
                                            </div>
                                            <div class="schedule-datetime" id="scheduleDateTime" style="display: none;">
                                                <input type="datetime-local" class="form-control" id="scheduledTime">
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Step 2: Audience -->
                                    <div class="builder-step" id="step-2">
                                        <h5>Selecionar Audiência</h5>
                                        <div class="audience-options">
                                            <div class="audience-option">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="audienceType" id="allSubscribers" value="all" checked>
                                                    <label class="form-check-label" for="allSubscribers">
                                                        <strong>Todos os Assinantes</strong>
                                                        <span class="subscriber-count" id="allSubscribersCount">0 pessoas</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div class="audience-option">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="audienceType" id="segments" value="segments">
                                                    <label class="form-check-label" for="segments">
                                                        <strong>Segmentos Específicos</strong>
                                                        <span>Enviar para grupos segmentados</span>
                                                    </label>
                                                </div>
                                                <div class="segments-selection" id="segmentsSelection" style="display: none;">
                                                    <!-- Segments will be loaded here -->
                                                </div>
                                            </div>

                                            <div class="audience-option">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="audienceType" id="custom" value="custom">
                                                    <label class="form-check-label" for="custom">
                                                        <strong>Seleção Personalizada</strong>
                                                        <span>Criar filtros personalizados</span>
                                                    </label>
                                                </div>
                                                <div class="custom-filters" id="customFilters" style="display: none;">
                                                    <!-- Custom filters will be added here -->
                                                </div>
                                            </div>
                                        </div>

                                        <div class="audience-preview">
                                            <h6>Prévia da Audiência</h6>
                                            <div class="preview-stats">
                                                <span class="stat">Total: <strong id="audienceTotal">0</strong></span>
                                                <span class="stat">Fotógrafos: <strong id="audiencePhotographers">0</strong></span>
                                                <span class="stat">Clientes: <strong id="audienceClients">0</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Step 3: Content -->
                                    <div class="builder-step" id="step-3">
                                        <h5>Criar Conteúdo</h5>
                                        <div class="content-options">
                                            <div class="template-selector">
                                                <h6>Escolher Template</h6>
                                                <div class="template-grid" id="templateGrid">
                                                    <!-- Templates will be loaded here -->
                                                </div>
                                            </div>

                                            <div class="email-editor">
                                                <div class="editor-toolbar">
                                                    <button class="btn btn-sm btn-outline-secondary" onclick="insertPersonalization()">
                                                        <i class="bi bi-person"></i> Personalizar
                                                    </button>
                                                    <button class="btn btn-sm btn-outline-secondary" onclick="insertImage()">
                                                        <i class="bi bi-image"></i> Imagem
                                                    </button>
                                                    <button class="btn btn-sm btn-outline-secondary" onclick="insertButton()">
                                                        <i class="bi bi-square"></i> Botão
                                                    </button>
                                                </div>
                                                <div class="editor-content">
                                                    <textarea id="emailContent" class="form-control" rows="15" placeholder="Conteúdo do e-mail..."></textarea>
                                                </div>
                                            </div>

                                            <div class="email-preview">
                                                <h6>Prévia do E-mail</h6>
                                                <div class="preview-container" id="emailPreview">
                                                    <!-- Email preview will be shown here -->
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Step 4: Review -->
                                    <div class="builder-step" id="step-4">
                                        <h5>Revisão Final</h5>
                                        <div class="campaign-summary">
                                            <div class="summary-section">
                                                <h6>Configuração</h6>
                                                <p><strong>Nome:</strong> <span id="summaryName">-</span></p>
                                                <p><strong>Assunto:</strong> <span id="summarySubject">-</span></p>
                                                <p><strong>Tipo:</strong> <span id="summaryType">-</span></p>
                                                <p><strong>Agendamento:</strong> <span id="summarySchedule">-</span></p>
                                            </div>

                                            <div class="summary-section">
                                                <h6>Audiência</h6>
                                                <p><strong>Total de Destinatários:</strong> <span id="summaryAudience">0</span></p>
                                                <p><strong>Tipo de Seleção:</strong> <span id="summaryAudienceType">-</span></p>
                                            </div>

                                            <div class="summary-section">
                                                <h6>Estimativas</h6>
                                                <p><strong>Taxa de Abertura Esperada:</strong> <span id="expectedOpenRate">25%</span></p>
                                                <p><strong>Taxa de Clique Esperada:</strong> <span id="expectedClickRate">3%</span></p>
                                                <p><strong>Custo Estimado:</strong> <span id="estimatedCost">R$ 0,00</span></p>
                                            </div>
                                        </div>

                                        <div class="test-email">
                                            <h6>Enviar E-mail de Teste</h6>
                                            <div class="input-group">
                                                <input type="email" class="form-control" id="testEmail" placeholder="seu@email.com">
                                                <button class="btn btn-outline-primary" onclick="sendTestEmail()">
                                                    <i class="bi bi-send"></i> Enviar Teste
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" id="prevStepBtn" onclick="previousStep()" style="display: none;">
                                    <i class="bi bi-arrow-left"></i> Anterior
                                </button>
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" id="nextStepBtn" onclick="nextStep()">
                                    Próximo <i class="bi bi-arrow-right"></i>
                                </button>
                                <button type="button" class="btn btn-success" id="launchCampaignBtn" onclick="launchCampaign()" style="display: none;">
                                    <i class="bi bi-rocket"></i> Lançar Campanha
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEmailMarketingEvents();
        this.loadEmailMarketingData();
    }

    // Setup event listeners
    setupEmailMarketingEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Send option change
        document.querySelectorAll('input[name="sendOption"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const scheduleDiv = document.getElementById('scheduleDateTime');
                scheduleDiv.style.display = e.target.value === 'later' ? 'block' : 'none';
            });
        });

        // Audience type change
        document.querySelectorAll('input[name="audienceType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleAudienceTypeChange(e.target.value);
            });
        });

        // Email content change
        document.getElementById('emailContent').addEventListener('input', () => {
            this.updateEmailPreview();
        });

        // Campaign filters
        document.getElementById('campaignStatusFilter').addEventListener('change', () => {
            this.filterCampaigns();
        });

        document.getElementById('campaignSearch').addEventListener('input', () => {
            this.filterCampaigns();
        });
    }

    // Load email marketing data
    async loadEmailMarketingData() {
        await Promise.all([
            this.loadCampaigns(),
            this.loadTemplates(),
            this.loadSubscribers(),
            this.loadSegments(),
            this.loadAnalytics()
        ]);

        this.updateEmailStats();
        this.loadCampaignsUI();
    }

    // Load campaigns
    async loadCampaigns() {
        try {
            const response = await fetch('/api/email/campaigns', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                this.campaigns = await response.json();
            }
        } catch (error) {
            console.error('Error loading campaigns:', error);
        }
    }

    // Load email templates
    async loadTemplates() {
        try {
            const response = await fetch('/api/email/templates');
            if (response.ok) {
                this.templates = await response.json();
            }
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    }

    // Load subscribers
    async loadSubscribers() {
        try {
            const response = await fetch('/api/email/subscribers', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                this.subscribers = await response.json();
            }
        } catch (error) {
            console.error('Error loading subscribers:', error);
        }
    }

    // Load segments
    async loadSegments() {
        try {
            const response = await fetch('/api/email/segments', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                this.segments = await response.json();
            }
        } catch (error) {
            console.error('Error loading segments:', error);
        }
    }

    // Load analytics
    async loadAnalytics() {
        try {
            const response = await fetch('/api/email/analytics', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                this.analytics = await response.json();
            }
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }

    // Update email stats
    updateEmailStats() {
        document.getElementById('totalSubscribers').textContent = this.subscribers.length;
        document.getElementById('emailsSent').textContent = this.analytics.total_sent || 0;
        document.getElementById('openRate').textContent = `${(this.analytics.open_rate || 0).toFixed(1)}%`;
        document.getElementById('clickRate').textContent = `${(this.analytics.click_rate || 0).toFixed(1)}%`;
    }

    // Switch tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Load tab-specific content
        this.loadTabContent(tabName);
    }

    // Load tab content
    loadTabContent(tabName) {
        switch (tabName) {
            case 'campaigns':
                this.loadCampaignsUI();
                break;
            case 'automations':
                this.loadAutomationsUI();
                break;
            case 'segments':
                this.loadSegmentsUI();
                break;
            case 'analytics':
                this.loadAnalyticsUI();
                break;
        }
    }

    // Load campaigns UI
    loadCampaignsUI() {
        const campaignsList = document.getElementById('campaignsList');
        if (!campaignsList) return;

        if (this.campaigns.length === 0) {
            campaignsList.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-envelope-x"></i>
                    <h4>Nenhuma campanha criada</h4>
                    <p>Crie sua primeira campanha de e-mail marketing</p>
                    <button class="btn btn-primary" onclick="createNewCampaign()">
                        <i class="bi bi-plus-circle"></i> Criar Primeira Campanha
                    </button>
                </div>
            `;
            return;
        }

        campaignsList.innerHTML = this.campaigns.map(campaign => `
            <div class="campaign-card" data-campaign-id="${campaign.id}">
                <div class="campaign-header">
                    <div class="campaign-info">
                        <h5>${campaign.name}</h5>
                        <p class="campaign-subject">${campaign.subject}</p>
                    </div>
                    <div class="campaign-status">
                        <span class="badge bg-${this.getCampaignStatusColor(campaign.status)}">${campaign.status}</span>
                    </div>
                </div>

                <div class="campaign-stats">
                    <div class="stat">
                        <span class="stat-value">${campaign.recipients || 0}</span>
                        <span class="stat-label">Destinatários</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${(campaign.open_rate || 0).toFixed(1)}%</span>
                        <span class="stat-label">Abertura</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${(campaign.click_rate || 0).toFixed(1)}%</span>
                        <span class="stat-label">Clique</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${campaign.conversions || 0}</span>
                        <span class="stat-label">Conversões</span>
                    </div>
                </div>

                <div class="campaign-details">
                    <span><i class="bi bi-calendar"></i> ${this.formatDate(campaign.created_at)}</span>
                    <span><i class="bi bi-people"></i> ${this.getCampaignAudienceType(campaign.audience_type)}</span>
                    <span><i class="bi bi-tag"></i> ${campaign.type}</span>
                </div>

                <div class="campaign-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewCampaignReport('${campaign.id}')">
                        <i class="bi bi-graph-up"></i> Relatório
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="duplicateCampaign('${campaign.id}')">
                        <i class="bi bi-files"></i> Duplicar
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="editCampaign('${campaign.id}')">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Get campaign status color
    getCampaignStatusColor(status) {
        const colors = {
            draft: 'secondary',
            scheduled: 'warning',
            sending: 'info',
            sent: 'success',
            paused: 'danger'
        };
        return colors[status] || 'secondary';
    }

    // Get campaign audience type display
    getCampaignAudienceType(type) {
        const types = {
            all: 'Todos',
            segments: 'Segmentos',
            custom: 'Personalizado'
        };
        return types[type] || type;
    }

    // Create new campaign
    createNewCampaign() {
        const modal = new bootstrap.Modal(document.getElementById('campaignBuilderModal'));
        modal.show();
        
        this.currentStep = 1;
        this.resetCampaignBuilder();
        this.loadTemplatesForBuilder();
        this.loadSegmentsForBuilder();
    }

    // Reset campaign builder
    resetCampaignBuilder() {
        // Reset form fields
        document.getElementById('campaignName').value = '';
        document.getElementById('emailSubject').value = '';
        document.getElementById('previewText').value = '';
        document.getElementById('emailContent').value = '';
        
        // Reset steps
        document.querySelectorAll('.builder-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById('step-1').classList.add('active');
        
        // Reset step indicators
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector('[data-step="1"]').classList.add('active');
        
        // Reset buttons
        document.getElementById('prevStepBtn').style.display = 'none';
        document.getElementById('nextStepBtn').style.display = 'inline-block';
        document.getElementById('launchCampaignBtn').style.display = 'none';
    }

    // Navigate to next step
    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.showStep(this.currentStep);
        }
    }

    // Navigate to previous step
    previousStep() {
        this.currentStep--;
        this.showStep(this.currentStep);
    }

    // Show specific step
    showStep(stepNumber) {
        // Update step indicators
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`[data-step="${stepNumber}"]`).classList.add('active');

        // Update step content
        document.querySelectorAll('.builder-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(`step-${stepNumber}`).classList.add('active');

        // Update buttons
        document.getElementById('prevStepBtn').style.display = stepNumber > 1 ? 'inline-block' : 'none';
        document.getElementById('nextStepBtn').style.display = stepNumber < 4 ? 'inline-block' : 'none';
        document.getElementById('launchCampaignBtn').style.display = stepNumber === 4 ? 'inline-block' : 'none';

        // Load step-specific content
        this.loadStepContent(stepNumber);
    }

    // Load step content
    loadStepContent(stepNumber) {
        switch (stepNumber) {
            case 2:
                this.updateAudiencePreview();
                break;
            case 3:
                this.updateEmailPreview();
                break;
            case 4:
                this.updateCampaignSummary();
                break;
        }
    }

    // Validate current step
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateStep1();
            case 2:
                return this.validateStep2();
            case 3:
                return this.validateStep3();
            default:
                return true;
        }
    }

    // Validate step 1
    validateStep1() {
        const name = document.getElementById('campaignName').value;
        const subject = document.getElementById('emailSubject').value;

        if (!name.trim()) {
            alert('Por favor, digite o nome da campanha');
            return false;
        }

        if (!subject.trim()) {
            alert('Por favor, digite o assunto do e-mail');
            return false;
        }

        return true;
    }

    // Validate step 2
    validateStep2() {
        const audienceType = document.querySelector('input[name="audienceType"]:checked').value;
        
        if (audienceType === 'segments') {
            const selectedSegments = document.querySelectorAll('input[name="selectedSegments"]:checked');
            if (selectedSegments.length === 0) {
                alert('Por favor, selecione pelo menos um segmento');
                return false;
            }
        }

        return true;
    }

    // Validate step 3
    validateStep3() {
        const content = document.getElementById('emailContent').value;

        if (!content.trim()) {
            alert('Por favor, adicione conteúdo ao e-mail');
            return false;
        }

        return true;
    }

    // Handle audience type change
    handleAudienceTypeChange(type) {
        // Hide all selection divs
        document.getElementById('segmentsSelection').style.display = 'none';
        document.getElementById('customFilters').style.display = 'none';

        // Show relevant selection div
        if (type === 'segments') {
            document.getElementById('segmentsSelection').style.display = 'block';
        } else if (type === 'custom') {
            document.getElementById('customFilters').style.display = 'block';
        }

        this.updateAudiencePreview();
    }

    // Update audience preview
    updateAudiencePreview() {
        const audienceType = document.querySelector('input[name="audienceType"]:checked')?.value;
        let total = 0, photographers = 0, clients = 0;

        switch (audienceType) {
            case 'all':
                total = this.subscribers.length;
                photographers = this.subscribers.filter(s => s.type === 'photographer').length;
                clients = this.subscribers.filter(s => s.type === 'client').length;
                break;
            case 'segments':
                // Calculate based on selected segments
                const selectedSegments = document.querySelectorAll('input[name="selectedSegments"]:checked');
                selectedSegments.forEach(checkbox => {
                    const segment = this.segments.find(s => s.id === checkbox.value);
                    if (segment) {
                        total += segment.subscriber_count;
                        photographers += segment.photographer_count || 0;
                        clients += segment.client_count || 0;
                    }
                });
                break;
        }

        document.getElementById('audienceTotal').textContent = total;
        document.getElementById('audiencePhotographers').textContent = photographers;
        document.getElementById('audienceClients').textContent = clients;
    }

    // Update email preview
    updateEmailPreview() {
        const content = document.getElementById('emailContent').value;
        const subject = document.getElementById('emailSubject').value;
        const senderName = document.getElementById('senderName').value;

        const previewHTML = `
            <div class="email-preview-container">
                <div class="email-header">
                    <strong>De:</strong> ${senderName || 'Fotos63'}<br>
                    <strong>Assunto:</strong> ${subject || 'Sem assunto'}
                </div>
                <div class="email-body">
                    ${this.processEmailContent(content)}
                </div>
            </div>
        `;

        document.getElementById('emailPreview').innerHTML = previewHTML;
    }

    // Process email content (convert markdown-like syntax to HTML)
    processEmailContent(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/{{name}}/g, '<span class="personalization">Nome do Cliente</span>')
            .replace(/{{email}}/g, '<span class="personalization">email@cliente.com</span>');
    }

    // Update campaign summary
    updateCampaignSummary() {
        document.getElementById('summaryName').textContent = document.getElementById('campaignName').value;
        document.getElementById('summarySubject').textContent = document.getElementById('emailSubject').value;
        document.getElementById('summaryType').textContent = document.getElementById('campaignType').value;
        
        const sendOption = document.querySelector('input[name="sendOption"]:checked').value;
        const scheduleText = sendOption === 'now' ? 'Enviar Agora' : 
            `Agendado para ${document.getElementById('scheduledTime').value}`;
        document.getElementById('summarySchedule').textContent = scheduleText;
        
        const audienceTotal = document.getElementById('audienceTotal').textContent;
        document.getElementById('summaryAudience').textContent = audienceTotal;
        
        const audienceType = document.querySelector('input[name="audienceType"]:checked').value;
        document.getElementById('summaryAudienceType').textContent = this.getCampaignAudienceType(audienceType);
        
        // Calculate estimated cost (example: R$ 0.01 per email)
        const cost = parseInt(audienceTotal) * 0.01;
        document.getElementById('estimatedCost').textContent = `R$ ${cost.toFixed(2)}`;
    }

    // Load templates for builder
    loadTemplatesForBuilder() {
        const templateGrid = document.getElementById('templateGrid');
        if (!templateGrid) return;

        templateGrid.innerHTML = this.templates.map(template => `
            <div class="template-card" onclick="selectTemplate('${template.id}')">
                <div class="template-preview">
                    <img src="${template.thumbnail}" alt="${template.name}">
                </div>
                <div class="template-info">
                    <h6>${template.name}</h6>
                    <p>${template.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Load segments for builder
    loadSegmentsForBuilder() {
        const segmentsSelection = document.getElementById('segmentsSelection');
        if (!segmentsSelection) return;

        segmentsSelection.innerHTML = this.segments.map(segment => `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" name="selectedSegments" value="${segment.id}" id="segment-${segment.id}">
                <label class="form-check-label" for="segment-${segment.id}">
                    <strong>${segment.name}</strong>
                    <span class="segment-count">${segment.subscriber_count} pessoas</span>
                    <small class="segment-description">${segment.description}</small>
                </label>
            </div>
        `).join('');

        // Add event listeners
        segmentsSelection.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateAudiencePreview();
            });
        });
    }

    // Launch campaign
    async launchCampaign() {
        try {
            const campaignData = this.collectCampaignData();
            
            const response = await fetch('/api/email/campaigns', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(campaignData)
            });

            if (!response.ok) {
                throw new Error('Erro ao criar campanha');
            }

            const newCampaign = await response.json();
            
            // Add to campaigns list
            this.campaigns.unshift(newCampaign);
            
            // Update UI
            this.loadCampaignsUI();
            this.updateEmailStats();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('campaignBuilderModal'));
            modal.hide();
            
            alert('Campanha criada e enviada com sucesso!');

        } catch (error) {
            console.error('Error launching campaign:', error);
            alert('Erro ao lançar campanha: ' + error.message);
        }
    }

    // Collect campaign data
    collectCampaignData() {
        const audienceType = document.querySelector('input[name="audienceType"]:checked').value;
        let selectedSegments = [];
        
        if (audienceType === 'segments') {
            selectedSegments = Array.from(document.querySelectorAll('input[name="selectedSegments"]:checked'))
                .map(checkbox => checkbox.value);
        }

        return {
            name: document.getElementById('campaignName').value,
            type: document.getElementById('campaignType').value,
            subject: document.getElementById('emailSubject').value,
            preview_text: document.getElementById('previewText').value,
            sender_name: document.getElementById('senderName').value,
            content: document.getElementById('emailContent').value,
            audience_type: audienceType,
            selected_segments: selectedSegments,
            send_option: document.querySelector('input[name="sendOption"]:checked').value,
            scheduled_time: document.getElementById('scheduledTime').value,
            status: document.querySelector('input[name="sendOption"]:checked').value === 'now' ? 'sending' : 'scheduled'
        };
    }

    // Send test email
    async sendTestEmail() {
        const testEmail = document.getElementById('testEmail').value;
        
        if (!testEmail) {
            alert('Por favor, digite um e-mail para teste');
            return;
        }

        try {
            const campaignData = this.collectCampaignData();
            
            const response = await fetch('/api/email/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    ...campaignData,
                    test_email: testEmail
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar e-mail de teste');
            }

            alert('E-mail de teste enviado com sucesso!');

        } catch (error) {
            console.error('Error sending test email:', error);
            alert('Erro ao enviar e-mail de teste: ' + error.message);
        }
    }

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }
}

// Global functions for UI interactions
function createNewCampaign() {
    emailMarketing.createNewCampaign();
}

function nextStep() {
    emailMarketing.nextStep();
}

function previousStep() {
    emailMarketing.previousStep();
}

function launchCampaign() {
    emailMarketing.launchCampaign();
}

function sendTestEmail() {
    emailMarketing.sendTestEmail();
}

function selectTemplate(templateId) {
    // Implementation for template selection
    console.log('Template selected:', templateId);
}

function insertPersonalization() {
    // Implementation for inserting personalization tokens
    const content = document.getElementById('emailContent');
    const cursorPos = content.selectionStart;
    const textBefore = content.value.substring(0, cursorPos);
    const textAfter = content.value.substring(cursorPos);
    content.value = textBefore + '{{name}}' + textAfter;
    emailMarketing.updateEmailPreview();
}

function insertImage() {
    // Implementation for inserting images
    alert('Funcionalidade de inserir imagem em desenvolvimento');
}

function insertButton() {
    // Implementation for inserting buttons
    const content = document.getElementById('emailContent');
    const cursorPos = content.selectionStart;
    const textBefore = content.value.substring(0, cursorPos);
    const textAfter = content.value.substring(cursorPos);
    content.value = textBefore + '\n[BOTÃO: Clique Aqui](https://fotos63.com)\n' + textAfter;
    emailMarketing.updateEmailPreview();
}

// Initialize email marketing system
const emailMarketing = new EmailMarketingSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailMarketingSystem;
}

