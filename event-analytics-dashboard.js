// Event Analytics Dashboard for Fotos63
// Dashboard Avançado de Analytics para Eventos com Gráficos e Exportação

class EventAnalyticsDashboard {
    constructor() {
        this.currentEvent = null;
        this.participants = [];
        this.filteredParticipants = [];
        this.charts = {};
        this.filters = {
            age: { min: 0, max: 100 },
            gender: 'all',
            location: 'all',
            registration_date: 'all',
            participation_status: 'all',
            photo_purchases: 'all'
        };
        this.initializeDashboard();
    }

    initializeDashboard() {
        this.loadChartLibraries();
        this.setupExportLibraries();
    }

    // Load Chart.js and other visualization libraries
    loadChartLibraries() {
        if (!window.Chart) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            document.head.appendChild(script);
        }
    }

    // Setup export libraries (jsPDF, SheetJS)
    setupExportLibraries() {
        // Load jsPDF for PDF export
        if (!window.jsPDF) {
            const pdfScript = document.createElement('script');
            pdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(pdfScript);
        }

        // Load SheetJS for Excel export
        if (!window.XLSX) {
            const xlsxScript = document.createElement('script');
            xlsxScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
            document.head.appendChild(xlsxScript);
        }
    }

    // Create analytics dashboard interface
    createAnalyticsDashboard(containerId, eventId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        this.currentEvent = eventId;

        container.innerHTML = `
            <div class="event-analytics-dashboard">
                <div class="dashboard-header">
                    <div class="header-info">
                        <h3><i class="bi bi-graph-up"></i> Analytics do Evento</h3>
                        <p class="event-name" id="eventName">Carregando...</p>
                    </div>
                    <div class="header-actions">
                        <button class="btn btn-outline-primary" onclick="refreshDashboard()">
                            <i class="bi bi-arrow-clockwise"></i> Atualizar
                        </button>
                        <div class="dropdown">
                            <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-download"></i> Exportar
                            </button>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#" onclick="exportToPDF()">
                                    <i class="bi bi-file-pdf"></i> Relatório PDF
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="exportToExcel()">
                                    <i class="bi bi-file-excel"></i> Planilha Excel
                                </a></li>
                                <li><a class="dropdown-item" href="#" onclick="exportParticipantsList()">
                                    <i class="bi bi-people"></i> Lista de Participantes
                                </a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#" onclick="exportCustomReport()">
                                    <i class="bi bi-gear"></i> Relatório Personalizado
                                </a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Key Metrics Cards -->
                <div class="metrics-cards">
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="bi bi-people-fill"></i>
                        </div>
                        <div class="metric-info">
                            <h4 id="totalParticipants">0</h4>
                            <p>Total de Inscritos</p>
                            <small class="metric-change" id="participantsChange">+0% vs. último evento</small>
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <div class="metric-info">
                            <h4 id="confirmedParticipants">0</h4>
                            <p>Confirmados</p>
                            <small class="metric-change" id="confirmationRate">0% taxa de confirmação</small>
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="bi bi-camera-fill"></i>
                        </div>
                        <div class="metric-info">
                            <h4 id="photoPurchasers">0</h4>
                            <p>Compraram Fotos</p>
                            <small class="metric-change" id="purchaseRate">0% taxa de compra</small>
                        </div>
                    </div>

                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="bi bi-currency-dollar"></i>
                        </div>
                        <div class="metric-info">
                            <h4 id="totalRevenue">R$ 0</h4>
                            <p>Receita Total</p>
                            <small class="metric-change" id="revenuePerParticipant">R$ 0 por participante</small>
                        </div>
                    </div>
                </div>

                <!-- Advanced Filters -->
                <div class="analytics-filters">
                    <div class="filters-header">
                        <h5><i class="bi bi-funnel"></i> Filtros Avançados</h5>
                        <button class="btn btn-sm btn-outline-secondary" onclick="resetFilters()">
                            <i class="bi bi-arrow-counterclockwise"></i> Limpar Filtros
                        </button>
                    </div>

                    <div class="filters-grid">
                        <div class="filter-group">
                            <label>Faixa Etária</label>
                            <div class="age-range-slider">
                                <input type="range" id="ageMin" min="0" max="100" value="0" class="form-range">
                                <input type="range" id="ageMax" min="0" max="100" value="100" class="form-range">
                                <div class="range-labels">
                                    <span id="ageMinLabel">0</span> - <span id="ageMaxLabel">100</span> anos
                                </div>
                            </div>
                        </div>

                        <div class="filter-group">
                            <label>Gênero</label>
                            <select class="form-control" id="genderFilter">
                                <option value="all">Todos</option>
                                <option value="male">Masculino</option>
                                <option value="female">Feminino</option>
                                <option value="other">Outro</option>
                                <option value="not_informed">Não Informado</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Localização</label>
                            <select class="form-control" id="locationFilter">
                                <option value="all">Todas as Cidades</option>
                                <!-- Cities will be populated dynamically -->
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Data de Inscrição</label>
                            <select class="form-control" id="registrationDateFilter">
                                <option value="all">Todas as Datas</option>
                                <option value="last_24h">Últimas 24h</option>
                                <option value="last_week">Última Semana</option>
                                <option value="last_month">Último Mês</option>
                                <option value="custom">Período Personalizado</option>
                            </select>
                            <div class="custom-date-range" id="customDateRange" style="display: none;">
                                <input type="date" class="form-control" id="startDate">
                                <input type="date" class="form-control" id="endDate">
                            </div>
                        </div>

                        <div class="filter-group">
                            <label>Status de Participação</label>
                            <select class="form-control" id="participationStatusFilter">
                                <option value="all">Todos os Status</option>
                                <option value="registered">Inscrito</option>
                                <option value="confirmed">Confirmado</option>
                                <option value="attended">Compareceu</option>
                                <option value="no_show">Não Compareceu</option>
                                <option value="cancelled">Cancelado</option>
                            </select>
                        </div>

                        <div class="filter-group">
                            <label>Compras de Fotos</label>
                            <select class="form-control" id="photoPurchasesFilter">
                                <option value="all">Todos</option>
                                <option value="purchased">Compraram Fotos</option>
                                <option value="not_purchased">Não Compraram</option>
                                <option value="high_value">Alto Valor (>R$ 100)</option>
                                <option value="medium_value">Médio Valor (R$ 50-100)</option>
                                <option value="low_value">Baixo Valor (<R$ 50)</option>
                            </select>
                        </div>
                    </div>

                    <div class="filter-results">
                        <span class="results-count">
                            Mostrando <strong id="filteredCount">0</strong> de <strong id="totalCount">0</strong> participantes
                        </span>
                        <div class="quick-filters">
                            <button class="btn btn-sm btn-outline-primary" onclick="applyQuickFilter('vip')">
                                <i class="bi bi-star"></i> VIPs
                            </button>
                            <button class="btn btn-sm btn-outline-success" onclick="applyQuickFilter('high_engagement')">
                                <i class="bi bi-heart"></i> Alto Engajamento
                            </button>
                            <button class="btn btn-sm btn-outline-warning" onclick="applyQuickFilter('potential_buyers')">
                                <i class="bi bi-cart"></i> Potenciais Compradores
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-section">
                    <div class="charts-grid">
                        <!-- Demographics Chart -->
                        <div class="chart-container">
                            <div class="chart-header">
                                <h5>Demografia dos Participantes</h5>
                                <div class="chart-controls">
                                    <select class="form-control form-control-sm" id="demographicsType">
                                        <option value="age">Por Idade</option>
                                        <option value="gender">Por Gênero</option>
                                        <option value="location">Por Localização</option>
                                    </select>
                                </div>
                            </div>
                            <canvas id="demographicsChart"></canvas>
                        </div>

                        <!-- Registration Timeline -->
                        <div class="chart-container">
                            <div class="chart-header">
                                <h5>Timeline de Inscrições</h5>
                                <div class="chart-controls">
                                    <select class="form-control form-control-sm" id="timelineGranularity">
                                        <option value="daily">Por Dia</option>
                                        <option value="hourly">Por Hora</option>
                                        <option value="weekly">Por Semana</option>
                                    </select>
                                </div>
                            </div>
                            <canvas id="registrationTimelineChart"></canvas>
                        </div>

                        <!-- Engagement Metrics -->
                        <div class="chart-container">
                            <div class="chart-header">
                                <h5>Métricas de Engajamento</h5>
                            </div>
                            <canvas id="engagementChart"></canvas>
                        </div>

                        <!-- Revenue Analysis -->
                        <div class="chart-container">
                            <div class="chart-header">
                                <h5>Análise de Receita</h5>
                                <div class="chart-controls">
                                    <select class="form-control form-control-sm" id="revenueBreakdown">
                                        <option value="by_participant">Por Participante</option>
                                        <option value="by_photo_type">Por Tipo de Foto</option>
                                        <option value="by_package">Por Pacote</option>
                                    </select>
                                </div>
                            </div>
                            <canvas id="revenueChart"></canvas>
                        </div>

                        <!-- Conversion Funnel -->
                        <div class="chart-container full-width">
                            <div class="chart-header">
                                <h5>Funil de Conversão</h5>
                            </div>
                            <canvas id="conversionFunnelChart"></canvas>
                        </div>

                        <!-- Heatmap -->
                        <div class="chart-container full-width">
                            <div class="chart-header">
                                <h5>Mapa de Calor - Atividade por Hora/Dia</h5>
                            </div>
                            <div id="activityHeatmap" class="heatmap-container">
                                <!-- Heatmap will be generated here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Detailed Participants Table -->
                <div class="participants-table-section">
                    <div class="table-header">
                        <h5><i class="bi bi-table"></i> Lista Detalhada de Participantes</h5>
                        <div class="table-controls">
                            <input type="text" class="form-control" id="participantSearch" placeholder="Buscar participante...">
                            <select class="form-control" id="tablePageSize">
                                <option value="25">25 por página</option>
                                <option value="50">50 por página</option>
                                <option value="100">100 por página</option>
                                <option value="all">Todos</option>
                            </select>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-striped" id="participantsTable">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" id="selectAll"></th>
                                    <th>Nome <i class="bi bi-arrow-down-up sort-icon" data-column="name"></i></th>
                                    <th>Email <i class="bi bi-arrow-down-up sort-icon" data-column="email"></i></th>
                                    <th>Idade <i class="bi bi-arrow-down-up sort-icon" data-column="age"></i></th>
                                    <th>Cidade <i class="bi bi-arrow-down-up sort-icon" data-column="city"></i></th>
                                    <th>Inscrição <i class="bi bi-arrow-down-up sort-icon" data-column="registration_date"></i></th>
                                    <th>Status <i class="bi bi-arrow-down-up sort-icon" data-column="status"></i></th>
                                    <th>Fotos Compradas <i class="bi bi-arrow-down-up sort-icon" data-column="photos_purchased"></i></th>
                                    <th>Valor Gasto <i class="bi bi-arrow-down-up sort-icon" data-column="total_spent"></i></th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody id="participantsTableBody">
                                <!-- Participants data will be loaded here -->
                            </tbody>
                        </table>
                    </div>

                    <div class="table-pagination" id="tablePagination">
                        <!-- Pagination will be generated here -->
                    </div>
                </div>

                <!-- Insights and Recommendations -->
                <div class="insights-section">
                    <div class="insights-header">
                        <h5><i class="bi bi-lightbulb"></i> Insights e Recomendações</h5>
                    </div>
                    <div class="insights-grid" id="insightsGrid">
                        <!-- AI-generated insights will be shown here -->
                    </div>
                </div>

                <!-- Export Modal -->
                <div class="modal fade" id="exportModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Exportar Relatório Personalizado</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="export-options">
                                    <h6>Selecionar Dados para Exportação</h6>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="exportBasicInfo" checked>
                                        <label class="form-check-label" for="exportBasicInfo">Informações Básicas</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="exportDemographics" checked>
                                        <label class="form-check-label" for="exportDemographics">Demografia</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="exportPurchases">
                                        <label class="form-check-label" for="exportPurchases">Histórico de Compras</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="exportEngagement">
                                        <label class="form-check-label" for="exportEngagement">Métricas de Engajamento</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="exportCharts">
                                        <label class="form-check-label" for="exportCharts">Gráficos e Visualizações</label>
                                    </div>
                                </div>

                                <div class="export-format">
                                    <h6>Formato de Exportação</h6>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="exportFormat" id="formatPDF" value="pdf" checked>
                                        <label class="form-check-label" for="formatPDF">PDF (Relatório Completo)</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="exportFormat" id="formatExcel" value="excel">
                                        <label class="form-check-label" for="formatExcel">Excel (Dados Tabulares)</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="exportFormat" id="formatCSV" value="csv">
                                        <label class="form-check-label" for="formatCSV">CSV (Dados Simples)</label>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" onclick="executeCustomExport()">
                                    <i class="bi bi-download"></i> Exportar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupDashboardEvents();
        this.loadEventData();
    }

    // Setup event listeners
    setupDashboardEvents() {
        // Filter events
        ['ageMin', 'ageMax'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.updateAgeRangeLabels();
                this.applyFilters();
            });
        });

        ['genderFilter', 'locationFilter', 'registrationDateFilter', 'participationStatusFilter', 'photoPurchasesFilter'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.applyFilters();
            });
        });

        // Chart control events
        document.getElementById('demographicsType').addEventListener('change', () => {
            this.updateDemographicsChart();
        });

        document.getElementById('timelineGranularity').addEventListener('change', () => {
            this.updateRegistrationTimelineChart();
        });

        document.getElementById('revenueBreakdown').addEventListener('change', () => {
            this.updateRevenueChart();
        });

        // Table events
        document.getElementById('participantSearch').addEventListener('input', () => {
            this.filterParticipantsTable();
        });

        document.getElementById('tablePageSize').addEventListener('change', () => {
            this.updateParticipantsTable();
        });

        // Sort events
        document.querySelectorAll('.sort-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                this.sortParticipantsTable(e.target.dataset.column);
            });
        });

        // Select all checkbox
        document.getElementById('selectAll').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Custom date range
        document.getElementById('registrationDateFilter').addEventListener('change', (e) => {
            const customRange = document.getElementById('customDateRange');
            customRange.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
    }

    // Load event data
    async loadEventData() {
        try {
            const [eventInfo, participants, analytics] = await Promise.all([
                this.fetchEventInfo(),
                this.fetchParticipants(),
                this.fetchEventAnalytics()
            ]);

            this.participants = participants;
            this.filteredParticipants = [...participants];
            
            this.updateEventInfo(eventInfo);
            this.updateMetrics(analytics);
            this.populateLocationFilter();
            this.initializeCharts();
            this.updateParticipantsTable();
            this.generateInsights();

        } catch (error) {
            console.error('Error loading event data:', error);
        }
    }

    // Fetch event information
    async fetchEventInfo() {
        const response = await fetch(`/api/events/${this.currentEvent}`, {
            headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
        });
        return response.json();
    }

    // Fetch participants data
    async fetchParticipants() {
        const response = await fetch(`/api/events/${this.currentEvent}/participants`, {
            headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
        });
        return response.json();
    }

    // Fetch event analytics
    async fetchEventAnalytics() {
        const response = await fetch(`/api/events/${this.currentEvent}/analytics`, {
            headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
        });
        return response.json();
    }

    // Update event information
    updateEventInfo(eventInfo) {
        document.getElementById('eventName').textContent = eventInfo.name;
    }

    // Update key metrics
    updateMetrics(analytics) {
        document.getElementById('totalParticipants').textContent = analytics.total_participants || 0;
        document.getElementById('confirmedParticipants').textContent = analytics.confirmed_participants || 0;
        document.getElementById('photoPurchasers').textContent = analytics.photo_purchasers || 0;
        document.getElementById('totalRevenue').textContent = `R$ ${(analytics.total_revenue || 0).toFixed(2)}`;

        // Calculate rates
        const confirmationRate = analytics.total_participants > 0 ? 
            (analytics.confirmed_participants / analytics.total_participants * 100).toFixed(1) : 0;
        const purchaseRate = analytics.total_participants > 0 ? 
            (analytics.photo_purchasers / analytics.total_participants * 100).toFixed(1) : 0;
        const revenuePerParticipant = analytics.total_participants > 0 ? 
            (analytics.total_revenue / analytics.total_participants).toFixed(2) : 0;

        document.getElementById('confirmationRate').textContent = `${confirmationRate}% taxa de confirmação`;
        document.getElementById('purchaseRate').textContent = `${purchaseRate}% taxa de compra`;
        document.getElementById('revenuePerParticipant').textContent = `R$ ${revenuePerParticipant} por participante`;

        // Update change indicators
        document.getElementById('participantsChange').textContent = 
            `${analytics.participants_change > 0 ? '+' : ''}${analytics.participants_change}% vs. último evento`;
    }

    // Populate location filter
    populateLocationFilter() {
        const cities = [...new Set(this.participants.map(p => p.city).filter(Boolean))].sort();
        const locationFilter = document.getElementById('locationFilter');
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            locationFilter.appendChild(option);
        });
    }

    // Update age range labels
    updateAgeRangeLabels() {
        const minAge = document.getElementById('ageMin').value;
        const maxAge = document.getElementById('ageMax').value;
        
        document.getElementById('ageMinLabel').textContent = minAge;
        document.getElementById('ageMaxLabel').textContent = maxAge;
    }

    // Apply filters
    applyFilters() {
        const filters = {
            ageMin: parseInt(document.getElementById('ageMin').value),
            ageMax: parseInt(document.getElementById('ageMax').value),
            gender: document.getElementById('genderFilter').value,
            location: document.getElementById('locationFilter').value,
            registrationDate: document.getElementById('registrationDateFilter').value,
            participationStatus: document.getElementById('participationStatusFilter').value,
            photoPurchases: document.getElementById('photoPurchasesFilter').value
        };

        this.filteredParticipants = this.participants.filter(participant => {
            // Age filter
            if (participant.age < filters.ageMin || participant.age > filters.ageMax) {
                return false;
            }

            // Gender filter
            if (filters.gender !== 'all' && participant.gender !== filters.gender) {
                return false;
            }

            // Location filter
            if (filters.location !== 'all' && participant.city !== filters.location) {
                return false;
            }

            // Registration date filter
            if (filters.registrationDate !== 'all') {
                const regDate = new Date(participant.registration_date);
                const now = new Date();
                
                switch (filters.registrationDate) {
                    case 'last_24h':
                        if (now - regDate > 24 * 60 * 60 * 1000) return false;
                        break;
                    case 'last_week':
                        if (now - regDate > 7 * 24 * 60 * 60 * 1000) return false;
                        break;
                    case 'last_month':
                        if (now - regDate > 30 * 24 * 60 * 60 * 1000) return false;
                        break;
                }
            }

            // Participation status filter
            if (filters.participationStatus !== 'all' && participant.status !== filters.participationStatus) {
                return false;
            }

            // Photo purchases filter
            if (filters.photoPurchases !== 'all') {
                const totalSpent = participant.total_spent || 0;
                
                switch (filters.photoPurchases) {
                    case 'purchased':
                        if (totalSpent === 0) return false;
                        break;
                    case 'not_purchased':
                        if (totalSpent > 0) return false;
                        break;
                    case 'high_value':
                        if (totalSpent <= 100) return false;
                        break;
                    case 'medium_value':
                        if (totalSpent < 50 || totalSpent > 100) return false;
                        break;
                    case 'low_value':
                        if (totalSpent >= 50) return false;
                        break;
                }
            }

            return true;
        });

        this.updateFilterResults();
        this.updateCharts();
        this.updateParticipantsTable();
    }

    // Update filter results
    updateFilterResults() {
        document.getElementById('filteredCount').textContent = this.filteredParticipants.length;
        document.getElementById('totalCount').textContent = this.participants.length;
    }

    // Apply quick filters
    applyQuickFilter(filterType) {
        switch (filterType) {
            case 'vip':
                document.getElementById('photoPurchasesFilter').value = 'high_value';
                break;
            case 'high_engagement':
                // Custom logic for high engagement participants
                break;
            case 'potential_buyers':
                document.getElementById('photoPurchasesFilter').value = 'not_purchased';
                document.getElementById('participationStatusFilter').value = 'attended';
                break;
        }
        
        this.applyFilters();
    }

    // Reset filters
    resetFilters() {
        document.getElementById('ageMin').value = 0;
        document.getElementById('ageMax').value = 100;
        document.getElementById('genderFilter').value = 'all';
        document.getElementById('locationFilter').value = 'all';
        document.getElementById('registrationDateFilter').value = 'all';
        document.getElementById('participationStatusFilter').value = 'all';
        document.getElementById('photoPurchasesFilter').value = 'all';
        
        this.updateAgeRangeLabels();
        this.applyFilters();
    }

    // Initialize all charts
    initializeCharts() {
        this.createDemographicsChart();
        this.createRegistrationTimelineChart();
        this.createEngagementChart();
        this.createRevenueChart();
        this.createConversionFunnelChart();
        this.createActivityHeatmap();
    }

    // Create demographics chart
    createDemographicsChart() {
        const ctx = document.getElementById('demographicsChart').getContext('2d');
        
        this.charts.demographics = new Chart(ctx, {
            type: 'doughnut',
            data: this.getDemographicsData('age'),
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Get demographics data
    getDemographicsData(type) {
        const data = this.filteredParticipants;
        
        switch (type) {
            case 'age':
                const ageGroups = {
                    '18-25': 0,
                    '26-35': 0,
                    '36-45': 0,
                    '46-55': 0,
                    '56+': 0
                };
                
                data.forEach(p => {
                    const age = p.age || 0;
                    if (age >= 18 && age <= 25) ageGroups['18-25']++;
                    else if (age >= 26 && age <= 35) ageGroups['26-35']++;
                    else if (age >= 36 && age <= 45) ageGroups['36-45']++;
                    else if (age >= 46 && age <= 55) ageGroups['46-55']++;
                    else if (age >= 56) ageGroups['56+']++;
                });
                
                return {
                    labels: Object.keys(ageGroups),
                    datasets: [{
                        data: Object.values(ageGroups),
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']
                    }]
                };
                
            case 'gender':
                const genderGroups = {};
                data.forEach(p => {
                    const gender = p.gender || 'not_informed';
                    genderGroups[gender] = (genderGroups[gender] || 0) + 1;
                });
                
                return {
                    labels: Object.keys(genderGroups),
                    datasets: [{
                        data: Object.values(genderGroups),
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
                    }]
                };
                
            case 'location':
                const locationGroups = {};
                data.forEach(p => {
                    const city = p.city || 'Não informado';
                    locationGroups[city] = (locationGroups[city] || 0) + 1;
                });
                
                return {
                    labels: Object.keys(locationGroups),
                    datasets: [{
                        data: Object.values(locationGroups),
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3']
                    }]
                };
        }
    }

    // Update demographics chart
    updateDemographicsChart() {
        const type = document.getElementById('demographicsType').value;
        this.charts.demographics.data = this.getDemographicsData(type);
        this.charts.demographics.update();
    }

    // Create registration timeline chart
    createRegistrationTimelineChart() {
        const ctx = document.getElementById('registrationTimelineChart').getContext('2d');
        
        this.charts.timeline = new Chart(ctx, {
            type: 'line',
            data: this.getTimelineData('daily'),
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Get timeline data
    getTimelineData(granularity) {
        const data = this.filteredParticipants;
        const timeline = {};
        
        data.forEach(p => {
            const date = new Date(p.registration_date);
            let key;
            
            switch (granularity) {
                case 'daily':
                    key = date.toISOString().split('T')[0];
                    break;
                case 'hourly':
                    key = `${date.toISOString().split('T')[0]} ${date.getHours()}:00`;
                    break;
                case 'weekly':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    key = weekStart.toISOString().split('T')[0];
                    break;
            }
            
            timeline[key] = (timeline[key] || 0) + 1;
        });
        
        const sortedKeys = Object.keys(timeline).sort();
        
        return {
            labels: sortedKeys,
            datasets: [{
                label: 'Inscrições',
                data: sortedKeys.map(key => timeline[key]),
                borderColor: '#4ECDC4',
                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                fill: true
            }]
        };
    }

    // Update registration timeline chart
    updateRegistrationTimelineChart() {
        const granularity = document.getElementById('timelineGranularity').value;
        this.charts.timeline.data = this.getTimelineData(granularity);
        this.charts.timeline.update();
    }

    // Create engagement chart
    createEngagementChart() {
        const ctx = document.getElementById('engagementChart').getContext('2d');
        
        const engagementData = this.getEngagementData();
        
        this.charts.engagement = new Chart(ctx, {
            type: 'radar',
            data: engagementData,
            options: {
                responsive: true,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // Get engagement data
    getEngagementData() {
        const data = this.filteredParticipants;
        const total = data.length;
        
        const metrics = {
            'Taxa de Confirmação': (data.filter(p => p.status === 'confirmed').length / total * 100).toFixed(1),
            'Taxa de Comparecimento': (data.filter(p => p.status === 'attended').length / total * 100).toFixed(1),
            'Taxa de Compra': (data.filter(p => p.total_spent > 0).length / total * 100).toFixed(1),
            'Engajamento Social': Math.random() * 100, // Placeholder
            'Satisfação': Math.random() * 100, // Placeholder
        };
        
        return {
            labels: Object.keys(metrics),
            datasets: [{
                label: 'Engajamento (%)',
                data: Object.values(metrics),
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                pointBackgroundColor: '#FF6B6B'
            }]
        };
    }

    // Create revenue chart
    createRevenueChart() {
        const ctx = document.getElementById('revenueChart').getContext('2d');
        
        this.charts.revenue = new Chart(ctx, {
            type: 'bar',
            data: this.getRevenueData('by_participant'),
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }

    // Get revenue data
    getRevenueData(breakdown) {
        const data = this.filteredParticipants;
        
        switch (breakdown) {
            case 'by_participant':
                const revenueRanges = {
                    'R$ 0': 0,
                    'R$ 1-50': 0,
                    'R$ 51-100': 0,
                    'R$ 101-200': 0,
                    'R$ 200+': 0
                };
                
                data.forEach(p => {
                    const spent = p.total_spent || 0;
                    if (spent === 0) revenueRanges['R$ 0']++;
                    else if (spent <= 50) revenueRanges['R$ 1-50']++;
                    else if (spent <= 100) revenueRanges['R$ 51-100']++;
                    else if (spent <= 200) revenueRanges['R$ 101-200']++;
                    else revenueRanges['R$ 200+']++;
                });
                
                return {
                    labels: Object.keys(revenueRanges),
                    datasets: [{
                        label: 'Número de Participantes',
                        data: Object.values(revenueRanges),
                        backgroundColor: '#45B7D1'
                    }]
                };
        }
    }

    // Update revenue chart
    updateRevenueChart() {
        const breakdown = document.getElementById('revenueBreakdown').value;
        this.charts.revenue.data = this.getRevenueData(breakdown);
        this.charts.revenue.update();
    }

    // Create conversion funnel chart
    createConversionFunnelChart() {
        const ctx = document.getElementById('conversionFunnelChart').getContext('2d');
        
        const funnelData = this.getFunnelData();
        
        this.charts.funnel = new Chart(ctx, {
            type: 'bar',
            data: funnelData,
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Get funnel data
    getFunnelData() {
        const data = this.filteredParticipants;
        const total = this.participants.length;
        
        const stages = {
            'Visitantes': total * 3, // Estimated
            'Inscritos': data.length,
            'Confirmados': data.filter(p => p.status === 'confirmed').length,
            'Compareceram': data.filter(p => p.status === 'attended').length,
            'Compraram Fotos': data.filter(p => p.total_spent > 0).length
        };
        
        return {
            labels: Object.keys(stages),
            datasets: [{
                data: Object.values(stages),
                backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57']
            }]
        };
    }

    // Create activity heatmap
    createActivityHeatmap() {
        const container = document.getElementById('activityHeatmap');
        const heatmapData = this.getHeatmapData();
        
        container.innerHTML = this.generateHeatmapHTML(heatmapData);
    }

    // Get heatmap data
    getHeatmapData() {
        const data = this.filteredParticipants;
        const heatmap = {};
        
        // Initialize heatmap structure
        for (let day = 0; day < 7; day++) {
            heatmap[day] = {};
            for (let hour = 0; hour < 24; hour++) {
                heatmap[day][hour] = 0;
            }
        }
        
        // Populate with registration data
        data.forEach(p => {
            const date = new Date(p.registration_date);
            const day = date.getDay();
            const hour = date.getHours();
            heatmap[day][hour]++;
        });
        
        return heatmap;
    }

    // Generate heatmap HTML
    generateHeatmapHTML(heatmapData) {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const maxValue = Math.max(...Object.values(heatmapData).map(day => Math.max(...Object.values(day))));
        
        let html = '<div class="heatmap-grid">';
        
        // Header with hours
        html += '<div class="heatmap-header">';
        html += '<div class="heatmap-cell"></div>'; // Empty corner
        for (let hour = 0; hour < 24; hour++) {
            html += `<div class="heatmap-cell hour-label">${hour}</div>`;
        }
        html += '</div>';
        
        // Days and data
        for (let day = 0; day < 7; day++) {
            html += '<div class="heatmap-row">';
            html += `<div class="heatmap-cell day-label">${days[day]}</div>`;
            
            for (let hour = 0; hour < 24; hour++) {
                const value = heatmapData[day][hour];
                const intensity = maxValue > 0 ? value / maxValue : 0;
                const color = `rgba(69, 183, 209, ${intensity})`;
                
                html += `<div class="heatmap-cell heatmap-data" 
                            style="background-color: ${color}" 
                            title="${days[day]} ${hour}:00 - ${value} inscrições">
                            ${value > 0 ? value : ''}
                         </div>`;
            }
            
            html += '</div>';
        }
        
        html += '</div>';
        return html;
    }

    // Update all charts
    updateCharts() {
        if (this.charts.demographics) {
            this.updateDemographicsChart();
        }
        if (this.charts.timeline) {
            this.updateRegistrationTimelineChart();
        }
        if (this.charts.engagement) {
            this.charts.engagement.data = this.getEngagementData();
            this.charts.engagement.update();
        }
        if (this.charts.revenue) {
            this.updateRevenueChart();
        }
        if (this.charts.funnel) {
            this.charts.funnel.data = this.getFunnelData();
            this.charts.funnel.update();
        }
        
        this.createActivityHeatmap();
    }

    // Update participants table
    updateParticipantsTable() {
        const tbody = document.getElementById('participantsTableBody');
        const pageSize = document.getElementById('tablePageSize').value;
        
        let displayData = [...this.filteredParticipants];
        
        // Apply search filter
        const searchTerm = document.getElementById('participantSearch').value.toLowerCase();
        if (searchTerm) {
            displayData = displayData.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.email.toLowerCase().includes(searchTerm) ||
                p.city.toLowerCase().includes(searchTerm)
            );
        }
        
        // Pagination
        if (pageSize !== 'all') {
            displayData = displayData.slice(0, parseInt(pageSize));
        }
        
        tbody.innerHTML = displayData.map(participant => `
            <tr>
                <td><input type="checkbox" class="participant-checkbox" value="${participant.id}"></td>
                <td>${participant.name}</td>
                <td>${participant.email}</td>
                <td>${participant.age || '-'}</td>
                <td>${participant.city || '-'}</td>
                <td>${this.formatDate(participant.registration_date)}</td>
                <td><span class="badge bg-${this.getStatusColor(participant.status)}">${participant.status}</span></td>
                <td>${participant.photos_purchased || 0}</td>
                <td>R$ ${(participant.total_spent || 0).toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewParticipantDetails('${participant.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="contactParticipant('${participant.id}')">
                        <i class="bi bi-chat"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Get status color
    getStatusColor(status) {
        const colors = {
            registered: 'primary',
            confirmed: 'success',
            attended: 'info',
            no_show: 'warning',
            cancelled: 'danger'
        };
        return colors[status] || 'secondary';
    }

    // Filter participants table
    filterParticipantsTable() {
        this.updateParticipantsTable();
    }

    // Sort participants table
    sortParticipantsTable(column) {
        // Implementation for sorting
        console.log('Sorting by:', column);
    }

    // Toggle select all
    toggleSelectAll(checked) {
        document.querySelectorAll('.participant-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
        });
    }

    // Generate insights
    generateInsights() {
        const insights = this.analyzeData();
        const container = document.getElementById('insightsGrid');
        
        container.innerHTML = insights.map(insight => `
            <div class="insight-card ${insight.type}">
                <div class="insight-icon">
                    <i class="bi ${insight.icon}"></i>
                </div>
                <div class="insight-content">
                    <h6>${insight.title}</h6>
                    <p>${insight.description}</p>
                    ${insight.action ? `<button class="btn btn-sm btn-outline-primary">${insight.action}</button>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Analyze data for insights
    analyzeData() {
        const data = this.filteredParticipants;
        const insights = [];
        
        // Peak registration time
        const hourCounts = {};
        data.forEach(p => {
            const hour = new Date(p.registration_date).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
        
        const peakHour = Object.keys(hourCounts).reduce((a, b) => hourCounts[a] > hourCounts[b] ? a : b);
        
        insights.push({
            type: 'info',
            icon: 'bi-clock',
            title: 'Horário de Pico',
            description: `A maioria das inscrições acontece às ${peakHour}:00. Considere agendar campanhas para este horário.`,
            action: 'Agendar Campanha'
        });
        
        // High-value customers
        const highValueCustomers = data.filter(p => p.total_spent > 100).length;
        if (highValueCustomers > 0) {
            insights.push({
                type: 'success',
                icon: 'bi-star',
                title: 'Clientes Premium',
                description: `${highValueCustomers} participantes gastaram mais de R$ 100. Crie ofertas especiais para este grupo.`,
                action: 'Criar Segmento VIP'
            });
        }
        
        // Low conversion rate
        const conversionRate = (data.filter(p => p.total_spent > 0).length / data.length * 100);
        if (conversionRate < 20) {
            insights.push({
                type: 'warning',
                icon: 'bi-exclamation-triangle',
                title: 'Taxa de Conversão Baixa',
                description: `Apenas ${conversionRate.toFixed(1)}% dos participantes compraram fotos. Considere estratégias de engajamento.`,
                action: 'Ver Sugestões'
            });
        }
        
        return insights;
    }

    // Export functions
    async exportToPDF() {
        if (!window.jsPDF) {
            alert('Biblioteca PDF não carregada. Tente novamente em alguns segundos.');
            return;
        }

        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(20);
        doc.text('Relatório de Analytics do Evento', 20, 30);
        
        // Add event info
        doc.setFontSize(12);
        doc.text(`Evento: ${document.getElementById('eventName').textContent}`, 20, 50);
        doc.text(`Data do Relatório: ${new Date().toLocaleDateString('pt-BR')}`, 20, 60);
        
        // Add metrics
        doc.text('Métricas Principais:', 20, 80);
        doc.text(`Total de Participantes: ${document.getElementById('totalParticipants').textContent}`, 30, 90);
        doc.text(`Confirmados: ${document.getElementById('confirmedParticipants').textContent}`, 30, 100);
        doc.text(`Compraram Fotos: ${document.getElementById('photoPurchasers').textContent}`, 30, 110);
        doc.text(`Receita Total: ${document.getElementById('totalRevenue').textContent}`, 30, 120);
        
        // Add participants table (first page)
        let yPosition = 140;
        doc.text('Lista de Participantes:', 20, yPosition);
        yPosition += 10;
        
        this.filteredParticipants.slice(0, 20).forEach((participant, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 30;
            }
            
            doc.text(`${index + 1}. ${participant.name} - ${participant.email} - R$ ${(participant.total_spent || 0).toFixed(2)}`, 30, yPosition);
            yPosition += 10;
        });
        
        // Save PDF
        doc.save(`relatorio-evento-${this.currentEvent}.pdf`);
    }

    async exportToExcel() {
        if (!window.XLSX) {
            alert('Biblioteca Excel não carregada. Tente novamente em alguns segundos.');
            return;
        }

        const workbook = XLSX.utils.book_new();
        
        // Participants sheet
        const participantsData = this.filteredParticipants.map(p => ({
            'Nome': p.name,
            'Email': p.email,
            'Idade': p.age || '',
            'Gênero': p.gender || '',
            'Cidade': p.city || '',
            'Data de Inscrição': this.formatDate(p.registration_date),
            'Status': p.status,
            'Fotos Compradas': p.photos_purchased || 0,
            'Valor Gasto': p.total_spent || 0
        }));
        
        const participantsSheet = XLSX.utils.json_to_sheet(participantsData);
        XLSX.utils.book_append_sheet(workbook, participantsSheet, 'Participantes');
        
        // Summary sheet
        const summaryData = [
            ['Métrica', 'Valor'],
            ['Total de Participantes', document.getElementById('totalParticipants').textContent],
            ['Confirmados', document.getElementById('confirmedParticipants').textContent],
            ['Compraram Fotos', document.getElementById('photoPurchasers').textContent],
            ['Receita Total', document.getElementById('totalRevenue').textContent]
        ];
        
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Resumo');
        
        // Save Excel file
        XLSX.writeFile(workbook, `dados-evento-${this.currentEvent}.xlsx`);
    }

    exportParticipantsList() {
        const selectedParticipants = this.getSelectedParticipants();
        const dataToExport = selectedParticipants.length > 0 ? selectedParticipants : this.filteredParticipants;
        
        this.exportToExcel();
    }

    exportCustomReport() {
        const modal = new bootstrap.Modal(document.getElementById('exportModal'));
        modal.show();
    }

    executeCustomExport() {
        const format = document.querySelector('input[name="exportFormat"]:checked').value;
        const options = {
            basicInfo: document.getElementById('exportBasicInfo').checked,
            demographics: document.getElementById('exportDemographics').checked,
            purchases: document.getElementById('exportPurchases').checked,
            engagement: document.getElementById('exportEngagement').checked,
            charts: document.getElementById('exportCharts').checked
        };
        
        switch (format) {
            case 'pdf':
                this.exportCustomPDF(options);
                break;
            case 'excel':
                this.exportCustomExcel(options);
                break;
            case 'csv':
                this.exportCustomCSV(options);
                break;
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('exportModal'));
        modal.hide();
    }

    exportCustomPDF(options) {
        // Implementation for custom PDF export
        this.exportToPDF();
    }

    exportCustomExcel(options) {
        // Implementation for custom Excel export
        this.exportToExcel();
    }

    exportCustomCSV(options) {
        const csvData = this.filteredParticipants.map(p => [
            p.name,
            p.email,
            p.age || '',
            p.gender || '',
            p.city || '',
            this.formatDate(p.registration_date),
            p.status,
            p.photos_purchased || 0,
            p.total_spent || 0
        ]);
        
        csvData.unshift(['Nome', 'Email', 'Idade', 'Gênero', 'Cidade', 'Data de Inscrição', 'Status', 'Fotos Compradas', 'Valor Gasto']);
        
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `participantes-evento-${this.currentEvent}.csv`;
        a.click();
        
        window.URL.revokeObjectURL(url);
    }

    // Get selected participants
    getSelectedParticipants() {
        const selectedIds = Array.from(document.querySelectorAll('.participant-checkbox:checked'))
            .map(checkbox => checkbox.value);
        
        return this.filteredParticipants.filter(p => selectedIds.includes(p.id));
    }

    // Refresh dashboard
    refreshDashboard() {
        this.loadEventData();
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
function refreshDashboard() {
    eventAnalytics.refreshDashboard();
}

function exportToPDF() {
    eventAnalytics.exportToPDF();
}

function exportToExcel() {
    eventAnalytics.exportToExcel();
}

function exportParticipantsList() {
    eventAnalytics.exportParticipantsList();
}

function exportCustomReport() {
    eventAnalytics.exportCustomReport();
}

function executeCustomExport() {
    eventAnalytics.executeCustomExport();
}

function applyQuickFilter(filterType) {
    eventAnalytics.applyQuickFilter(filterType);
}

function resetFilters() {
    eventAnalytics.resetFilters();
}

function viewParticipantDetails(participantId) {
    // Implementation for viewing participant details
    alert(`Ver detalhes do participante ${participantId} - Em desenvolvimento`);
}

function contactParticipant(participantId) {
    // Implementation for contacting participant
    alert(`Contatar participante ${participantId} - Em desenvolvimento`);
}

// Initialize analytics dashboard
const eventAnalytics = new EventAnalyticsDashboard();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventAnalyticsDashboard;
}

