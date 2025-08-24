// Event Management System for Fotos63
// Sistema Completo de Criação e Gestão de Eventos com Mapeamento Inteligente

class EventManagementSystem {
    constructor() {
        this.currentEvent = null;
        this.userEvents = [];
        this.eventCategories = [
            'casamento', 'aniversario', 'formatura', 'corporativo', 
            'festa_infantil', 'batizado', 'ensaio', 'show', 'esporte', 'outros'
        ];
        this.competitorPrices = {};
        this.initializeSystem();
    }

    initializeSystem() {
        this.loadUserEvents();
        this.loadCompetitorPrices();
        this.setupNotificationSystem();
    }

    // Load user's events
    async loadUserEvents() {
        try {
            const response = await fetch('/api/events/user', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                this.userEvents = await response.json();
            }
        } catch (error) {
            console.error('Error loading user events:', error);
        }
    }

    // Load competitor prices for dynamic pricing
    async loadCompetitorPrices() {
        try {
            const response = await fetch('/api/pricing/competitors');
            if (response.ok) {
                this.competitorPrices = await response.json();
            }
        } catch (error) {
            console.error('Error loading competitor prices:', error);
        }
    }

    // Create event management interface
    createEventInterface(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = `
            <div class="event-management">
                <div class="event-header">
                    <h3><i class="bi bi-calendar-event"></i> Gestão de Eventos</h3>
                    <button class="btn btn-primary" onclick="showCreateEventModal()">
                        <i class="bi bi-plus-circle"></i> Criar Evento
                    </button>
                </div>

                <!-- Event Statistics -->
                <div class="event-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-calendar-check"></i>
                        </div>
                        <div class="stat-info">
                            <h4 id="totalEvents">0</h4>
                            <p>Eventos Criados</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-people"></i>
                        </div>
                        <div class="stat-info">
                            <h4 id="totalParticipants">0</h4>
                            <p>Participantes</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-camera"></i>
                        </div>
                        <div class="stat-info">
                            <h4 id="totalPhotos">0</h4>
                            <p>Fotos Mapeadas</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="bi bi-currency-dollar"></i>
                        </div>
                        <div class="stat-info">
                            <h4 id="totalRevenue">R$ 0</h4>
                            <p>Receita Gerada</p>
                        </div>
                    </div>
                </div>

                <!-- Event Filters -->
                <div class="event-filters">
                    <div class="filter-group">
                        <select class="form-control" id="eventStatusFilter">
                            <option value="all">Todos os Status</option>
                            <option value="upcoming">Próximos</option>
                            <option value="ongoing">Em Andamento</option>
                            <option value="completed">Concluídos</option>
                            <option value="cancelled">Cancelados</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <select class="form-control" id="eventCategoryFilter">
                            <option value="all">Todas as Categorias</option>
                            ${this.eventCategories.map(cat => `
                                <option value="${cat}">${this.getCategoryDisplayName(cat)}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="filter-group">
                        <input type="text" class="form-control" id="eventSearchInput" placeholder="Buscar eventos...">
                    </div>
                </div>

                <!-- Events List -->
                <div class="events-list" id="eventsList">
                    <!-- Events will be loaded here -->
                </div>

                <!-- Create Event Modal -->
                <div class="modal fade" id="createEventModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Criar Novo Evento</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="createEventForm">
                                    <!-- Basic Information -->
                                    <div class="form-section">
                                        <h6>Informações Básicas</h6>
                                        <div class="row">
                                            <div class="col-md-8">
                                                <div class="form-group">
                                                    <label>Nome do Evento *</label>
                                                    <input type="text" class="form-control" id="eventName" required>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label>Categoria *</label>
                                                    <select class="form-control" id="eventCategory" required>
                                                        ${this.eventCategories.map(cat => `
                                                            <option value="${cat}">${this.getCategoryDisplayName(cat)}</option>
                                                        `).join('')}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label>Descrição</label>
                                            <textarea class="form-control" id="eventDescription" rows="3"></textarea>
                                        </div>
                                    </div>

                                    <!-- Date and Time -->
                                    <div class="form-section">
                                        <h6>Data e Horário</h6>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Data de Início *</label>
                                                    <input type="datetime-local" class="form-control" id="eventStartDate" required>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Data de Término</label>
                                                    <input type="datetime-local" class="form-control" id="eventEndDate">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Location -->
                                    <div class="form-section">
                                        <h6>Localização</h6>
                                        <div class="row">
                                            <div class="col-md-8">
                                                <div class="form-group">
                                                    <label>Endereço Completo *</label>
                                                    <input type="text" class="form-control" id="eventAddress" required>
                                                </div>
                                            </div>
                                            <div class="col-md-4">
                                                <div class="form-group">
                                                    <label>CEP</label>
                                                    <input type="text" class="form-control" id="eventZipCode" maxlength="9">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Cidade *</label>
                                                    <input type="text" class="form-control" id="eventCity" required>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Estado *</label>
                                                    <select class="form-control" id="eventState" required>
                                                        <option value="TO">Tocantins</option>
                                                        <option value="GO">Goiás</option>
                                                        <option value="MT">Mato Grosso</option>
                                                        <option value="PA">Pará</option>
                                                        <option value="MA">Maranhão</option>
                                                        <!-- Add more states as needed -->
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Organizer Information -->
                                    <div class="form-section">
                                        <h6>Informações do Organizador</h6>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Nome do Organizador *</label>
                                                    <input type="text" class="form-control" id="organizerName" required>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>E-mail do Organizador *</label>
                                                    <input type="email" class="form-control" id="organizerEmail" required>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Telefone *</label>
                                                    <input type="tel" class="form-control" id="organizerPhone" required>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>WhatsApp</label>
                                                    <input type="tel" class="form-control" id="organizerWhatsApp">
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Event Settings -->
                                    <div class="form-section">
                                        <h6>Configurações do Evento</h6>
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Número Estimado de Participantes</label>
                                                    <input type="number" class="form-control" id="expectedParticipants" min="1">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Tipo de Acesso</label>
                                                    <select class="form-control" id="eventAccessType">
                                                        <option value="public">Público</option>
                                                        <option value="private">Privado</option>
                                                        <option value="invite_only">Apenas Convidados</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div class="form-group">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="enableFacialRecognition" checked>
                                                <label class="form-check-label" for="enableFacialRecognition">
                                                    Habilitar Reconhecimento Facial Automático
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div class="form-group">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="enableAutoNotifications" checked>
                                                <label class="form-check-label" for="enableAutoNotifications">
                                                    Notificar Participantes Automaticamente
                                                </label>
                                            </div>
                                        </div>
                                        
                                        <div class="form-group">
                                            <div class="form-check">
                                                <input class="form-check-input" type="checkbox" id="enableDynamicPricing" checked>
                                                <label class="form-check-label" for="enableDynamicPricing">
                                                    Usar Precificação Dinâmica Competitiva
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Photographers -->
                                    <div class="form-section">
                                        <h6>Fotógrafos</h6>
                                        <div class="form-group">
                                            <label>Fotógrafos Convidados</label>
                                            <div class="photographer-selector" id="photographerSelector">
                                                <input type="text" class="form-control" id="photographerSearch" 
                                                       placeholder="Buscar fotógrafos...">
                                                <div class="photographer-list" id="photographerList">
                                                    <!-- Photographer list will be populated -->
                                                </div>
                                            </div>
                                            <div class="selected-photographers" id="selectedPhotographers">
                                                <!-- Selected photographers will appear here -->
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Pricing Configuration -->
                                    <div class="form-section">
                                        <h6>Configuração de Preços</h6>
                                        <div class="pricing-strategy">
                                            <div class="form-group">
                                                <label>Estratégia de Precificação</label>
                                                <select class="form-control" id="pricingStrategy">
                                                    <option value="competitive">Competitiva (1% abaixo da concorrência)</option>
                                                    <option value="fixed">Preço Fixo</option>
                                                    <option value="dynamic">Dinâmica por Demanda</option>
                                                </select>
                                            </div>
                                            
                                            <div class="pricing-details" id="pricingDetails">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>Preço Base por Foto</label>
                                                            <div class="input-group">
                                                                <span class="input-group-text">R$</span>
                                                                <input type="number" class="form-control" id="basePhotoPrice" 
                                                                       step="0.01" min="0">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-6">
                                                        <div class="form-group">
                                                            <label>Comissão da Plataforma (%)</label>
                                                            <input type="number" class="form-control" id="platformCommission" 
                                                                   value="5" min="0" max="20" readonly>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="competitive-analysis" id="competitiveAnalysis" style="display: none;">
                                                    <h6>Análise Competitiva</h6>
                                                    <div class="competitor-prices" id="competitorPrices">
                                                        <!-- Competitor prices will be shown here -->
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" onclick="createEvent()">Criar Evento</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Event Details Modal -->
                <div class="modal fade" id="eventDetailsModal" tabindex="-1">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="eventDetailsTitle">Detalhes do Evento</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body" id="eventDetailsBody">
                                <!-- Event details will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Photo Mapping Interface -->
                <div class="photo-mapping" id="photoMapping" style="display: none;">
                    <div class="mapping-header">
                        <h4>Mapeamento Inteligente de Fotos</h4>
                        <p>Sistema automático de identificação e sugestão de fotos</p>
                    </div>
                    
                    <div class="mapping-stats">
                        <div class="stat-item">
                            <span class="stat-number" id="mappedPhotos">0</span>
                            <span class="stat-label">Fotos Mapeadas</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="identifiedPeople">0</span>
                            <span class="stat-label">Pessoas Identificadas</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="suggestedSales">0</span>
                            <span class="stat-label">Vendas Sugeridas</span>
                        </div>
                    </div>
                    
                    <div class="mapping-results" id="mappingResults">
                        <!-- Mapping results will be shown here -->
                    </div>
                </div>
            </div>
        `;

        this.setupEventEvents();
        this.loadEventsUI();
        this.updateEventStats();
    }

    // Setup event listeners
    setupEventEvents() {
        // Search and filters
        document.getElementById('eventSearchInput').addEventListener('input', (e) => {
            this.filterEvents();
        });

        document.getElementById('eventStatusFilter').addEventListener('change', () => {
            this.filterEvents();
        });

        document.getElementById('eventCategoryFilter').addEventListener('change', () => {
            this.filterEvents();
        });

        // Pricing strategy change
        document.getElementById('pricingStrategy').addEventListener('change', (e) => {
            this.handlePricingStrategyChange(e.target.value);
        });

        // Photographer search
        document.getElementById('photographerSearch').addEventListener('input', (e) => {
            this.searchPhotographers(e.target.value);
        });

        // ZIP code mask
        document.getElementById('eventZipCode').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });

        // Phone masks
        ['organizerPhone', 'organizerWhatsApp'].forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
                value = value.replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3');
                e.target.value = value;
            });
        });
    }

    // Get category display name
    getCategoryDisplayName(category) {
        const names = {
            casamento: 'Casamento',
            aniversario: 'Aniversário',
            formatura: 'Formatura',
            corporativo: 'Corporativo',
            festa_infantil: 'Festa Infantil',
            batizado: 'Batizado',
            ensaio: 'Ensaio Fotográfico',
            show: 'Show/Evento Musical',
            esporte: 'Evento Esportivo',
            outros: 'Outros'
        };
        return names[category] || category;
    }

    // Load events UI
    loadEventsUI() {
        const eventsList = document.getElementById('eventsList');
        if (!eventsList) return;

        if (this.userEvents.length === 0) {
            eventsList.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-calendar-x"></i>
                    <h4>Nenhum evento criado</h4>
                    <p>Crie seu primeiro evento para começar a mapear fotos automaticamente</p>
                    <button class="btn btn-primary" onclick="showCreateEventModal()">
                        <i class="bi bi-plus-circle"></i> Criar Primeiro Evento
                    </button>
                </div>
            `;
            return;
        }

        eventsList.innerHTML = this.userEvents.map(event => `
            <div class="event-card" data-event-id="${event.id}">
                <div class="event-header">
                    <div class="event-info">
                        <h5>${event.name}</h5>
                        <p class="event-category">${this.getCategoryDisplayName(event.category)}</p>
                    </div>
                    <div class="event-status">
                        <span class="badge bg-${this.getEventStatusColor(event.status)}">${event.status}</span>
                    </div>
                </div>
                
                <div class="event-details">
                    <div class="detail-item">
                        <i class="bi bi-calendar"></i>
                        <span>${this.formatEventDate(event.start_date, event.end_date)}</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-geo-alt"></i>
                        <span>${event.city}, ${event.state}</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-people"></i>
                        <span>${event.participants_count || 0} participantes</span>
                    </div>
                    <div class="detail-item">
                        <i class="bi bi-camera"></i>
                        <span>${event.photos_count || 0} fotos mapeadas</span>
                    </div>
                </div>
                
                <div class="event-stats">
                    <div class="stat">
                        <span class="stat-value">${event.sales_count || 0}</span>
                        <span class="stat-label">Vendas</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">R$ ${(event.revenue || 0).toFixed(2)}</span>
                        <span class="stat-label">Receita</span>
                    </div>
                </div>
                
                <div class="event-actions">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewEventDetails('${event.id}')">
                        <i class="bi bi-eye"></i> Ver Detalhes
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="viewPhotoMapping('${event.id}')">
                        <i class="bi bi-search"></i> Mapeamento
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" onclick="editEvent('${event.id}')">
                        <i class="bi bi-pencil"></i> Editar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Get event status color
    getEventStatusColor(status) {
        const colors = {
            upcoming: 'primary',
            ongoing: 'success',
            completed: 'secondary',
            cancelled: 'danger'
        };
        return colors[status] || 'secondary';
    }

    // Format event date
    formatEventDate(startDate, endDate) {
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;
        
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        if (end && start.toDateString() !== end.toDateString()) {
            return `${start.toLocaleDateString('pt-BR', options)} - ${end.toLocaleDateString('pt-BR', options)}`;
        } else {
            return start.toLocaleDateString('pt-BR', options);
        }
    }

    // Update event statistics
    updateEventStats() {
        const totalEvents = this.userEvents.length;
        const totalParticipants = this.userEvents.reduce((sum, event) => sum + (event.participants_count || 0), 0);
        const totalPhotos = this.userEvents.reduce((sum, event) => sum + (event.photos_count || 0), 0);
        const totalRevenue = this.userEvents.reduce((sum, event) => sum + (event.revenue || 0), 0);

        document.getElementById('totalEvents').textContent = totalEvents;
        document.getElementById('totalParticipants').textContent = totalParticipants;
        document.getElementById('totalPhotos').textContent = totalPhotos;
        document.getElementById('totalRevenue').textContent = `R$ ${totalRevenue.toFixed(2)}`;
    }

    // Filter events
    filterEvents() {
        const searchTerm = document.getElementById('eventSearchInput').value.toLowerCase();
        const statusFilter = document.getElementById('eventStatusFilter').value;
        const categoryFilter = document.getElementById('eventCategoryFilter').value;

        const eventCards = document.querySelectorAll('.event-card');
        
        eventCards.forEach(card => {
            const eventId = card.dataset.eventId;
            const event = this.userEvents.find(e => e.id === eventId);
            
            if (!event) return;

            const matchesSearch = !searchTerm || 
                event.name.toLowerCase().includes(searchTerm) ||
                event.city.toLowerCase().includes(searchTerm) ||
                event.organizer_name.toLowerCase().includes(searchTerm);

            const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
            const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;

            const shouldShow = matchesSearch && matchesStatus && matchesCategory;
            card.style.display = shouldShow ? 'block' : 'none';
        });
    }

    // Show create event modal
    showCreateEventModal() {
        const modal = new bootstrap.Modal(document.getElementById('createEventModal'));
        modal.show();
        
        // Load photographers for selection
        this.loadPhotographersForSelection();
        
        // Set default values
        this.setDefaultEventValues();
    }

    // Set default event values
    setDefaultEventValues() {
        // Set default start date to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(18, 0, 0, 0);
        
        document.getElementById('eventStartDate').value = tomorrow.toISOString().slice(0, 16);
        
        // Set default end date to 4 hours later
        const endDate = new Date(tomorrow);
        endDate.setHours(22, 0, 0, 0);
        document.getElementById('eventEndDate').value = endDate.toISOString().slice(0, 16);
    }

    // Load photographers for selection
    async loadPhotographersForSelection() {
        try {
            const response = await fetch('/api/photographers/available', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                this.availablePhotographers = await response.json();
                this.updatePhotographerList();
            }
        } catch (error) {
            console.error('Error loading photographers:', error);
        }
    }

    // Update photographer list
    updatePhotographerList(searchTerm = '') {
        const photographerList = document.getElementById('photographerList');
        if (!photographerList || !this.availablePhotographers) return;

        const filteredPhotographers = this.availablePhotographers.filter(photographer =>
            photographer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            photographer.specialties.some(specialty => 
                specialty.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );

        photographerList.innerHTML = filteredPhotographers.map(photographer => `
            <div class="photographer-item" onclick="selectPhotographer('${photographer.id}')">
                <img src="${photographer.avatar || '/default-avatar.png'}" alt="${photographer.name}" class="photographer-avatar">
                <div class="photographer-info">
                    <h6>${photographer.name}</h6>
                    <p>${photographer.specialties.join(', ')}</p>
                    <div class="photographer-rating">
                        ${this.generateStarRating(photographer.rating)}
                        <span>(${photographer.reviews_count} avaliações)</span>
                    </div>
                </div>
                <div class="photographer-price">
                    <span>A partir de R$ ${photographer.min_price}</span>
                </div>
            </div>
        `).join('');
    }

    // Generate star rating
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return [
            ...Array(fullStars).fill('<i class="bi bi-star-fill"></i>'),
            ...(hasHalfStar ? ['<i class="bi bi-star-half"></i>'] : []),
            ...Array(emptyStars).fill('<i class="bi bi-star"></i>')
        ].join('');
    }

    // Search photographers
    searchPhotographers(searchTerm) {
        this.updatePhotographerList(searchTerm);
    }

    // Select photographer
    selectPhotographer(photographerId) {
        const photographer = this.availablePhotographers.find(p => p.id === photographerId);
        if (!photographer) return;

        // Add to selected photographers
        if (!this.selectedPhotographers) {
            this.selectedPhotographers = [];
        }

        if (!this.selectedPhotographers.find(p => p.id === photographerId)) {
            this.selectedPhotographers.push(photographer);
            this.updateSelectedPhotographers();
        }
    }

    // Update selected photographers display
    updateSelectedPhotographers() {
        const container = document.getElementById('selectedPhotographers');
        if (!container || !this.selectedPhotographers) return;

        container.innerHTML = this.selectedPhotographers.map(photographer => `
            <div class="selected-photographer">
                <img src="${photographer.avatar || '/default-avatar.png'}" alt="${photographer.name}">
                <span>${photographer.name}</span>
                <button class="btn btn-sm btn-outline-danger" onclick="removeSelectedPhotographer('${photographer.id}')">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        `).join('');
    }

    // Remove selected photographer
    removeSelectedPhotographer(photographerId) {
        if (this.selectedPhotographers) {
            this.selectedPhotographers = this.selectedPhotographers.filter(p => p.id !== photographerId);
            this.updateSelectedPhotographers();
        }
    }

    // Handle pricing strategy change
    handlePricingStrategyChange(strategy) {
        const competitiveAnalysis = document.getElementById('competitiveAnalysis');
        const basePriceInput = document.getElementById('basePhotoPrice');

        if (strategy === 'competitive') {
            competitiveAnalysis.style.display = 'block';
            basePriceInput.readOnly = true;
            this.loadCompetitivePricing();
        } else {
            competitiveAnalysis.style.display = 'none';
            basePriceInput.readOnly = false;
        }
    }

    // Load competitive pricing
    async loadCompetitivePricing() {
        try {
            const category = document.getElementById('eventCategory').value;
            const response = await fetch(`/api/pricing/competitive/${category}`);
            
            if (response.ok) {
                const competitorData = await response.json();
                this.displayCompetitivePricing(competitorData);
            }
        } catch (error) {
            console.error('Error loading competitive pricing:', error);
        }
    }

    // Display competitive pricing
    displayCompetitivePricing(competitorData) {
        const container = document.getElementById('competitorPrices');
        if (!container) return;

        const lowestPrice = Math.min(...competitorData.map(c => c.price));
        const ourPrice = Math.max(1.00, lowestPrice * 0.99); // 1% below lowest competitor

        container.innerHTML = `
            <div class="competitive-summary">
                <h6>Análise de Preços da Concorrência</h6>
                <div class="competitor-list">
                    ${competitorData.map(competitor => `
                        <div class="competitor-item">
                            <span class="competitor-name">${competitor.name}</span>
                            <span class="competitor-price">R$ ${competitor.price.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="our-price">
                    <strong>Nosso Preço Sugerido: R$ ${ourPrice.toFixed(2)}</strong>
                    <small>(1% abaixo do menor preço da concorrência)</small>
                </div>
            </div>
        `;

        // Update the base price input
        document.getElementById('basePhotoPrice').value = ourPrice.toFixed(2);
    }

    // Create event
    async createEvent() {
        try {
            const eventData = this.collectEventData();
            
            if (!this.validateEventData(eventData)) {
                return;
            }

            const response = await fetch('/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error('Erro ao criar evento');
            }

            const newEvent = await response.json();
            
            // Add to local events list
            this.userEvents.unshift(newEvent);
            
            // Update UI
            this.loadEventsUI();
            this.updateEventStats();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('createEventModal'));
            modal.hide();
            
            // Show success message
            alert('Evento criado com sucesso!');
            
            // Start automatic photo mapping if enabled
            if (eventData.enable_facial_recognition) {
                this.startPhotoMapping(newEvent.id);
            }
            
            // Send notifications if enabled
            if (eventData.enable_auto_notifications) {
                this.sendEventNotifications(newEvent.id);
            }

        } catch (error) {
            console.error('Error creating event:', error);
            alert('Erro ao criar evento: ' + error.message);
        }
    }

    // Collect event data from form
    collectEventData() {
        return {
            name: document.getElementById('eventName').value,
            description: document.getElementById('eventDescription').value,
            category: document.getElementById('eventCategory').value,
            start_date: document.getElementById('eventStartDate').value,
            end_date: document.getElementById('eventEndDate').value,
            address: document.getElementById('eventAddress').value,
            zip_code: document.getElementById('eventZipCode').value,
            city: document.getElementById('eventCity').value,
            state: document.getElementById('eventState').value,
            organizer_name: document.getElementById('organizerName').value,
            organizer_email: document.getElementById('organizerEmail').value,
            organizer_phone: document.getElementById('organizerPhone').value,
            organizer_whatsapp: document.getElementById('organizerWhatsApp').value,
            expected_participants: parseInt(document.getElementById('expectedParticipants').value) || 0,
            access_type: document.getElementById('eventAccessType').value,
            enable_facial_recognition: document.getElementById('enableFacialRecognition').checked,
            enable_auto_notifications: document.getElementById('enableAutoNotifications').checked,
            enable_dynamic_pricing: document.getElementById('enableDynamicPricing').checked,
            pricing_strategy: document.getElementById('pricingStrategy').value,
            base_photo_price: parseFloat(document.getElementById('basePhotoPrice').value) || 0,
            platform_commission: parseFloat(document.getElementById('platformCommission').value) || 5,
            selected_photographers: this.selectedPhotographers || []
        };
    }

    // Validate event data
    validateEventData(data) {
        const requiredFields = [
            'name', 'category', 'start_date', 'address', 'city', 'state',
            'organizer_name', 'organizer_email', 'organizer_phone'
        ];

        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                alert(`Por favor, preencha o campo: ${field}`);
                return false;
            }
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.organizer_email)) {
            alert('Por favor, digite um e-mail válido');
            return false;
        }

        // Validate dates
        const startDate = new Date(data.start_date);
        const endDate = data.end_date ? new Date(data.end_date) : null;
        
        if (startDate < new Date()) {
            alert('A data de início deve ser futura');
            return false;
        }

        if (endDate && endDate <= startDate) {
            alert('A data de término deve ser posterior à data de início');
            return false;
        }

        return true;
    }

    // Start automatic photo mapping
    async startPhotoMapping(eventId) {
        try {
            const response = await fetch(`/api/events/${eventId}/start-mapping`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                console.log('Photo mapping started for event:', eventId);
            }
        } catch (error) {
            console.error('Error starting photo mapping:', error);
        }
    }

    // Send event notifications
    async sendEventNotifications(eventId) {
        try {
            const response = await fetch(`/api/events/${eventId}/notify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                console.log('Event notifications sent for event:', eventId);
            }
        } catch (error) {
            console.error('Error sending event notifications:', error);
        }
    }

    // View event details
    async viewEventDetails(eventId) {
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                const eventDetails = await response.json();
                this.showEventDetailsModal(eventDetails);
            }
        } catch (error) {
            console.error('Error loading event details:', error);
        }
    }

    // Show event details modal
    showEventDetailsModal(event) {
        const modal = new bootstrap.Modal(document.getElementById('eventDetailsModal'));
        
        document.getElementById('eventDetailsTitle').textContent = event.name;
        document.getElementById('eventDetailsBody').innerHTML = this.generateEventDetailsHTML(event);
        
        modal.show();
    }

    // Generate event details HTML
    generateEventDetailsHTML(event) {
        return `
            <div class="event-details-content">
                <div class="row">
                    <div class="col-md-8">
                        <div class="detail-section">
                            <h6>Informações Gerais</h6>
                            <p><strong>Categoria:</strong> ${this.getCategoryDisplayName(event.category)}</p>
                            <p><strong>Descrição:</strong> ${event.description || 'Não informado'}</p>
                            <p><strong>Status:</strong> <span class="badge bg-${this.getEventStatusColor(event.status)}">${event.status}</span></p>
                        </div>

                        <div class="detail-section">
                            <h6>Data e Local</h6>
                            <p><strong>Início:</strong> ${this.formatEventDate(event.start_date)}</p>
                            ${event.end_date ? `<p><strong>Término:</strong> ${this.formatEventDate(event.end_date)}</p>` : ''}
                            <p><strong>Endereço:</strong> ${event.address}</p>
                            <p><strong>Cidade:</strong> ${event.city}, ${event.state}</p>
                        </div>

                        <div class="detail-section">
                            <h6>Organizador</h6>
                            <p><strong>Nome:</strong> ${event.organizer_name}</p>
                            <p><strong>E-mail:</strong> ${event.organizer_email}</p>
                            <p><strong>Telefone:</strong> ${event.organizer_phone}</p>
                            ${event.organizer_whatsapp ? `<p><strong>WhatsApp:</strong> ${event.organizer_whatsapp}</p>` : ''}
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="detail-section">
                            <h6>Estatísticas</h6>
                            <div class="stat-grid">
                                <div class="stat-item">
                                    <span class="stat-number">${event.participants_count || 0}</span>
                                    <span class="stat-label">Participantes</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">${event.photos_count || 0}</span>
                                    <span class="stat-label">Fotos</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">${event.sales_count || 0}</span>
                                    <span class="stat-label">Vendas</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-number">R$ ${(event.revenue || 0).toFixed(2)}</span>
                                    <span class="stat-label">Receita</span>
                                </div>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h6>Configurações</h6>
                            <p><strong>Acesso:</strong> ${event.access_type}</p>
                            <p><strong>Reconhecimento Facial:</strong> ${event.enable_facial_recognition ? 'Ativo' : 'Inativo'}</p>
                            <p><strong>Notificações:</strong> ${event.enable_auto_notifications ? 'Ativas' : 'Inativas'}</p>
                            <p><strong>Preço Base:</strong> R$ ${(event.base_photo_price || 0).toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                ${event.photographers && event.photographers.length > 0 ? `
                    <div class="detail-section">
                        <h6>Fotógrafos</h6>
                        <div class="photographers-grid">
                            ${event.photographers.map(photographer => `
                                <div class="photographer-card">
                                    <img src="${photographer.avatar || '/default-avatar.png'}" alt="${photographer.name}">
                                    <div class="photographer-info">
                                        <h6>${photographer.name}</h6>
                                        <p>${photographer.specialties.join(', ')}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // View photo mapping
    async viewPhotoMapping(eventId) {
        try {
            const response = await fetch(`/api/events/${eventId}/mapping`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                const mappingData = await response.json();
                this.showPhotoMapping(mappingData);
            }
        } catch (error) {
            console.error('Error loading photo mapping:', error);
        }
    }

    // Show photo mapping interface
    showPhotoMapping(mappingData) {
        const mappingDiv = document.getElementById('photoMapping');
        mappingDiv.style.display = 'block';

        // Update mapping stats
        document.getElementById('mappedPhotos').textContent = mappingData.total_photos || 0;
        document.getElementById('identifiedPeople').textContent = mappingData.identified_people || 0;
        document.getElementById('suggestedSales').textContent = mappingData.suggested_sales || 0;

        // Show mapping results
        const resultsContainer = document.getElementById('mappingResults');
        resultsContainer.innerHTML = this.generateMappingResultsHTML(mappingData.results || []);
    }

    // Generate mapping results HTML
    generateMappingResultsHTML(results) {
        if (results.length === 0) {
            return '<p class="text-muted text-center">Nenhum resultado de mapeamento disponível ainda.</p>';
        }

        return `
            <div class="mapping-results-grid">
                ${results.map(result => `
                    <div class="mapping-result-card">
                        <div class="result-header">
                            <h6>${result.participant_name}</h6>
                            <span class="badge bg-primary">${result.photos_count} fotos</span>
                        </div>
                        <div class="result-photos">
                            ${result.photos.slice(0, 4).map(photo => `
                                <img src="${photo.thumbnail_url}" alt="Foto" class="result-photo">
                            `).join('')}
                            ${result.photos.length > 4 ? `
                                <div class="more-photos">+${result.photos.length - 4}</div>
                            ` : ''}
                        </div>
                        <div class="result-actions">
                            <button class="btn btn-sm btn-primary" onclick="notifyParticipant('${result.participant_id}', '${result.event_id}')">
                                <i class="bi bi-bell"></i> Notificar
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="viewParticipantPhotos('${result.participant_id}', '${result.event_id}')">
                                <i class="bi bi-eye"></i> Ver Todas
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Setup notification system
    setupNotificationSystem() {
        // Listen for new event notifications
        if ('Notification' in window) {
            Notification.requestPermission();
        }

        // Setup WebSocket for real-time updates (if available)
        this.setupWebSocketConnection();
    }

    // Setup WebSocket connection
    setupWebSocketConnection() {
        try {
            const wsUrl = `wss://${window.location.host}/ws/events`;
            this.ws = new WebSocket(wsUrl);

            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                this.handleWebSocketMessage(data);
            };

            this.ws.onclose = () => {
                // Reconnect after 5 seconds
                setTimeout(() => this.setupWebSocketConnection(), 5000);
            };
        } catch (error) {
            console.error('WebSocket connection error:', error);
        }
    }

    // Handle WebSocket messages
    handleWebSocketMessage(data) {
        switch (data.type) {
            case 'new_event_participant':
                this.handleNewParticipant(data);
                break;
            case 'photo_mapping_complete':
                this.handlePhotoMappingComplete(data);
                break;
            case 'new_photo_sale':
                this.handleNewPhotoSale(data);
                break;
        }
    }

    // Handle new participant
    handleNewParticipant(data) {
        // Update event stats
        this.loadUserEvents().then(() => {
            this.loadEventsUI();
            this.updateEventStats();
        });

        // Show notification
        if (Notification.permission === 'granted') {
            new Notification('Novo Participante', {
                body: `${data.participant_name} se inscreveu no evento ${data.event_name}`,
                icon: '/favicon.ico'
            });
        }
    }

    // Handle photo mapping complete
    handlePhotoMappingComplete(data) {
        // Update mapping display if visible
        if (document.getElementById('photoMapping').style.display === 'block') {
            this.viewPhotoMapping(data.event_id);
        }

        // Show notification
        if (Notification.permission === 'granted') {
            new Notification('Mapeamento Concluído', {
                body: `${data.photos_count} fotos foram mapeadas para o evento ${data.event_name}`,
                icon: '/favicon.ico'
            });
        }
    }

    // Handle new photo sale
    handleNewPhotoSale(data) {
        // Update event stats
        this.loadUserEvents().then(() => {
            this.loadEventsUI();
            this.updateEventStats();
        });

        // Show notification
        if (Notification.permission === 'granted') {
            new Notification('Nova Venda', {
                body: `Foto vendida por R$ ${data.amount.toFixed(2)} no evento ${data.event_name}`,
                icon: '/favicon.ico'
            });
        }
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }
}

// Global functions for UI interactions
function showCreateEventModal() {
    eventManagement.showCreateEventModal();
}

function createEvent() {
    eventManagement.createEvent();
}

function selectPhotographer(photographerId) {
    eventManagement.selectPhotographer(photographerId);
}

function removeSelectedPhotographer(photographerId) {
    eventManagement.removeSelectedPhotographer(photographerId);
}

function viewEventDetails(eventId) {
    eventManagement.viewEventDetails(eventId);
}

function viewPhotoMapping(eventId) {
    eventManagement.viewPhotoMapping(eventId);
}

function editEvent(eventId) {
    // Implementation for editing events
    alert(`Editar evento ${eventId} - Em desenvolvimento`);
}

function notifyParticipant(participantId, eventId) {
    // Implementation for notifying participants
    alert(`Notificar participante ${participantId} - Em desenvolvimento`);
}

function viewParticipantPhotos(participantId, eventId) {
    // Implementation for viewing participant photos
    alert(`Ver fotos do participante ${participantId} - Em desenvolvimento`);
}

// Initialize event management system
const eventManagement = new EventManagementSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventManagementSystem;
}

