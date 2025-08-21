// Print-on-Demand System for Fotos63
// Sistema de Impressão Sob Demanda Integrada

class PrintOnDemandSystem {
    constructor() {
        this.providers = {
            local: {
                name: 'Gráfica Local',
                baseUrl: '/api/print/local',
                commission: 0.15,
                shippingTime: '3-5 dias úteis',
                regions: ['TO', 'GO', 'MT', 'PA']
            },
            nacional: {
                name: 'Rede Nacional',
                baseUrl: '/api/print/nacional',
                commission: 0.20,
                shippingTime: '5-10 dias úteis',
                regions: 'all'
            },
            premium: {
                name: 'Premium Quality',
                baseUrl: '/api/print/premium',
                commission: 0.25,
                shippingTime: '7-15 dias úteis',
                regions: 'all'
            }
        };

        this.productTypes = {
            photo_print: {
                name: 'Impressão de Foto',
                sizes: ['10x15', '13x18', '15x21', '20x30', '30x40'],
                materials: ['papel_fosco', 'papel_brilho', 'papel_metalico'],
                basePrice: 5.00
            },
            canvas: {
                name: 'Tela Canvas',
                sizes: ['20x30', '30x40', '40x60', '60x80', '80x120'],
                materials: ['canvas_algodao', 'canvas_premium'],
                basePrice: 45.00
            },
            frame: {
                name: 'Quadro com Moldura',
                sizes: ['20x30', '30x40', '40x60', '50x70'],
                materials: ['moldura_madeira', 'moldura_aluminio', 'moldura_premium'],
                basePrice: 65.00
            },
            album: {
                name: 'Álbum de Fotos',
                sizes: ['20x20', '25x25', '30x30'],
                materials: ['capa_dura', 'capa_premium', 'capa_couro'],
                basePrice: 85.00
            },
            mug: {
                name: 'Caneca Personalizada',
                sizes: ['300ml', '350ml', '500ml'],
                materials: ['ceramica_branca', 'ceramica_colorida', 'ceramica_premium'],
                basePrice: 25.00
            },
            tshirt: {
                name: 'Camiseta Personalizada',
                sizes: ['P', 'M', 'G', 'GG', 'XG'],
                materials: ['algodao', 'poliester', 'premium'],
                basePrice: 35.00
            },
            mousepad: {
                name: 'Mouse Pad',
                sizes: ['20x24', '25x30'],
                materials: ['tecido', 'borracha_premium'],
                basePrice: 15.00
            },
            calendar: {
                name: 'Calendário Personalizado',
                sizes: ['A4', 'A3'],
                materials: ['papel_couche', 'papel_premium'],
                basePrice: 30.00
            }
        };

        this.initializeSystem();
    }

    initializeSystem() {
        this.loadPrintProviders();
        this.setupPriceCalculation();
    }

    // Load print providers and their capabilities
    async loadPrintProviders() {
        try {
            const response = await fetch('/api/print/providers', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                const providersData = await response.json();
                this.updateProviderCapabilities(providersData);
            }
        } catch (error) {
            console.error('Error loading print providers:', error);
        }
    }

    // Create print-on-demand interface
    createPrintInterface(containerId, photoData) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        this.currentPhoto = photoData;

        container.innerHTML = `
            <div class="print-on-demand">
                <div class="print-header">
                    <h3><i class="bi bi-printer"></i> Produtos Personalizados</h3>
                    <p>Transforme esta foto em produtos físicos únicos</p>
                </div>

                <div class="photo-preview">
                    <img src="${photoData.url}" alt="${photoData.title}" class="preview-image">
                    <div class="photo-info">
                        <h4>${photoData.title}</h4>
                        <p>por ${photoData.photographerName}</p>
                        <div class="photo-specs">
                            <span><i class="bi bi-aspect-ratio"></i> ${photoData.dimensions || 'Alta Resolução'}</span>
                            <span><i class="bi bi-palette"></i> ${photoData.colorSpace || 'RGB'}</span>
                        </div>
                    </div>
                </div>

                <div class="product-categories">
                    <div class="category-tabs">
                        <button class="tab-btn active" data-category="all">Todos</button>
                        <button class="tab-btn" data-category="wall">Parede</button>
                        <button class="tab-btn" data-category="gifts">Presentes</button>
                        <button class="tab-btn" data-category="clothing">Roupas</button>
                        <button class="tab-btn" data-category="office">Escritório</button>
                    </div>
                </div>

                <div class="products-grid" id="productsGrid">
                    ${this.generateProductsGrid()}
                </div>

                <div class="product-configurator" id="productConfigurator" style="display: none;">
                    <div class="configurator-header">
                        <h4 id="configuratorTitle">Configurar Produto</h4>
                        <button class="btn btn-sm btn-outline-secondary" onclick="closePrintConfigurator()">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>

                    <div class="configurator-content">
                        <div class="config-section">
                            <label>Tamanho</label>
                            <div class="size-options" id="sizeOptions">
                                <!-- Size options will be populated -->
                            </div>
                        </div>

                        <div class="config-section">
                            <label>Material/Acabamento</label>
                            <div class="material-options" id="materialOptions">
                                <!-- Material options will be populated -->
                            </div>
                        </div>

                        <div class="config-section">
                            <label>Quantidade</label>
                            <div class="quantity-selector">
                                <button class="btn btn-outline-secondary" onclick="adjustQuantity(-1)">-</button>
                                <input type="number" id="productQuantity" value="1" min="1" max="100">
                                <button class="btn btn-outline-secondary" onclick="adjustQuantity(1)">+</button>
                            </div>
                            <small class="text-muted">Desconto progressivo a partir de 5 unidades</small>
                        </div>

                        <div class="config-section">
                            <label>Fornecedor</label>
                            <div class="provider-options" id="providerOptions">
                                <!-- Provider options will be populated -->
                            </div>
                        </div>

                        <div class="product-preview-section">
                            <h5>Prévia do Produto</h5>
                            <div class="product-mockup" id="productMockup">
                                <div class="mockup-placeholder">
                                    <i class="bi bi-image"></i>
                                    <p>Selecione as opções para ver a prévia</p>
                                </div>
                            </div>
                        </div>

                        <div class="pricing-summary">
                            <div class="price-breakdown">
                                <div class="price-row">
                                    <span>Produto base:</span>
                                    <span id="basePrice">R$ 0,00</span>
                                </div>
                                <div class="price-row">
                                    <span>Personalização:</span>
                                    <span id="customizationPrice">R$ 0,00</span>
                                </div>
                                <div class="price-row">
                                    <span>Frete:</span>
                                    <span id="shippingPrice">Calcular</span>
                                </div>
                                <div class="price-row discount" id="discountRow" style="display: none;">
                                    <span>Desconto:</span>
                                    <span id="discountPrice">-R$ 0,00</span>
                                </div>
                                <div class="price-row total">
                                    <span>Total:</span>
                                    <span id="totalPrice">R$ 0,00</span>
                                </div>
                            </div>

                            <div class="delivery-info">
                                <i class="bi bi-truck"></i>
                                <span id="deliveryTime">Prazo de entrega</span>
                            </div>
                        </div>

                        <div class="shipping-calculator">
                            <h5>Calcular Frete</h5>
                            <div class="shipping-form">
                                <input type="text" class="form-control" id="shippingZipCode" 
                                       placeholder="CEP de entrega" maxlength="9">
                                <button class="btn btn-outline-primary" onclick="calculateShipping()">
                                    <i class="bi bi-calculator"></i> Calcular
                                </button>
                            </div>
                            <div class="shipping-options" id="shippingOptions" style="display: none;">
                                <!-- Shipping options will be populated -->
                            </div>
                        </div>

                        <div class="action-buttons">
                            <button class="btn btn-outline-secondary" onclick="saveToWishlist()">
                                <i class="bi bi-heart"></i> Salvar
                            </button>
                            <button class="btn btn-primary" onclick="addPrintToCart()" id="addToCartBtn">
                                <i class="bi bi-cart-plus"></i> Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>
                </div>

                <div class="print-cart" id="printCart" style="display: none;">
                    <div class="cart-header">
                        <h4><i class="bi bi-cart"></i> Carrinho de Produtos</h4>
                        <span class="cart-count" id="cartCount">0 itens</span>
                    </div>
                    <div class="cart-items" id="cartItems">
                        <!-- Cart items will be populated -->
                    </div>
                    <div class="cart-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span id="cartSubtotal">R$ 0,00</span>
                        </div>
                        <div class="summary-row">
                            <span>Frete:</span>
                            <span id="cartShipping">R$ 0,00</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span id="cartTotal">R$ 0,00</span>
                        </div>
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-outline-secondary" onclick="clearPrintCart()">
                            Limpar Carrinho
                        </button>
                        <button class="btn btn-primary" onclick="proceedToCheckout()">
                            Finalizar Pedido
                        </button>
                    </div>
                </div>

                <div class="print-info">
                    <div class="info-tabs">
                        <button class="info-tab active" data-tab="quality">Qualidade</button>
                        <button class="info-tab" data-tab="shipping">Entrega</button>
                        <button class="info-tab" data-tab="guarantee">Garantia</button>
                    </div>
                    
                    <div class="info-content">
                        <div class="info-panel active" id="quality-info">
                            <h5>Qualidade Premium</h5>
                            <ul>
                                <li>Impressão em alta resolução (300 DPI mínimo)</li>
                                <li>Cores vibrantes e duradouras</li>
                                <li>Materiais de primeira qualidade</li>
                                <li>Controle de qualidade rigoroso</li>
                            </ul>
                        </div>
                        
                        <div class="info-panel" id="shipping-info">
                            <h5>Entrega Segura</h5>
                            <ul>
                                <li>Embalagem protetiva especializada</li>
                                <li>Rastreamento completo do pedido</li>
                                <li>Seguro contra danos no transporte</li>
                                <li>Entrega em todo o Brasil</li>
                            </ul>
                        </div>
                        
                        <div class="info-panel" id="guarantee-info">
                            <h5>Garantia Total</h5>
                            <ul>
                                <li>30 dias para troca ou devolução</li>
                                <li>Reimpressão gratuita em caso de defeito</li>
                                <li>Suporte técnico especializado</li>
                                <li>100% de satisfação garantida</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupPrintEvents();
        this.initializeCart();
    }

    // Generate products grid
    generateProductsGrid() {
        return Object.entries(this.productTypes).map(([key, product]) => `
            <div class="product-card" data-product="${key}" onclick="configurePrintProduct('${key}')">
                <div class="product-image">
                    <i class="bi bi-${this.getProductIcon(key)}"></i>
                </div>
                <div class="product-info">
                    <h5>${product.name}</h5>
                    <p class="product-price">A partir de ${this.formatCurrency(product.basePrice)}</p>
                    <div class="product-features">
                        <span><i class="bi bi-check"></i> Alta qualidade</span>
                        <span><i class="bi bi-truck"></i> Entrega rápida</span>
                    </div>
                </div>
                <div class="product-overlay">
                    <button class="btn btn-primary">Personalizar</button>
                </div>
            </div>
        `).join('');
    }

    // Get product icon
    getProductIcon(productKey) {
        const icons = {
            photo_print: 'image',
            canvas: 'easel',
            frame: 'picture',
            album: 'book',
            mug: 'cup',
            tshirt: 'person',
            mousepad: 'mouse',
            calendar: 'calendar'
        };
        return icons[productKey] || 'box';
    }

    // Setup event listeners
    setupPrintEvents() {
        // Category tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterProductsByCategory(e.target.dataset.category);
            });
        });

        // Info tabs
        document.querySelectorAll('.info-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchInfoTab(e.target.dataset.tab);
            });
        });

        // Quantity input
        document.getElementById('productQuantity').addEventListener('input', () => {
            this.updatePricing();
        });

        // ZIP code input with mask
        document.getElementById('shippingZipCode').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{5})(\d)/, '$1-$2');
            e.target.value = value;
        });
    }

    // Filter products by category
    filterProductsByCategory(category) {
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Filter products
        const products = document.querySelectorAll('.product-card');
        products.forEach(product => {
            const productKey = product.dataset.product;
            const shouldShow = category === 'all' || this.getProductCategory(productKey) === category;
            product.style.display = shouldShow ? 'block' : 'none';
        });
    }

    // Get product category
    getProductCategory(productKey) {
        const categories = {
            photo_print: 'wall',
            canvas: 'wall',
            frame: 'wall',
            album: 'gifts',
            mug: 'gifts',
            tshirt: 'clothing',
            mousepad: 'office',
            calendar: 'office'
        };
        return categories[productKey] || 'all';
    }

    // Switch info tab
    switchInfoTab(tabName) {
        // Update active tab
        document.querySelectorAll('.info-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active panel
        document.querySelectorAll('.info-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tabName}-info`).classList.add('active');
    }

    // Configure print product
    configurePrintProduct(productKey) {
        this.currentProduct = productKey;
        const product = this.productTypes[productKey];

        // Show configurator
        document.getElementById('productConfigurator').style.display = 'block';
        document.getElementById('configuratorTitle').textContent = `Configurar ${product.name}`;

        // Populate size options
        this.populateSizeOptions(product.sizes);
        
        // Populate material options
        this.populateMaterialOptions(product.materials);
        
        // Populate provider options
        this.populateProviderOptions();

        // Reset quantity
        document.getElementById('productQuantity').value = 1;

        // Update pricing
        this.updatePricing();

        // Generate product mockup
        this.generateProductMockup();
    }

    // Populate size options
    populateSizeOptions(sizes) {
        const container = document.getElementById('sizeOptions');
        container.innerHTML = sizes.map(size => `
            <label class="size-option">
                <input type="radio" name="productSize" value="${size}">
                <span class="size-label">${size}</span>
            </label>
        `).join('');

        // Select first option by default
        container.querySelector('input').checked = true;

        // Add event listeners
        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                this.updatePricing();
                this.generateProductMockup();
            });
        });
    }

    // Populate material options
    populateMaterialOptions(materials) {
        const container = document.getElementById('materialOptions');
        container.innerHTML = materials.map(material => `
            <label class="material-option">
                <input type="radio" name="productMaterial" value="${material}">
                <span class="material-label">${this.getMaterialDisplayName(material)}</span>
                <span class="material-price">+${this.formatCurrency(this.getMaterialPrice(material))}</span>
            </label>
        `).join('');

        // Select first option by default
        container.querySelector('input').checked = true;

        // Add event listeners
        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                this.updatePricing();
                this.generateProductMockup();
            });
        });
    }

    // Populate provider options
    populateProviderOptions() {
        const container = document.getElementById('providerOptions');
        container.innerHTML = Object.entries(this.providers).map(([key, provider]) => `
            <label class="provider-option">
                <input type="radio" name="productProvider" value="${key}">
                <div class="provider-info">
                    <span class="provider-name">${provider.name}</span>
                    <span class="provider-time">${provider.shippingTime}</span>
                </div>
                <span class="provider-commission">+${(provider.commission * 100).toFixed(0)}%</span>
            </label>
        `).join('');

        // Select first option by default
        container.querySelector('input').checked = true;

        // Add event listeners
        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', () => {
                this.updatePricing();
                this.updateDeliveryTime();
            });
        });
    }

    // Get material display name
    getMaterialDisplayName(material) {
        const names = {
            papel_fosco: 'Papel Fosco',
            papel_brilho: 'Papel Brilho',
            papel_metalico: 'Papel Metálico',
            canvas_algodao: 'Canvas Algodão',
            canvas_premium: 'Canvas Premium',
            moldura_madeira: 'Moldura Madeira',
            moldura_aluminio: 'Moldura Alumínio',
            moldura_premium: 'Moldura Premium',
            capa_dura: 'Capa Dura',
            capa_premium: 'Capa Premium',
            capa_couro: 'Capa Couro',
            ceramica_branca: 'Cerâmica Branca',
            ceramica_colorida: 'Cerâmica Colorida',
            ceramica_premium: 'Cerâmica Premium',
            algodao: 'Algodão',
            poliester: 'Poliéster',
            premium: 'Premium',
            tecido: 'Tecido',
            borracha_premium: 'Borracha Premium',
            papel_couche: 'Papel Couchê',
            papel_premium: 'Papel Premium'
        };
        return names[material] || material;
    }

    // Get material price
    getMaterialPrice(material) {
        const prices = {
            papel_fosco: 0,
            papel_brilho: 2,
            papel_metalico: 5,
            canvas_algodao: 0,
            canvas_premium: 15,
            moldura_madeira: 0,
            moldura_aluminio: 10,
            moldura_premium: 25,
            capa_dura: 0,
            capa_premium: 20,
            capa_couro: 40,
            ceramica_branca: 0,
            ceramica_colorida: 5,
            ceramica_premium: 10,
            algodao: 0,
            poliester: 5,
            premium: 15,
            tecido: 0,
            borracha_premium: 8,
            papel_couche: 0,
            papel_premium: 10
        };
        return prices[material] || 0;
    }

    // Update pricing
    updatePricing() {
        if (!this.currentProduct) return;

        const product = this.productTypes[this.currentProduct];
        const quantity = parseInt(document.getElementById('productQuantity').value) || 1;
        
        // Get selected options
        const size = document.querySelector('input[name="productSize"]:checked')?.value;
        const material = document.querySelector('input[name="productMaterial"]:checked')?.value;
        const provider = document.querySelector('input[name="productProvider"]:checked')?.value;

        if (!size || !material || !provider) return;

        // Calculate prices
        const basePrice = product.basePrice;
        const sizeMultiplier = this.getSizeMultiplier(size);
        const materialPrice = this.getMaterialPrice(material);
        const providerCommission = this.providers[provider].commission;

        const unitPrice = (basePrice * sizeMultiplier) + materialPrice;
        const subtotal = unitPrice * quantity;
        const commission = subtotal * providerCommission;
        const total = subtotal + commission;

        // Apply quantity discount
        const discount = this.calculateQuantityDiscount(quantity, subtotal);
        const finalTotal = total - discount;

        // Update UI
        document.getElementById('basePrice').textContent = this.formatCurrency(unitPrice);
        document.getElementById('customizationPrice').textContent = this.formatCurrency(commission);
        document.getElementById('totalPrice').textContent = this.formatCurrency(finalTotal);

        // Show/hide discount
        const discountRow = document.getElementById('discountRow');
        if (discount > 0) {
            discountRow.style.display = 'flex';
            document.getElementById('discountPrice').textContent = `-${this.formatCurrency(discount)}`;
        } else {
            discountRow.style.display = 'none';
        }
    }

    // Get size multiplier
    getSizeMultiplier(size) {
        const multipliers = {
            '10x15': 1.0, '13x18': 1.2, '15x21': 1.4, '20x30': 1.8, '30x40': 2.5,
            '40x60': 3.5, '60x80': 5.0, '80x120': 7.5,
            'P': 1.0, 'M': 1.1, 'G': 1.2, 'GG': 1.3, 'XG': 1.4,
            '300ml': 1.0, '350ml': 1.1, '500ml': 1.3,
            '20x20': 1.0, '25x25': 1.5, '30x30': 2.0,
            '20x24': 1.0, '25x30': 1.3,
            'A4': 1.0, 'A3': 1.5
        };
        return multipliers[size] || 1.0;
    }

    // Calculate quantity discount
    calculateQuantityDiscount(quantity, subtotal) {
        if (quantity >= 20) return subtotal * 0.15; // 15% discount
        if (quantity >= 10) return subtotal * 0.10; // 10% discount
        if (quantity >= 5) return subtotal * 0.05;  // 5% discount
        return 0;
    }

    // Update delivery time
    updateDeliveryTime() {
        const provider = document.querySelector('input[name="productProvider"]:checked')?.value;
        if (provider) {
            document.getElementById('deliveryTime').textContent = this.providers[provider].shippingTime;
        }
    }

    // Generate product mockup
    generateProductMockup() {
        const mockupContainer = document.getElementById('productMockup');
        const size = document.querySelector('input[name="productSize"]:checked')?.value;
        const material = document.querySelector('input[name="productMaterial"]:checked')?.value;

        if (!size || !material) return;

        // Generate mockup based on product type
        const mockupHtml = this.generateMockupHtml(this.currentProduct, size, material);
        mockupContainer.innerHTML = mockupHtml;
    }

    // Generate mockup HTML
    generateMockupHtml(productType, size, material) {
        const photoUrl = this.currentPhoto.url;
        
        switch (productType) {
            case 'photo_print':
                return `
                    <div class="mockup-photo-print">
                        <div class="print-frame" style="aspect-ratio: ${this.getAspectRatio(size)};">
                            <img src="${photoUrl}" alt="Preview">
                        </div>
                        <div class="mockup-info">
                            <span>${size} - ${this.getMaterialDisplayName(material)}</span>
                        </div>
                    </div>
                `;
            case 'canvas':
                return `
                    <div class="mockup-canvas">
                        <div class="canvas-frame">
                            <img src="${photoUrl}" alt="Preview">
                        </div>
                        <div class="mockup-info">
                            <span>Tela ${size} - ${this.getMaterialDisplayName(material)}</span>
                        </div>
                    </div>
                `;
            case 'mug':
                return `
                    <div class="mockup-mug">
                        <div class="mug-container">
                            <div class="mug-photo">
                                <img src="${photoUrl}" alt="Preview">
                            </div>
                        </div>
                        <div class="mockup-info">
                            <span>Caneca ${size} - ${this.getMaterialDisplayName(material)}</span>
                        </div>
                    </div>
                `;
            default:
                return `
                    <div class="mockup-generic">
                        <img src="${photoUrl}" alt="Preview">
                        <div class="mockup-info">
                            <span>${this.productTypes[productType].name} ${size}</span>
                        </div>
                    </div>
                `;
        }
    }

    // Get aspect ratio for size
    getAspectRatio(size) {
        const ratios = {
            '10x15': '2/3',
            '13x18': '13/18',
            '15x21': '5/7',
            '20x30': '2/3',
            '30x40': '3/4',
            '40x60': '2/3',
            '60x80': '3/4'
        };
        return ratios[size] || '1/1';
    }

    // Calculate shipping
    async calculateShipping() {
        const zipCode = document.getElementById('shippingZipCode').value.replace(/\D/g, '');
        
        if (zipCode.length !== 8) {
            alert('Por favor, digite um CEP válido');
            return;
        }

        try {
            const provider = document.querySelector('input[name="productProvider"]:checked')?.value;
            const quantity = parseInt(document.getElementById('productQuantity').value) || 1;

            const response = await fetch('/api/print/shipping/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    zipCode,
                    provider,
                    productType: this.currentProduct,
                    quantity
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao calcular frete');
            }

            const shippingOptions = await response.json();
            this.displayShippingOptions(shippingOptions);

        } catch (error) {
            console.error('Shipping calculation error:', error);
            alert('Erro ao calcular frete: ' + error.message);
        }
    }

    // Display shipping options
    displayShippingOptions(options) {
        const container = document.getElementById('shippingOptions');
        
        container.innerHTML = options.map(option => `
            <label class="shipping-option">
                <input type="radio" name="shippingMethod" value="${option.code}">
                <div class="shipping-info">
                    <span class="shipping-name">${option.name}</span>
                    <span class="shipping-time">${option.deliveryTime}</span>
                </div>
                <span class="shipping-price">${this.formatCurrency(option.price)}</span>
            </label>
        `).join('');

        container.style.display = 'block';

        // Add event listeners
        container.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', (e) => {
                const selectedOption = options.find(opt => opt.code === e.target.value);
                document.getElementById('shippingPrice').textContent = this.formatCurrency(selectedOption.price);
                this.updateTotalWithShipping(selectedOption.price);
            });
        });

        // Select first option by default
        if (options.length > 0) {
            container.querySelector('input').checked = true;
            document.getElementById('shippingPrice').textContent = this.formatCurrency(options[0].price);
            this.updateTotalWithShipping(options[0].price);
        }
    }

    // Update total with shipping
    updateTotalWithShipping(shippingPrice) {
        const currentTotal = this.parsePrice(document.getElementById('totalPrice').textContent);
        const newTotal = currentTotal + shippingPrice;
        document.getElementById('totalPrice').textContent = this.formatCurrency(newTotal);
    }

    // Parse price from formatted string
    parsePrice(priceString) {
        return parseFloat(priceString.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    }

    // Initialize cart
    initializeCart() {
        this.printCart = JSON.parse(localStorage.getItem('fotos63_print_cart')) || [];
        this.updateCartDisplay();
    }

    // Add product to cart
    addPrintToCart() {
        const productData = this.collectProductData();
        
        if (!productData) {
            alert('Por favor, configure todas as opções do produto');
            return;
        }

        // Add to cart
        this.printCart.push({
            id: Date.now(),
            photoId: this.currentPhoto.id,
            photoUrl: this.currentPhoto.url,
            photoTitle: this.currentPhoto.title,
            ...productData,
            addedAt: new Date().toISOString()
        });

        // Save to localStorage
        localStorage.setItem('fotos63_print_cart', JSON.stringify(this.printCart));

        // Update display
        this.updateCartDisplay();

        // Show success message
        alert('Produto adicionado ao carrinho!');

        // Close configurator
        this.closePrintConfigurator();
    }

    // Collect product data
    collectProductData() {
        const size = document.querySelector('input[name="productSize"]:checked')?.value;
        const material = document.querySelector('input[name="productMaterial"]:checked')?.value;
        const provider = document.querySelector('input[name="productProvider"]:checked')?.value;
        const quantity = parseInt(document.getElementById('productQuantity').value) || 1;
        const shipping = document.querySelector('input[name="shippingMethod"]:checked')?.value;

        if (!size || !material || !provider) {
            return null;
        }

        const totalPrice = this.parsePrice(document.getElementById('totalPrice').textContent);
        const shippingPrice = shipping ? this.parsePrice(document.getElementById('shippingPrice').textContent) : 0;

        return {
            productType: this.currentProduct,
            productName: this.productTypes[this.currentProduct].name,
            size,
            material: this.getMaterialDisplayName(material),
            provider: this.providers[provider].name,
            quantity,
            unitPrice: totalPrice / quantity,
            totalPrice,
            shippingMethod: shipping,
            shippingPrice
        };
    }

    // Update cart display
    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartSubtotal = document.getElementById('cartSubtotal');
        const cartShipping = document.getElementById('cartShipping');
        const cartTotal = document.getElementById('cartTotal');

        if (!cartCount) return;

        // Update count
        cartCount.textContent = `${this.printCart.length} ${this.printCart.length === 1 ? 'item' : 'itens'}`;

        // Update items
        if (this.printCart.length === 0) {
            cartItems.innerHTML = '<p class="text-muted text-center">Carrinho vazio</p>';
        } else {
            cartItems.innerHTML = this.printCart.map(item => `
                <div class="cart-item">
                    <img src="${item.photoUrl}" alt="${item.photoTitle}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h6>${item.productName}</h6>
                        <p>${item.size} - ${item.material}</p>
                        <small>Qtd: ${item.quantity}</small>
                    </div>
                    <div class="cart-item-price">
                        ${this.formatCurrency(item.totalPrice)}
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="removePrintFromCart(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        // Update totals
        const subtotal = this.printCart.reduce((sum, item) => sum + item.totalPrice, 0);
        const shipping = this.printCart.reduce((sum, item) => sum + (item.shippingPrice || 0), 0);
        const total = subtotal + shipping;

        cartSubtotal.textContent = this.formatCurrency(subtotal);
        cartShipping.textContent = this.formatCurrency(shipping);
        cartTotal.textContent = this.formatCurrency(total);

        // Show/hide cart
        document.getElementById('printCart').style.display = this.printCart.length > 0 ? 'block' : 'none';
    }

    // Remove item from cart
    removePrintFromCart(itemId) {
        this.printCart = this.printCart.filter(item => item.id !== itemId);
        localStorage.setItem('fotos63_print_cart', JSON.stringify(this.printCart));
        this.updateCartDisplay();
    }

    // Clear cart
    clearPrintCart() {
        if (confirm('Tem certeza que deseja limpar o carrinho?')) {
            this.printCart = [];
            localStorage.setItem('fotos63_print_cart', JSON.stringify(this.printCart));
            this.updateCartDisplay();
        }
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (this.printCart.length === 0) {
            alert('Carrinho vazio');
            return;
        }

        // Redirect to print checkout
        window.location.href = `/checkout/print?items=${encodeURIComponent(JSON.stringify(this.printCart))}`;
    }

    // Close configurator
    closePrintConfigurator() {
        document.getElementById('productConfigurator').style.display = 'none';
        this.currentProduct = null;
    }

    // Adjust quantity
    adjustQuantity(delta) {
        const input = document.getElementById('productQuantity');
        const currentValue = parseInt(input.value) || 1;
        const newValue = Math.max(1, Math.min(100, currentValue + delta));
        input.value = newValue;
        this.updatePricing();
    }

    // Save to wishlist
    saveToWishlist() {
        const productData = this.collectProductData();
        
        if (!productData) {
            alert('Por favor, configure todas as opções do produto');
            return;
        }

        // Save to wishlist (implementation depends on your wishlist system)
        alert('Produto salvo na lista de desejos!');
    }

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount || 0);
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }
}

// Global functions for UI interactions
function configurePrintProduct(productKey) {
    printOnDemand.configurePrintProduct(productKey);
}

function closePrintConfigurator() {
    printOnDemand.closePrintConfigurator();
}

function adjustQuantity(delta) {
    printOnDemand.adjustQuantity(delta);
}

function calculateShipping() {
    printOnDemand.calculateShipping();
}

function addPrintToCart() {
    printOnDemand.addPrintToCart();
}

function removePrintFromCart(itemId) {
    printOnDemand.removePrintFromCart(itemId);
}

function clearPrintCart() {
    printOnDemand.clearPrintCart();
}

function proceedToCheckout() {
    printOnDemand.proceedToCheckout();
}

function saveToWishlist() {
    printOnDemand.saveToWishlist();
}

// Initialize print-on-demand system
const printOnDemand = new PrintOnDemandSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PrintOnDemandSystem;
}

