// SEO Optimization Tools for Fotos63
// Ferramentas de SEO e Otimização de Galeria

class SEOOptimizationSystem {
    constructor() {
        this.seoData = {};
        this.galleryOptimizations = {};
        this.keywords = [];
        this.competitors = [];
        this.initializeSystem();
    }

    initializeSystem() {
        this.loadSEOData();
        this.setupMetaTags();
        this.initializeImageOptimization();
        this.setupStructuredData();
    }

    // Create SEO optimization interface
    createSEOInterface(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="seo-optimization">
                <div class="seo-header">
                    <h3><i class="bi bi-search"></i> SEO & Otimização</h3>
                    <button class="btn btn-primary" onclick="runSEOAudit()">
                        <i class="bi bi-speedometer2"></i> Auditoria SEO
                    </button>
                </div>

                <!-- SEO Dashboard -->
                <div class="seo-dashboard">
                    <div class="seo-score-card">
                        <div class="score-circle" id="seoScore">
                            <span class="score-number">0</span>
                            <span class="score-label">SEO Score</span>
                        </div>
                        <div class="score-details">
                            <div class="score-item">
                                <span class="label">Técnico</span>
                                <div class="progress">
                                    <div class="progress-bar bg-success" id="technicalScore" style="width: 0%"></div>
                                </div>
                            </div>
                            <div class="score-item">
                                <span class="label">Conteúdo</span>
                                <div class="progress">
                                    <div class="progress-bar bg-info" id="contentScore" style="width: 0%"></div>
                                </div>
                            </div>
                            <div class="score-item">
                                <span class="label">Performance</span>
                                <div class="progress">
                                    <div class="progress-bar bg-warning" id="performanceScore" style="width: 0%"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="seo-metrics">
                        <div class="metric-card">
                            <i class="bi bi-eye"></i>
                            <h4 id="organicTraffic">0</h4>
                            <p>Tráfego Orgânico</p>
                        </div>
                        <div class="metric-card">
                            <i class="bi bi-graph-up"></i>
                            <h4 id="keywordRankings">0</h4>
                            <p>Palavras-chave Rankeadas</p>
                        </div>
                        <div class="metric-card">
                            <i class="bi bi-link-45deg"></i>
                            <h4 id="backlinks">0</h4>
                            <p>Backlinks</p>
                        </div>
                        <div class="metric-card">
                            <i class="bi bi-speedometer"></i>
                            <h4 id="pageSpeed">0s</h4>
                            <p>Velocidade da Página</p>
                        </div>
                    </div>
                </div>

                <!-- SEO Tabs -->
                <div class="seo-tabs">
                    <button class="tab-btn active" data-tab="keywords">Palavras-chave</button>
                    <button class="tab-btn" data-tab="content">Otimização de Conteúdo</button>
                    <button class="tab-btn" data-tab="technical">SEO Técnico</button>
                    <button class="tab-btn" data-tab="gallery">Otimização de Galeria</button>
                    <button class="tab-btn" data-tab="analytics">Analytics SEO</button>
                </div>

                <!-- Keywords Tab -->
                <div class="tab-content active" id="keywords-tab">
                    <div class="keywords-section">
                        <div class="keywords-header">
                            <h5>Pesquisa de Palavras-chave</h5>
                            <button class="btn btn-outline-primary" onclick="researchKeywords()">
                                <i class="bi bi-search"></i> Pesquisar Palavras-chave
                            </button>
                        </div>

                        <div class="keyword-research">
                            <div class="search-input">
                                <input type="text" class="form-control" id="keywordInput" placeholder="Digite uma palavra-chave...">
                                <button class="btn btn-primary" onclick="analyzeKeyword()">Analisar</button>
                            </div>
                        </div>

                        <div class="keywords-table">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Palavra-chave</th>
                                        <th>Volume de Busca</th>
                                        <th>Dificuldade</th>
                                        <th>CPC</th>
                                        <th>Posição Atual</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="keywordsTableBody">
                                    <!-- Keywords data will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- Content Optimization Tab -->
                <div class="tab-content" id="content-tab">
                    <div class="content-optimization">
                        <h5>Otimização de Conteúdo</h5>
                        
                        <div class="content-analyzer">
                            <div class="form-group">
                                <label>URL da Página</label>
                                <input type="url" class="form-control" id="pageUrl" placeholder="https://fotos63.com/galeria/casamento">
                            </div>
                            
                            <div class="form-group">
                                <label>Palavra-chave Principal</label>
                                <input type="text" class="form-control" id="primaryKeyword" placeholder="fotografia de casamento">
                            </div>
                            
                            <button class="btn btn-primary" onclick="analyzeContent()">
                                <i class="bi bi-search"></i> Analisar Conteúdo
                            </button>
                        </div>

                        <div class="content-suggestions" id="contentSuggestions">
                            <!-- Content suggestions will be shown here -->
                        </div>
                    </div>
                </div>

                <!-- Technical SEO Tab -->
                <div class="tab-content" id="technical-tab">
                    <div class="technical-seo">
                        <h5>SEO Técnico</h5>
                        
                        <div class="technical-checklist">
                            <div class="checklist-item">
                                <input type="checkbox" id="sitemap" checked>
                                <label for="sitemap">Sitemap XML</label>
                                <span class="status success">✓</span>
                            </div>
                            
                            <div class="checklist-item">
                                <input type="checkbox" id="robotstxt" checked>
                                <label for="robotstxt">Robots.txt</label>
                                <span class="status success">✓</span>
                            </div>
                            
                            <div class="checklist-item">
                                <input type="checkbox" id="ssl" checked>
                                <label for="ssl">Certificado SSL</label>
                                <span class="status success">✓</span>
                            </div>
                            
                            <div class="checklist-item">
                                <input type="checkbox" id="mobileFriendly" checked>
                                <label for="mobileFriendly">Mobile-Friendly</label>
                                <span class="status success">✓</span>
                            </div>
                            
                            <div class="checklist-item">
                                <input type="checkbox" id="pageSpeed">
                                <label for="pageSpeed">Velocidade da Página</label>
                                <span class="status warning">⚠</span>
                            </div>
                            
                            <div class="checklist-item">
                                <input type="checkbox" id="structuredData">
                                <label for="structuredData">Dados Estruturados</label>
                                <span class="status error">✗</span>
                            </div>
                        </div>

                        <div class="technical-tools">
                            <button class="btn btn-outline-primary" onclick="generateSitemap()">
                                <i class="bi bi-file-code"></i> Gerar Sitemap
                            </button>
                            <button class="btn btn-outline-primary" onclick="testPageSpeed()">
                                <i class="bi bi-speedometer2"></i> Testar Velocidade
                            </button>
                            <button class="btn btn-outline-primary" onclick="validateStructuredData()">
                                <i class="bi bi-code-square"></i> Validar Schema
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Gallery Optimization Tab -->
                <div class="tab-content" id="gallery-tab">
                    <div class="gallery-optimization">
                        <h5>Otimização de Galeria</h5>
                        
                        <div class="optimization-tools">
                            <div class="tool-card">
                                <h6><i class="bi bi-image"></i> Otimização de Imagens</h6>
                                <p>Compressão automática e redimensionamento</p>
                                <div class="tool-stats">
                                    <span>Economia: <strong>45%</strong></span>
                                    <span>Imagens otimizadas: <strong>1,234</strong></span>
                                </div>
                                <button class="btn btn-sm btn-primary" onclick="optimizeImages()">Otimizar Todas</button>
                            </div>

                            <div class="tool-card">
                                <h6><i class="bi bi-tags"></i> Alt Text Automático</h6>
                                <p>Geração automática de texto alternativo</p>
                                <div class="tool-stats">
                                    <span>Cobertura: <strong>78%</strong></span>
                                    <span>Imagens sem alt: <strong>156</strong></span>
                                </div>
                                <button class="btn btn-sm btn-primary" onclick="generateAltText()">Gerar Alt Text</button>
                            </div>

                            <div class="tool-card">
                                <h6><i class="bi bi-lightning"></i> Lazy Loading</h6>
                                <p>Carregamento sob demanda de imagens</p>
                                <div class="tool-stats">
                                    <span>Melhoria: <strong>60%</strong></span>
                                    <span>Status: <strong class="text-success">Ativo</strong></span>
                                </div>
                                <button class="btn btn-sm btn-outline-secondary" disabled>Configurado</button>
                            </div>

                            <div class="tool-card">
                                <h6><i class="bi bi-globe"></i> CDN Integration</h6>
                                <p>Distribuição global de conteúdo</p>
                                <div class="tool-stats">
                                    <span>Latência: <strong>-40%</strong></span>
                                    <span>Regiões: <strong>12</strong></span>
                                </div>
                                <button class="btn btn-sm btn-success" onclick="configureCDN()">Configurar CDN</button>
                            </div>
                        </div>

                        <div class="gallery-seo-tips">
                            <h6>Dicas de SEO para Galerias</h6>
                            <ul class="tips-list">
                                <li><i class="bi bi-check-circle text-success"></i> Use nomes de arquivo descritivos</li>
                                <li><i class="bi bi-check-circle text-success"></i> Adicione alt text relevante</li>
                                <li><i class="bi bi-check-circle text-success"></i> Otimize o tamanho das imagens</li>
                                <li><i class="bi bi-check-circle text-success"></i> Use formatos modernos (WebP, AVIF)</li>
                                <li><i class="bi bi-check-circle text-success"></i> Implemente lazy loading</li>
                                <li><i class="bi bi-check-circle text-success"></i> Crie sitemaps de imagens</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Analytics Tab -->
                <div class="tab-content" id="analytics-tab">
                    <div class="seo-analytics">
                        <h5>Analytics SEO</h5>
                        
                        <div class="analytics-charts">
                            <div class="chart-container">
                                <h6>Tráfego Orgânico</h6>
                                <canvas id="organicTrafficChart"></canvas>
                            </div>
                            
                            <div class="chart-container">
                                <h6>Posições das Palavras-chave</h6>
                                <canvas id="keywordPositionsChart"></canvas>
                            </div>
                        </div>

                        <div class="top-pages">
                            <h6>Páginas com Melhor Performance</h6>
                            <div class="pages-list" id="topPagesList">
                                <!-- Top pages will be loaded here -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupSEOEvents();
        this.loadSEOData();
    }

    // Setup event listeners
    setupSEOEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Keyword input
        document.getElementById('keywordInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.analyzeKeyword();
            }
        });
    }

    // Switch tabs
    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    // Load SEO data
    async loadSEOData() {
        try {
            const response = await fetch('/api/seo/data', {
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });
            
            if (response.ok) {
                this.seoData = await response.json();
                this.updateSEODashboard();
            }
        } catch (error) {
            console.error('Error loading SEO data:', error);
        }
    }

    // Update SEO dashboard
    updateSEODashboard() {
        const data = this.seoData;
        
        // Update SEO score
        document.getElementById('seoScore').querySelector('.score-number').textContent = data.overall_score || 0;
        
        // Update progress bars
        document.getElementById('technicalScore').style.width = `${data.technical_score || 0}%`;
        document.getElementById('contentScore').style.width = `${data.content_score || 0}%`;
        document.getElementById('performanceScore').style.width = `${data.performance_score || 0}%`;
        
        // Update metrics
        document.getElementById('organicTraffic').textContent = this.formatNumber(data.organic_traffic || 0);
        document.getElementById('keywordRankings').textContent = data.keyword_rankings || 0;
        document.getElementById('backlinks').textContent = this.formatNumber(data.backlinks || 0);
        document.getElementById('pageSpeed').textContent = `${data.page_speed || 0}s`;
    }

    // Run SEO audit
    async runSEOAudit() {
        try {
            const response = await fetch('/api/seo/audit', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });
            
            if (response.ok) {
                const auditResults = await response.json();
                this.displayAuditResults(auditResults);
            }
        } catch (error) {
            console.error('Error running SEO audit:', error);
        }
    }

    // Display audit results
    displayAuditResults(results) {
        // Implementation for displaying audit results
        alert('Auditoria SEO concluída! Verifique os resultados no dashboard.');
        this.loadSEOData();
    }

    // Research keywords
    async researchKeywords() {
        const keyword = document.getElementById('keywordInput').value;
        if (!keyword) return;

        try {
            const response = await fetch('/api/seo/keywords/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({ keyword })
            });
            
            if (response.ok) {
                const keywordData = await response.json();
                this.displayKeywordResults(keywordData);
            }
        } catch (error) {
            console.error('Error researching keywords:', error);
        }
    }

    // Display keyword results
    displayKeywordResults(data) {
        const tbody = document.getElementById('keywordsTableBody');
        
        tbody.innerHTML = data.keywords.map(keyword => `
            <tr>
                <td>${keyword.term}</td>
                <td>${this.formatNumber(keyword.search_volume)}</td>
                <td><span class="badge bg-${this.getDifficultyColor(keyword.difficulty)}">${keyword.difficulty}</span></td>
                <td>R$ ${keyword.cpc.toFixed(2)}</td>
                <td>${keyword.current_position || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="trackKeyword('${keyword.term}')">
                        <i class="bi bi-plus"></i> Rastrear
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Get difficulty color
    getDifficultyColor(difficulty) {
        if (difficulty <= 30) return 'success';
        if (difficulty <= 60) return 'warning';
        return 'danger';
    }

    // Analyze keyword
    analyzeKeyword() {
        this.researchKeywords();
    }

    // Analyze content
    async analyzeContent() {
        const url = document.getElementById('pageUrl').value;
        const keyword = document.getElementById('primaryKeyword').value;
        
        if (!url || !keyword) {
            alert('Por favor, preencha a URL e a palavra-chave');
            return;
        }

        try {
            const response = await fetch('/api/seo/content/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({ url, keyword })
            });
            
            if (response.ok) {
                const analysis = await response.json();
                this.displayContentSuggestions(analysis);
            }
        } catch (error) {
            console.error('Error analyzing content:', error);
        }
    }

    // Display content suggestions
    displayContentSuggestions(analysis) {
        const container = document.getElementById('contentSuggestions');
        
        container.innerHTML = `
            <div class="suggestions-list">
                <h6>Sugestões de Otimização</h6>
                ${analysis.suggestions.map(suggestion => `
                    <div class="suggestion-item ${suggestion.priority}">
                        <i class="bi ${this.getSuggestionIcon(suggestion.type)}"></i>
                        <div class="suggestion-content">
                            <h6>${suggestion.title}</h6>
                            <p>${suggestion.description}</p>
                            ${suggestion.action ? `<button class="btn btn-sm btn-outline-primary">${suggestion.action}</button>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Get suggestion icon
    getSuggestionIcon(type) {
        const icons = {
            title: 'bi-type-h1',
            meta: 'bi-tag',
            content: 'bi-file-text',
            images: 'bi-image',
            links: 'bi-link-45deg'
        };
        return icons[type] || 'bi-info-circle';
    }

    // Generate sitemap
    async generateSitemap() {
        try {
            const response = await fetch('/api/seo/sitemap/generate', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });
            
            if (response.ok) {
                alert('Sitemap gerado com sucesso!');
            }
        } catch (error) {
            console.error('Error generating sitemap:', error);
        }
    }

    // Test page speed
    async testPageSpeed() {
        try {
            const response = await fetch('/api/seo/pagespeed/test', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });
            
            if (response.ok) {
                const results = await response.json();
                this.displayPageSpeedResults(results);
            }
        } catch (error) {
            console.error('Error testing page speed:', error);
        }
    }

    // Display page speed results
    displayPageSpeedResults(results) {
        alert(`Velocidade da página: ${results.score}/100\nTempo de carregamento: ${results.load_time}s`);
    }

    // Validate structured data
    async validateStructuredData() {
        try {
            const response = await fetch('/api/seo/schema/validate', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });
            
            if (response.ok) {
                const validation = await response.json();
                this.displaySchemaValidation(validation);
            }
        } catch (error) {
            console.error('Error validating schema:', error);
        }
    }

    // Display schema validation
    displaySchemaValidation(validation) {
        const status = validation.valid ? 'Válido' : 'Inválido';
        alert(`Dados estruturados: ${status}\nErros encontrados: ${validation.errors.length}`);
    }

    // Optimize images
    async optimizeImages() {
        try {
            const response = await fetch('/api/seo/images/optimize', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });
            
            if (response.ok) {
                const results = await response.json();
                alert(`${results.optimized_count} imagens otimizadas!\nEconomia total: ${results.size_reduction}%`);
            }
        } catch (error) {
            console.error('Error optimizing images:', error);
        }
    }

    // Generate alt text
    async generateAltText() {
        try {
            const response = await fetch('/api/seo/images/alt-text', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });
            
            if (response.ok) {
                const results = await response.json();
                alert(`Alt text gerado para ${results.processed_count} imagens!`);
            }
        } catch (error) {
            console.error('Error generating alt text:', error);
        }
    }

    // Configure CDN
    async configureCDN() {
        try {
            const response = await fetch('/api/seo/cdn/configure', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });
            
            if (response.ok) {
                alert('CDN configurado com sucesso!');
            }
        } catch (error) {
            console.error('Error configuring CDN:', error);
        }
    }

    // Track keyword
    async trackKeyword(keyword) {
        try {
            const response = await fetch('/api/seo/keywords/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({ keyword })
            });
            
            if (response.ok) {
                alert(`Palavra-chave "${keyword}" adicionada ao rastreamento!`);
            }
        } catch (error) {
            console.error('Error tracking keyword:', error);
        }
    }

    // Setup meta tags
    setupMetaTags() {
        // Dynamic meta tag management
        this.updateMetaTags({
            title: 'Fotos63 - Marketplace de Fotos do Tocantins',
            description: 'Encontre e compre fotos profissionais de eventos no Tocantins. Fotógrafos locais, qualidade garantida.',
            keywords: 'fotografia, tocantins, eventos, casamento, formatura, fotos profissionais',
            ogTitle: 'Fotos63 - Sua Memória em Foco',
            ogDescription: 'O maior marketplace de fotos do Tocantins',
            ogImage: '/images/og-image.jpg'
        });
    }

    // Update meta tags
    updateMetaTags(tags) {
        // Update title
        if (tags.title) {
            document.title = tags.title;
        }

        // Update meta tags
        this.setMetaTag('description', tags.description);
        this.setMetaTag('keywords', tags.keywords);
        this.setMetaTag('og:title', tags.ogTitle);
        this.setMetaTag('og:description', tags.ogDescription);
        this.setMetaTag('og:image', tags.ogImage);
        this.setMetaTag('twitter:card', 'summary_large_image');
        this.setMetaTag('twitter:title', tags.ogTitle);
        this.setMetaTag('twitter:description', tags.ogDescription);
        this.setMetaTag('twitter:image', tags.ogImage);
    }

    // Set meta tag
    setMetaTag(name, content) {
        if (!content) return;

        let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
        
        if (!meta) {
            meta = document.createElement('meta');
            
            if (name.startsWith('og:') || name.startsWith('twitter:')) {
                meta.setAttribute('property', name);
            } else {
                meta.setAttribute('name', name);
            }
            
            document.head.appendChild(meta);
        }
        
        meta.setAttribute('content', content);
    }

    // Initialize image optimization
    initializeImageOptimization() {
        // Lazy loading implementation
        this.setupLazyLoading();
        
        // WebP format detection and conversion
        this.setupWebPSupport();
        
        // Image compression
        this.setupImageCompression();
    }

    // Setup lazy loading
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Setup WebP support
    setupWebPSupport() {
        const supportsWebP = this.checkWebPSupport();
        
        if (supportsWebP) {
            document.querySelectorAll('img').forEach(img => {
                if (img.src && !img.src.includes('.webp')) {
                    const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    
                    // Check if WebP version exists
                    this.checkImageExists(webpSrc).then(exists => {
                        if (exists) {
                            img.src = webpSrc;
                        }
                    });
                }
            });
        }
    }

    // Check WebP support
    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Check if image exists
    async checkImageExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    // Setup image compression
    setupImageCompression() {
        // Implement client-side image compression for uploads
        document.addEventListener('change', (e) => {
            if (e.target.type === 'file' && e.target.accept && e.target.accept.includes('image')) {
                this.compressImages(e.target.files);
            }
        });
    }

    // Compress images
    async compressImages(files) {
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const compressedFile = await this.compressImage(file);
                // Replace original file with compressed version
                console.log(`Compressed ${file.name}: ${file.size} -> ${compressedFile.size} bytes`);
            }
        }
    }

    // Compress single image
    compressImage(file, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                const maxWidth = 1920;
                const maxHeight = 1080;
                let { width, height } = img;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob(resolve, file.type, quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // Setup structured data
    setupStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Fotos63",
            "description": "Marketplace de fotos profissionais do Tocantins",
            "url": "https://fotos63.com",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://fotos63.com/buscar?q={search_term_string}",
                "query-input": "required name=search_term_string"
            },
            "sameAs": [
                "https://www.facebook.com/fotos63",
                "https://www.instagram.com/fotos63",
                "https://twitter.com/fotos63"
            ]
        };

        this.addStructuredData(structuredData);
    }

    // Add structured data
    addStructuredData(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    // Format number
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }
}

// Global functions
function runSEOAudit() {
    seoOptimization.runSEOAudit();
}

function researchKeywords() {
    seoOptimization.researchKeywords();
}

function analyzeKeyword() {
    seoOptimization.analyzeKeyword();
}

function analyzeContent() {
    seoOptimization.analyzeContent();
}

function generateSitemap() {
    seoOptimization.generateSitemap();
}

function testPageSpeed() {
    seoOptimization.testPageSpeed();
}

function validateStructuredData() {
    seoOptimization.validateStructuredData();
}

function optimizeImages() {
    seoOptimization.optimizeImages();
}

function generateAltText() {
    seoOptimization.generateAltText();
}

function configureCDN() {
    seoOptimization.configureCDN();
}

function trackKeyword(keyword) {
    seoOptimization.trackKeyword(keyword);
}

// Initialize SEO optimization system
const seoOptimization = new SEOOptimizationSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOOptimizationSystem;
}

