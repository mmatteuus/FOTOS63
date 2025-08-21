// Gallery Customization System for Fotos63
// Ferramentas de Personalização de Galeria para Fotógrafos

class GalleryCustomizationSystem {
    constructor() {
        this.currentTheme = null;
        this.customizations = {
            colors: {},
            fonts: {},
            layout: {},
            branding: {},
            social: {}
        };
        this.previewMode = false;
        this.initializeSystem();
    }

    initializeSystem() {
        this.loadPhotographerSettings();
        this.setupEventListeners();
    }

    // Load photographer's current customization settings
    async loadPhotographerSettings() {
        try {
            const response = await fetch('/api/photographer/customization', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                const settings = await response.json();
                this.customizations = { ...this.customizations, ...settings };
                this.currentTheme = settings.theme || 'default';
            }
        } catch (error) {
            console.error('Error loading photographer settings:', error);
        }
    }

    // Save customization settings
    async saveCustomizations() {
        try {
            const response = await fetch('/api/photographer/customization', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    theme: this.currentTheme,
                    customizations: this.customizations,
                    updatedAt: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save customizations');
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving customizations:', error);
            throw error;
        }
    }

    // Create customization interface
    createCustomizationUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = `
            <div class="gallery-customization">
                <div class="customization-header">
                    <h3><i class="bi bi-palette"></i> Personalizar Galeria</h3>
                    <p>Customize sua galeria para refletir sua marca pessoal</p>
                </div>

                <div class="customization-tabs">
                    <button class="tab-button active" data-tab="theme">Tema</button>
                    <button class="tab-button" data-tab="colors">Cores</button>
                    <button class="tab-button" data-tab="typography">Tipografia</button>
                    <button class="tab-button" data-tab="layout">Layout</button>
                    <button class="tab-button" data-tab="branding">Marca</button>
                    <button class="tab-button" data-tab="social">Social</button>
                </div>

                <div class="customization-content">
                    <!-- Theme Tab -->
                    <div class="tab-content active" id="theme-tab">
                        <h4>Escolha um Tema Base</h4>
                        <div class="theme-grid">
                            <div class="theme-option" data-theme="default">
                                <div class="theme-preview default-theme"></div>
                                <span>Padrão</span>
                            </div>
                            <div class="theme-option" data-theme="minimal">
                                <div class="theme-preview minimal-theme"></div>
                                <span>Minimalista</span>
                            </div>
                            <div class="theme-option" data-theme="elegant">
                                <div class="theme-preview elegant-theme"></div>
                                <span>Elegante</span>
                            </div>
                            <div class="theme-option" data-theme="modern">
                                <div class="theme-preview modern-theme"></div>
                                <span>Moderno</span>
                            </div>
                            <div class="theme-option" data-theme="artistic">
                                <div class="theme-preview artistic-theme"></div>
                                <span>Artístico</span>
                            </div>
                            <div class="theme-option" data-theme="professional">
                                <div class="theme-preview professional-theme"></div>
                                <span>Profissional</span>
                            </div>
                        </div>
                    </div>

                    <!-- Colors Tab -->
                    <div class="tab-content" id="colors-tab">
                        <h4>Esquema de Cores</h4>
                        <div class="color-section">
                            <div class="color-group">
                                <label>Cor Primária</label>
                                <input type="color" id="primaryColor" value="#FFD700">
                                <span class="color-preview" id="primaryPreview">#FFD700</span>
                            </div>
                            <div class="color-group">
                                <label>Cor Secundária</label>
                                <input type="color" id="secondaryColor" value="#FF8C00">
                                <span class="color-preview" id="secondaryPreview">#FF8C00</span>
                            </div>
                            <div class="color-group">
                                <label>Cor de Fundo</label>
                                <input type="color" id="backgroundColor" value="#FFFFFF">
                                <span class="color-preview" id="backgroundPreview">#FFFFFF</span>
                            </div>
                            <div class="color-group">
                                <label>Cor do Texto</label>
                                <input type="color" id="textColor" value="#2C2C2C">
                                <span class="color-preview" id="textPreview">#2C2C2C</span>
                            </div>
                        </div>
                        
                        <div class="preset-colors">
                            <h5>Paletas Pré-definidas</h5>
                            <div class="palette-grid">
                                <div class="palette-option" data-palette="sunset">
                                    <div class="palette-colors">
                                        <span style="background: #FF6B35"></span>
                                        <span style="background: #F7931E"></span>
                                        <span style="background: #FFD23F"></span>
                                        <span style="background: #FFFFFF"></span>
                                    </div>
                                    <span>Pôr do Sol</span>
                                </div>
                                <div class="palette-option" data-palette="ocean">
                                    <div class="palette-colors">
                                        <span style="background: #006A6B"></span>
                                        <span style="background: #0E4B99"></span>
                                        <span style="background: #2E8BC0"></span>
                                        <span style="background: #FFFFFF"></span>
                                    </div>
                                    <span>Oceano</span>
                                </div>
                                <div class="palette-option" data-palette="forest">
                                    <div class="palette-colors">
                                        <span style="background: #2D5016"></span>
                                        <span style="background: #61892F"></span>
                                        <span style="background: #86C232"></span>
                                        <span style="background: #FFFFFF"></span>
                                    </div>
                                    <span>Floresta</span>
                                </div>
                                <div class="palette-option" data-palette="monochrome">
                                    <div class="palette-colors">
                                        <span style="background: #000000"></span>
                                        <span style="background: #666666"></span>
                                        <span style="background: #CCCCCC"></span>
                                        <span style="background: #FFFFFF"></span>
                                    </div>
                                    <span>Monocromático</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Typography Tab -->
                    <div class="tab-content" id="typography-tab">
                        <h4>Tipografia</h4>
                        <div class="typography-section">
                            <div class="font-group">
                                <label>Fonte Principal</label>
                                <select id="primaryFont">
                                    <option value="Poppins">Poppins (Padrão)</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Open Sans">Open Sans</option>
                                    <option value="Lato">Lato</option>
                                    <option value="Montserrat">Montserrat</option>
                                    <option value="Playfair Display">Playfair Display</option>
                                    <option value="Merriweather">Merriweather</option>
                                    <option value="Source Sans Pro">Source Sans Pro</option>
                                </select>
                            </div>
                            
                            <div class="font-group">
                                <label>Fonte Secundária</label>
                                <select id="secondaryFont">
                                    <option value="Poppins">Poppins</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Open Sans">Open Sans (Padrão)</option>
                                    <option value="Lato">Lato</option>
                                    <option value="Montserrat">Montserrat</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                </select>
                            </div>

                            <div class="font-size-group">
                                <label>Tamanho do Título</label>
                                <input type="range" id="titleSize" min="24" max="48" value="32">
                                <span id="titleSizeValue">32px</span>
                            </div>

                            <div class="font-size-group">
                                <label>Tamanho do Texto</label>
                                <input type="range" id="textSize" min="12" max="20" value="16">
                                <span id="textSizeValue">16px</span>
                            </div>
                        </div>

                        <div class="typography-preview">
                            <h5>Prévia da Tipografia</h5>
                            <div class="preview-text">
                                <h2 id="previewTitle">Título da Galeria</h2>
                                <p id="previewText">Este é um exemplo de como o texto aparecerá na sua galeria personalizada.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Layout Tab -->
                    <div class="tab-content" id="layout-tab">
                        <h4>Layout da Galeria</h4>
                        <div class="layout-section">
                            <div class="layout-group">
                                <label>Estilo de Grid</label>
                                <div class="grid-options">
                                    <div class="grid-option" data-grid="masonry">
                                        <div class="grid-preview masonry-preview"></div>
                                        <span>Masonry</span>
                                    </div>
                                    <div class="grid-option" data-grid="square">
                                        <div class="grid-preview square-preview"></div>
                                        <span>Quadrado</span>
                                    </div>
                                    <div class="grid-option" data-grid="justified">
                                        <div class="grid-preview justified-preview"></div>
                                        <span>Justificado</span>
                                    </div>
                                    <div class="grid-option" data-grid="list">
                                        <div class="grid-preview list-preview"></div>
                                        <span>Lista</span>
                                    </div>
                                </div>
                            </div>

                            <div class="spacing-group">
                                <label>Espaçamento entre Fotos</label>
                                <input type="range" id="photoSpacing" min="5" max="30" value="15">
                                <span id="spacingValue">15px</span>
                            </div>

                            <div class="columns-group">
                                <label>Colunas (Desktop)</label>
                                <input type="range" id="desktopColumns" min="2" max="6" value="4">
                                <span id="desktopColumnsValue">4</span>
                            </div>

                            <div class="columns-group">
                                <label>Colunas (Mobile)</label>
                                <input type="range" id="mobileColumns" min="1" max="3" value="2">
                                <span id="mobileColumnsValue">2</span>
                            </div>
                        </div>
                    </div>

                    <!-- Branding Tab -->
                    <div class="tab-content" id="branding-tab">
                        <h4>Marca Pessoal</h4>
                        <div class="branding-section">
                            <div class="logo-group">
                                <label>Logo/Avatar</label>
                                <div class="logo-upload">
                                    <div class="logo-preview" id="logoPreview">
                                        <i class="bi bi-person-circle"></i>
                                    </div>
                                    <button class="btn btn-outline-primary" id="uploadLogo">
                                        <i class="bi bi-upload"></i> Upload Logo
                                    </button>
                                    <input type="file" id="logoInput" accept="image/*" style="display: none;">
                                </div>
                            </div>

                            <div class="info-group">
                                <label>Nome/Título da Galeria</label>
                                <input type="text" id="galleryTitle" placeholder="Minha Galeria de Fotos">
                            </div>

                            <div class="info-group">
                                <label>Biografia/Descrição</label>
                                <textarea id="galleryBio" rows="4" placeholder="Conte um pouco sobre seu trabalho..."></textarea>
                            </div>

                            <div class="contact-group">
                                <label>Informações de Contato</label>
                                <input type="email" id="contactEmail" placeholder="seu@email.com">
                                <input type="tel" id="contactPhone" placeholder="(63) 99999-9999">
                                <input type="text" id="contactWebsite" placeholder="www.seusite.com">
                            </div>
                        </div>
                    </div>

                    <!-- Social Tab -->
                    <div class="tab-content" id="social-tab">
                        <h4>Redes Sociais</h4>
                        <div class="social-section">
                            <div class="social-group">
                                <label><i class="bi bi-instagram"></i> Instagram</label>
                                <input type="text" id="instagramHandle" placeholder="@seuinstagram">
                            </div>

                            <div class="social-group">
                                <label><i class="bi bi-facebook"></i> Facebook</label>
                                <input type="url" id="facebookUrl" placeholder="https://facebook.com/seuperfil">
                            </div>

                            <div class="social-group">
                                <label><i class="bi bi-twitter"></i> Twitter</label>
                                <input type="text" id="twitterHandle" placeholder="@seutwitter">
                            </div>

                            <div class="social-group">
                                <label><i class="bi bi-linkedin"></i> LinkedIn</label>
                                <input type="url" id="linkedinUrl" placeholder="https://linkedin.com/in/seuperfil">
                            </div>

                            <div class="social-group">
                                <label><i class="bi bi-youtube"></i> YouTube</label>
                                <input type="url" id="youtubeUrl" placeholder="https://youtube.com/c/seucanal">
                            </div>

                            <div class="social-group">
                                <label><i class="bi bi-whatsapp"></i> WhatsApp</label>
                                <input type="tel" id="whatsappNumber" placeholder="(63) 99999-9999">
                            </div>
                        </div>

                        <div class="social-display">
                            <h5>Exibição das Redes Sociais</h5>
                            <div class="display-options">
                                <label>
                                    <input type="radio" name="socialDisplay" value="icons" checked>
                                    Apenas Ícones
                                </label>
                                <label>
                                    <input type="radio" name="socialDisplay" value="buttons">
                                    Botões com Texto
                                </label>
                                <label>
                                    <input type="radio" name="socialDisplay" value="list">
                                    Lista Vertical
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="customization-actions">
                    <button class="btn btn-outline-secondary" id="previewGallery">
                        <i class="bi bi-eye"></i> Visualizar
                    </button>
                    <button class="btn btn-secondary" id="resetCustomizations">
                        <i class="bi bi-arrow-clockwise"></i> Resetar
                    </button>
                    <button class="btn btn-primary" id="saveCustomizations">
                        <i class="bi bi-check-lg"></i> Salvar Alterações
                    </button>
                </div>

                <div class="gallery-preview" id="galleryPreview" style="display: none;">
                    <div class="preview-header">
                        <h4>Prévia da Galeria</h4>
                        <button class="btn btn-sm btn-outline-secondary" id="closePreview">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                    <div class="preview-content" id="previewContent">
                        <!-- Preview will be generated here -->
                    </div>
                </div>
            </div>
        `;

        this.setupCustomizationEvents();
        this.loadCurrentSettings();
    }

    // Setup event listeners for customization interface
    setupCustomizationEvents() {
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Theme selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectTheme(e.currentTarget.dataset.theme);
            });
        });

        // Color inputs
        document.querySelectorAll('input[type="color"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateColor(e.target.id, e.target.value);
            });
        });

        // Palette selection
        document.querySelectorAll('.palette-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.applyColorPalette(e.currentTarget.dataset.palette);
            });
        });

        // Font changes
        document.getElementById('primaryFont').addEventListener('change', (e) => {
            this.updateFont('primary', e.target.value);
        });

        document.getElementById('secondaryFont').addEventListener('change', (e) => {
            this.updateFont('secondary', e.target.value);
        });

        // Font size ranges
        document.getElementById('titleSize').addEventListener('input', (e) => {
            this.updateFontSize('title', e.target.value);
        });

        document.getElementById('textSize').addEventListener('input', (e) => {
            this.updateFontSize('text', e.target.value);
        });

        // Layout options
        document.querySelectorAll('.grid-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectGridStyle(e.currentTarget.dataset.grid);
            });
        });

        // Spacing and columns
        document.getElementById('photoSpacing').addEventListener('input', (e) => {
            this.updateSpacing(e.target.value);
        });

        document.getElementById('desktopColumns').addEventListener('input', (e) => {
            this.updateColumns('desktop', e.target.value);
        });

        document.getElementById('mobileColumns').addEventListener('input', (e) => {
            this.updateColumns('mobile', e.target.value);
        });

        // Logo upload
        document.getElementById('uploadLogo').addEventListener('click', () => {
            document.getElementById('logoInput').click();
        });

        document.getElementById('logoInput').addEventListener('change', (e) => {
            this.handleLogoUpload(e.target.files[0]);
        });

        // Action buttons
        document.getElementById('previewGallery').addEventListener('click', () => {
            this.showGalleryPreview();
        });

        document.getElementById('resetCustomizations').addEventListener('click', () => {
            this.resetToDefaults();
        });

        document.getElementById('saveCustomizations').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('closePreview').addEventListener('click', () => {
            this.closeGalleryPreview();
        });
    }

    // Switch between customization tabs
    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    // Select theme
    selectTheme(themeName) {
        this.currentTheme = themeName;
        
        // Update UI
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-theme="${themeName}"]`).classList.add('selected');

        // Apply theme defaults
        this.applyThemeDefaults(themeName);
    }

    // Apply theme defaults
    applyThemeDefaults(themeName) {
        const themes = {
            default: {
                colors: { primary: '#FFD700', secondary: '#FF8C00', background: '#FFFFFF', text: '#2C2C2C' },
                fonts: { primary: 'Poppins', secondary: 'Open Sans' }
            },
            minimal: {
                colors: { primary: '#000000', secondary: '#666666', background: '#FFFFFF', text: '#333333' },
                fonts: { primary: 'Roboto', secondary: 'Roboto' }
            },
            elegant: {
                colors: { primary: '#8B4513', secondary: '#D2691E', background: '#FFF8DC', text: '#2F4F4F' },
                fonts: { primary: 'Playfair Display', secondary: 'Merriweather' }
            },
            modern: {
                colors: { primary: '#4A90E2', secondary: '#7ED321', background: '#F5F5F5', text: '#2C3E50' },
                fonts: { primary: 'Montserrat', secondary: 'Lato' }
            },
            artistic: {
                colors: { primary: '#E74C3C', secondary: '#F39C12', background: '#2C3E50', text: '#ECF0F1' },
                fonts: { primary: 'Playfair Display', secondary: 'Georgia' }
            },
            professional: {
                colors: { primary: '#2C3E50', secondary: '#3498DB', background: '#FFFFFF', text: '#2C3E50' },
                fonts: { primary: 'Source Sans Pro', secondary: 'Source Sans Pro' }
            }
        };

        const theme = themes[themeName] || themes.default;
        
        // Update color inputs
        document.getElementById('primaryColor').value = theme.colors.primary;
        document.getElementById('secondaryColor').value = theme.colors.secondary;
        document.getElementById('backgroundColor').value = theme.colors.background;
        document.getElementById('textColor').value = theme.colors.text;

        // Update font selects
        document.getElementById('primaryFont').value = theme.fonts.primary;
        document.getElementById('secondaryFont').value = theme.fonts.secondary;

        // Update customizations object
        this.customizations.colors = theme.colors;
        this.customizations.fonts = theme.fonts;

        // Update previews
        this.updateColorPreviews();
        this.updateTypographyPreview();
    }

    // Update color and preview
    updateColor(colorId, value) {
        const colorMap = {
            primaryColor: 'primary',
            secondaryColor: 'secondary',
            backgroundColor: 'background',
            textColor: 'text'
        };

        const colorKey = colorMap[colorId];
        if (colorKey) {
            this.customizations.colors[colorKey] = value;
            document.getElementById(`${colorKey}Preview`).textContent = value;
        }
    }

    // Update color previews
    updateColorPreviews() {
        Object.entries(this.customizations.colors).forEach(([key, value]) => {
            const preview = document.getElementById(`${key}Preview`);
            if (preview) {
                preview.textContent = value;
            }
        });
    }

    // Apply color palette
    applyColorPalette(paletteName) {
        const palettes = {
            sunset: { primary: '#FF6B35', secondary: '#F7931E', background: '#FFFFFF', text: '#2C2C2C' },
            ocean: { primary: '#006A6B', secondary: '#2E8BC0', background: '#FFFFFF', text: '#2C2C2C' },
            forest: { primary: '#2D5016', secondary: '#86C232', background: '#FFFFFF', text: '#2C2C2C' },
            monochrome: { primary: '#000000', secondary: '#666666', background: '#FFFFFF', text: '#2C2C2C' }
        };

        const palette = palettes[paletteName];
        if (palette) {
            this.customizations.colors = palette;
            
            // Update color inputs
            Object.entries(palette).forEach(([key, value]) => {
                const input = document.getElementById(`${key}Color`);
                if (input) {
                    input.value = value;
                }
            });

            this.updateColorPreviews();
        }
    }

    // Update font
    updateFont(type, fontFamily) {
        this.customizations.fonts[type] = fontFamily;
        this.updateTypographyPreview();
    }

    // Update font size
    updateFontSize(type, size) {
        this.customizations.fonts[`${type}Size`] = `${size}px`;
        document.getElementById(`${type}SizeValue`).textContent = `${size}px`;
        this.updateTypographyPreview();
    }

    // Update typography preview
    updateTypographyPreview() {
        const previewTitle = document.getElementById('previewTitle');
        const previewText = document.getElementById('previewText');

        if (previewTitle && previewText) {
            previewTitle.style.fontFamily = this.customizations.fonts.primary || 'Poppins';
            previewTitle.style.fontSize = this.customizations.fonts.titleSize || '32px';
            
            previewText.style.fontFamily = this.customizations.fonts.secondary || 'Open Sans';
            previewText.style.fontSize = this.customizations.fonts.textSize || '16px';
        }
    }

    // Select grid style
    selectGridStyle(gridStyle) {
        this.customizations.layout.gridStyle = gridStyle;
        
        // Update UI
        document.querySelectorAll('.grid-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-grid="${gridStyle}"]`).classList.add('selected');
    }

    // Update spacing
    updateSpacing(value) {
        this.customizations.layout.photoSpacing = `${value}px`;
        document.getElementById('spacingValue').textContent = `${value}px`;
    }

    // Update columns
    updateColumns(device, value) {
        this.customizations.layout[`${device}Columns`] = parseInt(value);
        document.getElementById(`${device}ColumnsValue`).textContent = value;
    }

    // Handle logo upload
    async handleLogoUpload(file) {
        if (!file) return;

        try {
            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('Por favor, selecione um arquivo de imagem válido');
            }

            if (file.size > 2 * 1024 * 1024) {
                throw new Error('O arquivo deve ter no máximo 2MB');
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const logoPreview = document.getElementById('logoPreview');
                logoPreview.innerHTML = `<img src="${e.target.result}" alt="Logo" style="max-width: 100%; max-height: 100%; border-radius: 8px;">`;
            };
            reader.readAsDataURL(file);

            // Upload to server
            const formData = new FormData();
            formData.append('logo', file);

            const response = await fetch('/api/photographer/logo', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erro ao fazer upload do logo');
            }

            const result = await response.json();
            this.customizations.branding.logoUrl = result.logoUrl;

        } catch (error) {
            console.error('Logo upload error:', error);
            alert(error.message);
        }
    }

    // Show gallery preview
    showGalleryPreview() {
        const previewDiv = document.getElementById('galleryPreview');
        const previewContent = document.getElementById('previewContent');

        // Generate preview HTML
        previewContent.innerHTML = this.generateGalleryPreview();
        
        // Apply customizations to preview
        this.applyCustomizationsToPreview();
        
        previewDiv.style.display = 'block';
        this.previewMode = true;
    }

    // Generate gallery preview HTML
    generateGalleryPreview() {
        return `
            <div class="preview-gallery" id="previewGalleryContainer">
                <header class="gallery-header">
                    <div class="gallery-branding">
                        <div class="gallery-logo">
                            ${this.customizations.branding.logoUrl ? 
                                `<img src="${this.customizations.branding.logoUrl}" alt="Logo">` : 
                                '<i class="bi bi-person-circle"></i>'
                            }
                        </div>
                        <div class="gallery-info">
                            <h1 class="gallery-title">${document.getElementById('galleryTitle').value || 'Minha Galeria'}</h1>
                            <p class="gallery-bio">${document.getElementById('galleryBio').value || 'Fotógrafo profissional'}</p>
                        </div>
                    </div>
                    <div class="gallery-social">
                        ${this.generateSocialLinks()}
                    </div>
                </header>
                
                <div class="gallery-grid">
                    ${this.generateSamplePhotos()}
                </div>
                
                <footer class="gallery-footer">
                    <div class="contact-info">
                        <p><i class="bi bi-envelope"></i> ${document.getElementById('contactEmail').value || 'contato@exemplo.com'}</p>
                        <p><i class="bi bi-telephone"></i> ${document.getElementById('contactPhone').value || '(63) 99999-9999'}</p>
                    </div>
                </footer>
            </div>
        `;
    }

    // Generate social links for preview
    generateSocialLinks() {
        const socialInputs = {
            instagram: document.getElementById('instagramHandle').value,
            facebook: document.getElementById('facebookUrl').value,
            twitter: document.getElementById('twitterHandle').value,
            linkedin: document.getElementById('linkedinUrl').value,
            youtube: document.getElementById('youtubeUrl').value,
            whatsapp: document.getElementById('whatsappNumber').value
        };

        const socialIcons = {
            instagram: 'bi-instagram',
            facebook: 'bi-facebook',
            twitter: 'bi-twitter',
            linkedin: 'bi-linkedin',
            youtube: 'bi-youtube',
            whatsapp: 'bi-whatsapp'
        };

        let socialHTML = '';
        Object.entries(socialInputs).forEach(([platform, value]) => {
            if (value) {
                socialHTML += `<a href="#" class="social-link"><i class="bi ${socialIcons[platform]}"></i></a>`;
            }
        });

        return socialHTML;
    }

    // Generate sample photos for preview
    generateSamplePhotos() {
        const samplePhotos = [
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        ];

        return samplePhotos.map(url => `
            <div class="gallery-item">
                <img src="${url}" alt="Sample Photo" loading="lazy">
                <div class="photo-overlay">
                    <button class="btn btn-sm btn-primary">Ver Foto</button>
                </div>
            </div>
        `).join('');
    }

    // Apply customizations to preview
    applyCustomizationsToPreview() {
        const previewContainer = document.getElementById('previewGalleryContainer');
        if (!previewContainer) return;

        const style = document.createElement('style');
        style.textContent = this.generateCustomCSS();
        previewContainer.appendChild(style);
    }

    // Generate custom CSS based on customizations
    generateCustomCSS() {
        const { colors, fonts, layout } = this.customizations;
        
        return `
            .preview-gallery {
                background-color: ${colors.background || '#FFFFFF'};
                color: ${colors.text || '#2C2C2C'};
                font-family: ${fonts.secondary || 'Open Sans'}, sans-serif;
                padding: 2rem;
            }
            
            .gallery-title {
                color: ${colors.primary || '#FFD700'};
                font-family: ${fonts.primary || 'Poppins'}, sans-serif;
                font-size: ${fonts.titleSize || '32px'};
            }
            
            .gallery-bio {
                font-size: ${fonts.textSize || '16px'};
            }
            
            .gallery-grid {
                display: grid;
                grid-template-columns: repeat(${layout.desktopColumns || 4}, 1fr);
                gap: ${layout.photoSpacing || '15px'};
                margin: 2rem 0;
            }
            
            .gallery-item {
                position: relative;
                overflow: hidden;
                border-radius: 8px;
                aspect-ratio: 1;
            }
            
            .gallery-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }
            
            .gallery-item:hover img {
                transform: scale(1.05);
            }
            
            .photo-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .gallery-item:hover .photo-overlay {
                opacity: 1;
            }
            
            .social-link {
                color: ${colors.secondary || '#FF8C00'};
                font-size: 1.5rem;
                margin: 0 0.5rem;
                text-decoration: none;
                transition: color 0.3s ease;
            }
            
            .social-link:hover {
                color: ${colors.primary || '#FFD700'};
            }
            
            @media (max-width: 768px) {
                .gallery-grid {
                    grid-template-columns: repeat(${layout.mobileColumns || 2}, 1fr);
                }
            }
        `;
    }

    // Close gallery preview
    closeGalleryPreview() {
        document.getElementById('galleryPreview').style.display = 'none';
        this.previewMode = false;
    }

    // Reset to default settings
    resetToDefaults() {
        if (confirm('Tem certeza que deseja resetar todas as personalizações?')) {
            this.customizations = {
                colors: { primary: '#FFD700', secondary: '#FF8C00', background: '#FFFFFF', text: '#2C2C2C' },
                fonts: { primary: 'Poppins', secondary: 'Open Sans', titleSize: '32px', textSize: '16px' },
                layout: { gridStyle: 'masonry', photoSpacing: '15px', desktopColumns: 4, mobileColumns: 2 },
                branding: {},
                social: {}
            };
            
            this.currentTheme = 'default';
            this.loadCurrentSettings();
        }
    }

    // Load current settings into UI
    loadCurrentSettings() {
        // Load colors
        Object.entries(this.customizations.colors || {}).forEach(([key, value]) => {
            const input = document.getElementById(`${key}Color`);
            if (input) {
                input.value = value;
            }
        });

        // Load fonts
        if (this.customizations.fonts) {
            const primaryFont = document.getElementById('primaryFont');
            const secondaryFont = document.getElementById('secondaryFont');
            
            if (primaryFont) primaryFont.value = this.customizations.fonts.primary || 'Poppins';
            if (secondaryFont) secondaryFont.value = this.customizations.fonts.secondary || 'Open Sans';
        }

        // Update all previews
        this.updateColorPreviews();
        this.updateTypographyPreview();
    }

    // Save settings
    async saveSettings() {
        try {
            // Collect all form data
            this.collectFormData();
            
            // Save to server
            await this.saveCustomizations();
            
            alert('Personalizações salvas com sucesso!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erro ao salvar personalizações: ' + error.message);
        }
    }

    // Collect form data
    collectFormData() {
        // Collect branding info
        this.customizations.branding = {
            ...this.customizations.branding,
            title: document.getElementById('galleryTitle').value,
            bio: document.getElementById('galleryBio').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            website: document.getElementById('contactWebsite').value
        };

        // Collect social info
        this.customizations.social = {
            instagram: document.getElementById('instagramHandle').value,
            facebook: document.getElementById('facebookUrl').value,
            twitter: document.getElementById('twitterHandle').value,
            linkedin: document.getElementById('linkedinUrl').value,
            youtube: document.getElementById('youtubeUrl').value,
            whatsapp: document.getElementById('whatsappNumber').value,
            display: document.querySelector('input[name="socialDisplay"]:checked').value
        };
    }

    // Setup event listeners
    setupEventListeners() {
        // Additional event listeners can be added here
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }

    // Generate public gallery URL
    generatePublicGalleryUrl(photographerId) {
        return `${window.location.origin}/gallery/${photographerId}`;
    }

    // Export customizations
    exportCustomizations() {
        const data = {
            theme: this.currentTheme,
            customizations: this.customizations,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fotos63-customizations.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    // Import customizations
    importCustomizations(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.currentTheme = data.theme;
                this.customizations = data.customizations;
                this.loadCurrentSettings();
                alert('Personalizações importadas com sucesso!');
            } catch (error) {
                alert('Erro ao importar personalizações: arquivo inválido');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize gallery customization system
const galleryCustomization = new GalleryCustomizationSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GalleryCustomizationSystem;
}

