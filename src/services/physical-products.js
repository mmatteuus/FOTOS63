// Physical Products and Merchandise System
// Sistema de Monetização de Brindes e Produtos Físicos

class PhysicalProductsSystem {
    constructor() {
        this.products = [];
        this.categories = [];
        this.customization = {};
        this.shipping = {};
        this.inventory = {};
        this.initializeSystem();
    }

    initializeSystem() {
        this.loadProductCategories();
        this.loadProducts();
        this.setupCustomizationEngine();
        this.setupShippingCalculator();
    }

    // Create physical products interface
    createProductsInterface(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="physical-products">
                <div class="products-header">
                    <h3><i class="bi bi-box"></i> Produtos Físicos & Brindes</h3>
                    <p>Transforme suas fotos em produtos únicos e aumente sua receita</p>
                </div>

                <!-- Product Categories -->
                <div class="product-categories">
                    <div class="category-tabs">
                        <button class="tab-btn active" data-category="all">Todos</button>
                        <button class="tab-btn" data-category="prints">Impressões</button>
                        <button class="tab-btn" data-category="albums">Álbuns</button>
                        <button class="tab-btn" data-category="canvas">Canvas</button>
                        <button class="tab-btn" data-category="gifts">Brindes</button>
                        <button class="tab-btn" data-category="apparel">Vestuário</button>
                        <button class="tab-btn" data-category="accessories">Acessórios</button>
                    </div>
                </div>

                <!-- Products Grid -->
                <div class="products-grid" id="productsGrid">
                    <!-- Print Products -->
                    <div class="product-card" data-category="prints">
                        <div class="product-image">
                            <img src="/images/products/photo-print.jpg" alt="Impressão Fotográfica">
                            <div class="product-overlay">
                                <button class="btn btn-primary" onclick="customizeProduct('photo_print')">Personalizar</button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h5>Impressão Fotográfica</h5>
                            <p>Papel fotográfico premium, várias dimensões</p>
                            <div class="product-pricing">
                                <span class="price-from">A partir de</span>
                                <span class="price">R$ 8,90</span>
                            </div>
                            <div class="product-options">
                                <span class="option">10x15cm</span>
                                <span class="option">15x21cm</span>
                                <span class="option">20x30cm</span>
                                <span class="option">+</span>
                            </div>
                        </div>
                    </div>

                    <!-- Canvas Products -->
                    <div class="product-card" data-category="canvas">
                        <div class="product-image">
                            <img src="/images/products/canvas.jpg" alt="Canvas">
                            <div class="product-overlay">
                                <button class="btn btn-primary" onclick="customizeProduct('canvas')">Personalizar</button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h5>Canvas Premium</h5>
                            <p>Tela canvas com bastidor de madeira</p>
                            <div class="product-pricing">
                                <span class="price-from">A partir de</span>
                                <span class="price">R$ 45,90</span>
                            </div>
                            <div class="product-options">
                                <span class="option">30x40cm</span>
                                <span class="option">40x60cm</span>
                                <span class="option">60x80cm</span>
                                <span class="option">+</span>
                            </div>
                        </div>
                    </div>

                    <!-- Album Products -->
                    <div class="product-card" data-category="albums">
                        <div class="product-image">
                            <img src="/images/products/photo-album.jpg" alt="Álbum de Fotos">
                            <div class="product-overlay">
                                <button class="btn btn-primary" onclick="customizeProduct('album')">Personalizar</button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h5>Álbum de Fotos</h5>
                            <p>Álbum personalizado com capa dura</p>
                            <div class="product-pricing">
                                <span class="price-from">A partir de</span>
                                <span class="price">R$ 89,90</span>
                            </div>
                            <div class="product-options">
                                <span class="option">20 páginas</span>
                                <span class="option">40 páginas</span>
                                <span class="option">60 páginas</span>
                                <span class="option">+</span>
                            </div>
                        </div>
                    </div>

                    <!-- Gift Products -->
                    <div class="product-card" data-category="gifts">
                        <div class="product-image">
                            <img src="/images/products/mug.jpg" alt="Caneca Personalizada">
                            <div class="product-overlay">
                                <button class="btn btn-primary" onclick="customizeProduct('mug')">Personalizar</button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h5>Caneca Personalizada</h5>
                            <p>Caneca de porcelana com sua foto</p>
                            <div class="product-pricing">
                                <span class="price-from">A partir de</span>
                                <span class="price">R$ 24,90</span>
                            </div>
                            <div class="product-options">
                                <span class="option">Branca</span>
                                <span class="option">Colorida</span>
                                <span class="option">Mágica</span>
                            </div>
                        </div>
                    </div>

                    <!-- Apparel Products -->
                    <div class="product-card" data-category="apparel">
                        <div class="product-image">
                            <img src="/images/products/t-shirt.jpg" alt="Camiseta Personalizada">
                            <div class="product-overlay">
                                <button class="btn btn-primary" onclick="customizeProduct('tshirt')">Personalizar</button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h5>Camiseta Personalizada</h5>
                            <p>100% algodão, impressão digital</p>
                            <div class="product-pricing">
                                <span class="price-from">A partir de</span>
                                <span class="price">R$ 39,90</span>
                            </div>
                            <div class="product-options">
                                <span class="option">P</span>
                                <span class="option">M</span>
                                <span class="option">G</span>
                                <span class="option">+</span>
                            </div>
                        </div>
                    </div>

                    <!-- Accessories -->
                    <div class="product-card" data-category="accessories">
                        <div class="product-image">
                            <img src="/images/products/keychain.jpg" alt="Chaveiro Personalizado">
                            <div class="product-overlay">
                                <button class="btn btn-primary" onclick="customizeProduct('keychain')">Personalizar</button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h5>Chaveiro Personalizado</h5>
                            <p>Acrílico resistente com sua foto</p>
                            <div class="product-pricing">
                                <span class="price-from">A partir de</span>
                                <span class="price">R$ 12,90</span>
                            </div>
                            <div class="product-options">
                                <span class="option">Redondo</span>
                                <span class="option">Quadrado</span>
                                <span class="option">Coração</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bulk Order Section -->
                <div class="bulk-orders">
                    <h5><i class="bi bi-boxes"></i> Pedidos em Lote</h5>
                    <p>Descontos especiais para grandes quantidades</p>
                    
                    <div class="bulk-calculator">
                        <div class="calculator-inputs">
                            <div class="input-group">
                                <label>Produto</label>
                                <select class="form-select" id="bulkProduct">
                                    <option value="photo_print">Impressão Fotográfica</option>
                                    <option value="canvas">Canvas</option>
                                    <option value="mug">Caneca</option>
                                    <option value="tshirt">Camiseta</option>
                                </select>
                            </div>
                            
                            <div class="input-group">
                                <label>Quantidade</label>
                                <input type="number" class="form-control" id="bulkQuantity" min="10" value="50">
                            </div>
                            
                            <div class="input-group">
                                <label>Tamanho/Tipo</label>
                                <select class="form-select" id="bulkSize">
                                    <option value="standard">Padrão</option>
                                    <option value="large">Grande</option>
                                    <option value="premium">Premium</option>
                                </select>
                            </div>
                        </div>

                        <div class="bulk-results" id="bulkResults">
                            <!-- Bulk pricing results will be shown here -->
                        </div>

                        <button class="btn btn-success" onclick="requestBulkQuote()">
                            <i class="bi bi-calculator"></i> Solicitar Orçamento
                        </button>
                    </div>
                </div>

                <!-- Photographer Tools -->
                <div class="photographer-tools">
                    <h5><i class="bi bi-tools"></i> Ferramentas para Fotógrafos</h5>
                    
                    <div class="tools-grid">
                        <div class="tool-card">
                            <i class="bi bi-palette"></i>
                            <h6>Designer de Produtos</h6>
                            <p>Crie templates personalizados para seus clientes</p>
                            <button class="btn btn-outline-primary" onclick="openProductDesigner()">Abrir Designer</button>
                        </div>

                        <div class="tool-card">
                            <i class="bi bi-tags"></i>
                            <h6>Configurar Preços</h6>
                            <p>Defina margens e preços para seus produtos</p>
                            <button class="btn btn-outline-primary" onclick="configurePricing()">Configurar</button>
                        </div>

                        <div class="tool-card">
                            <i class="bi bi-truck"></i>
                            <h6>Gestão de Entregas</h6>
                            <p>Acompanhe pedidos e entregas</p>
                            <button class="btn btn-outline-primary" onclick="manageDeliveries()">Gerenciar</button>
                        </div>

                        <div class="tool-card">
                            <i class="bi bi-graph-up"></i>
                            <h6>Relatórios de Vendas</h6>
                            <p>Analise performance dos produtos</p>
                            <button class="btn btn-outline-primary" onclick="viewProductReports()">Ver Relatórios</button>
                        </div>
                    </div>
                </div>

                <!-- Product Customization Modal -->
                <div class="modal fade" id="customizationModal" tabindex="-1">
                    <div class="modal-dialog modal-xl">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Personalizar Produto</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="customization-interface" id="customizationInterface">
                                    <!-- Customization interface will be loaded here -->
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" onclick="addToCart()">
                                    <i class="bi bi-cart-plus"></i> Adicionar ao Carrinho
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bulk Quote Modal -->
                <div class="modal fade" id="bulkQuoteModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Orçamento em Lote</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <form id="bulkQuoteForm">
                                    <div class="form-group">
                                        <label>Nome da Empresa/Evento</label>
                                        <input type="text" class="form-control" id="companyName" required>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Email de Contato</label>
                                        <input type="email" class="form-control" id="contactEmail" required>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Telefone</label>
                                        <input type="tel" class="form-control" id="contactPhone">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Detalhes do Pedido</label>
                                        <textarea class="form-control" id="orderDetails" rows="4" placeholder="Descreva seu pedido em detalhes..."></textarea>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Data de Entrega Desejada</label>
                                        <input type="date" class="form-control" id="deliveryDate">
                                    </div>
                                </form>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-success" onclick="submitBulkQuote()">
                                    <i class="bi bi-send"></i> Enviar Solicitação
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupProductsEvents();
        this.loadProducts();
        this.calculateBulkPricing();
    }

    // Setup event listeners
    setupProductsEvents() {
        // Category tabs
        document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterByCategory(e.target.dataset.category);
            });
        });

        // Bulk calculator inputs
        ['bulkProduct', 'bulkQuantity', 'bulkSize'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.calculateBulkPricing();
            });
        });
    }

    // Filter products by category
    filterByCategory(category) {
        // Update active tab
        document.querySelectorAll('.category-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Filter products
        document.querySelectorAll('.product-card').forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Customize product
    customizeProduct(productType) {
        this.currentProduct = productType;
        this.loadCustomizationInterface(productType);
        
        const modal = new bootstrap.Modal(document.getElementById('customizationModal'));
        modal.show();
    }

    // Load customization interface
    loadCustomizationInterface(productType) {
        const container = document.getElementById('customizationInterface');
        
        const interfaces = {
            photo_print: this.createPrintCustomization(),
            canvas: this.createCanvasCustomization(),
            album: this.createAlbumCustomization(),
            mug: this.createMugCustomization(),
            tshirt: this.createTShirtCustomization(),
            keychain: this.createKeychainCustomization()
        };

        container.innerHTML = interfaces[productType] || this.createGenericCustomization();
        this.setupCustomizationEvents();
    }

    // Create print customization interface
    createPrintCustomization() {
        return `
            <div class="customization-content">
                <div class="product-preview">
                    <div class="preview-area">
                        <img id="previewImage" src="/images/placeholder-photo.jpg" alt="Preview">
                    </div>
                    <div class="preview-controls">
                        <button class="btn btn-sm btn-outline-primary" onclick="uploadPhoto()">
                            <i class="bi bi-upload"></i> Carregar Foto
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="selectFromGallery()">
                            <i class="bi bi-images"></i> Da Galeria
                        </button>
                    </div>
                </div>
                
                <div class="customization-options">
                    <h6>Opções de Personalização</h6>
                    
                    <div class="option-group">
                        <label>Tamanho</label>
                        <div class="size-options">
                            <input type="radio" name="size" id="size1" value="10x15" checked>
                            <label for="size1">10x15cm - R$ 8,90</label>
                            
                            <input type="radio" name="size" id="size2" value="15x21">
                            <label for="size2">15x21cm - R$ 12,90</label>
                            
                            <input type="radio" name="size" id="size3" value="20x30">
                            <label for="size3">20x30cm - R$ 18,90</label>
                            
                            <input type="radio" name="size" id="size4" value="30x40">
                            <label for="size4">30x40cm - R$ 28,90</label>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <label>Papel</label>
                        <select class="form-select" id="paperType">
                            <option value="glossy">Brilhante</option>
                            <option value="matte">Fosco</option>
                            <option value="pearl">Pérola</option>
                        </select>
                    </div>
                    
                    <div class="option-group">
                        <label>Quantidade</label>
                        <input type="number" class="form-control" id="quantity" value="1" min="1">
                    </div>
                    
                    <div class="option-group">
                        <label>Observações</label>
                        <textarea class="form-control" id="notes" rows="3" placeholder="Instruções especiais..."></textarea>
                    </div>
                </div>
                
                <div class="pricing-summary">
                    <div class="price-breakdown">
                        <div class="price-item">
                            <span>Preço unitário:</span>
                            <span id="unitPrice">R$ 8,90</span>
                        </div>
                        <div class="price-item">
                            <span>Quantidade:</span>
                            <span id="itemQuantity">1</span>
                        </div>
                        <div class="price-item total">
                            <span>Total:</span>
                            <span id="totalPrice">R$ 8,90</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Create canvas customization interface
    createCanvasCustomization() {
        return `
            <div class="customization-content">
                <div class="product-preview">
                    <div class="preview-area canvas-preview">
                        <img id="previewImage" src="/images/placeholder-photo.jpg" alt="Preview">
                        <div class="canvas-frame"></div>
                    </div>
                    <div class="preview-controls">
                        <button class="btn btn-sm btn-outline-primary" onclick="uploadPhoto()">
                            <i class="bi bi-upload"></i> Carregar Foto
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="selectFromGallery()">
                            <i class="bi bi-images"></i> Da Galeria
                        </button>
                    </div>
                </div>
                
                <div class="customization-options">
                    <h6>Opções de Canvas</h6>
                    
                    <div class="option-group">
                        <label>Tamanho</label>
                        <div class="size-options">
                            <input type="radio" name="canvasSize" id="canvas1" value="30x40" checked>
                            <label for="canvas1">30x40cm - R$ 45,90</label>
                            
                            <input type="radio" name="canvasSize" id="canvas2" value="40x60">
                            <label for="canvas2">40x60cm - R$ 69,90</label>
                            
                            <input type="radio" name="canvasSize" id="canvas3" value="60x80">
                            <label for="canvas3">60x80cm - R$ 98,90</label>
                            
                            <input type="radio" name="canvasSize" id="canvas4" value="80x120">
                            <label for="canvas4">80x120cm - R$ 149,90</label>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <label>Espessura do Bastidor</label>
                        <select class="form-select" id="frameThickness">
                            <option value="2cm">2cm - Padrão</option>
                            <option value="4cm">4cm - Premium (+R$ 15,00)</option>
                        </select>
                    </div>
                    
                    <div class="option-group">
                        <label>Acabamento</label>
                        <select class="form-select" id="canvasFinish">
                            <option value="standard">Padrão</option>
                            <option value="uv">Proteção UV (+R$ 10,00)</option>
                            <option value="varnish">Verniz (+R$ 20,00)</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    // Create mug customization interface
    createMugCustomization() {
        return `
            <div class="customization-content">
                <div class="product-preview">
                    <div class="preview-area mug-preview">
                        <div class="mug-3d">
                            <img id="previewImage" src="/images/placeholder-photo.jpg" alt="Preview">
                        </div>
                    </div>
                </div>
                
                <div class="customization-options">
                    <h6>Opções da Caneca</h6>
                    
                    <div class="option-group">
                        <label>Tipo</label>
                        <div class="mug-types">
                            <input type="radio" name="mugType" id="mug1" value="white" checked>
                            <label for="mug1">Branca - R$ 24,90</label>
                            
                            <input type="radio" name="mugType" id="mug2" value="colored">
                            <label for="mug2">Colorida - R$ 29,90</label>
                            
                            <input type="radio" name="mugType" id="mug3" value="magic">
                            <label for="mug3">Mágica - R$ 34,90</label>
                        </div>
                    </div>
                    
                    <div class="option-group">
                        <label>Posição da Imagem</label>
                        <select class="form-select" id="imagePosition">
                            <option value="center">Centro</option>
                            <option value="wrap">Volta Completa (+R$ 5,00)</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    // Setup customization events
    setupCustomizationEvents() {
        // Size/type changes
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updatePricing();
            });
        });

        // Select changes
        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', () => {
                this.updatePricing();
            });
        });

        // Quantity changes
        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.addEventListener('input', () => {
                this.updatePricing();
            });
        }
    }

    // Update pricing
    updatePricing() {
        // This would calculate pricing based on selected options
        // For now, just update the display
        const unitPriceElement = document.getElementById('unitPrice');
        const quantityElement = document.getElementById('itemQuantity');
        const totalPriceElement = document.getElementById('totalPrice');

        if (unitPriceElement && quantityElement && totalPriceElement) {
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            const unitPrice = 8.90; // This would be calculated based on options
            const total = unitPrice * quantity;

            unitPriceElement.textContent = `R$ ${unitPrice.toFixed(2)}`;
            quantityElement.textContent = quantity;
            totalPriceElement.textContent = `R$ ${total.toFixed(2)}`;
        }
    }

    // Calculate bulk pricing
    calculateBulkPricing() {
        const product = document.getElementById('bulkProduct').value;
        const quantity = parseInt(document.getElementById('bulkQuantity').value) || 0;
        const size = document.getElementById('bulkSize').value;

        const basePrices = {
            photo_print: 8.90,
            canvas: 45.90,
            mug: 24.90,
            tshirt: 39.90
        };

        const basePrice = basePrices[product] || 0;
        let discount = 0;

        // Calculate discount based on quantity
        if (quantity >= 100) discount = 0.25;
        else if (quantity >= 50) discount = 0.20;
        else if (quantity >= 25) discount = 0.15;
        else if (quantity >= 10) discount = 0.10;

        const unitPrice = basePrice * (1 - discount);
        const total = unitPrice * quantity;
        const savings = (basePrice - unitPrice) * quantity;

        const container = document.getElementById('bulkResults');
        container.innerHTML = `
            <div class="bulk-pricing">
                <div class="pricing-item">
                    <span>Preço unitário:</span>
                    <span>R$ ${unitPrice.toFixed(2)}</span>
                </div>
                <div class="pricing-item">
                    <span>Desconto:</span>
                    <span class="text-success">${(discount * 100).toFixed(0)}%</span>
                </div>
                <div class="pricing-item">
                    <span>Economia total:</span>
                    <span class="text-success">R$ ${savings.toFixed(2)}</span>
                </div>
                <div class="pricing-item total">
                    <span>Total:</span>
                    <span>R$ ${total.toFixed(2)}</span>
                </div>
            </div>
        `;
    }

    // Request bulk quote
    requestBulkQuote() {
        const modal = new bootstrap.Modal(document.getElementById('bulkQuoteModal'));
        modal.show();
    }

    // Submit bulk quote
    async submitBulkQuote() {
        try {
            const formData = {
                company_name: document.getElementById('companyName').value,
                contact_email: document.getElementById('contactEmail').value,
                contact_phone: document.getElementById('contactPhone').value,
                order_details: document.getElementById('orderDetails').value,
                delivery_date: document.getElementById('deliveryDate').value,
                product: document.getElementById('bulkProduct').value,
                quantity: document.getElementById('bulkQuantity').value,
                size: document.getElementById('bulkSize').value
            };

            const response = await fetch('/api/products/bulk-quote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Solicitação de orçamento enviada com sucesso! Entraremos em contato em breve.');
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('bulkQuoteModal'));
                modal.hide();
            }
        } catch (error) {
            console.error('Error submitting bulk quote:', error);
            alert('Erro ao enviar solicitação');
        }
    }

    // Add to cart
    addToCart() {
        // Implementation for adding customized product to cart
        alert('Produto adicionado ao carrinho!');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('customizationModal'));
        modal.hide();
    }

    // Upload photo
    uploadPhoto() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.getElementById('previewImage').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }

    // Select from gallery
    selectFromGallery() {
        alert('Funcionalidade de seleção da galeria em desenvolvimento');
    }

    // Open product designer
    openProductDesigner() {
        alert('Designer de produtos em desenvolvimento');
    }

    // Configure pricing
    configurePricing() {
        alert('Configuração de preços em desenvolvimento');
    }

    // Manage deliveries
    manageDeliveries() {
        alert('Gestão de entregas em desenvolvimento');
    }

    // View product reports
    viewProductReports() {
        alert('Relatórios de produtos em desenvolvimento');
    }

    // Load products
    async loadProducts() {
        try {
            const response = await fetch('/api/products/list', {
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });

            if (response.ok) {
                this.products = await response.json();
                // Update products display if needed
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }
}

// Global functions
function customizeProduct(productType) {
    physicalProducts.customizeProduct(productType);
}

function requestBulkQuote() {
    physicalProducts.requestBulkQuote();
}

function submitBulkQuote() {
    physicalProducts.submitBulkQuote();
}

function addToCart() {
    physicalProducts.addToCart();
}

function uploadPhoto() {
    physicalProducts.uploadPhoto();
}

function selectFromGallery() {
    physicalProducts.selectFromGallery();
}

function openProductDesigner() {
    physicalProducts.openProductDesigner();
}

function configurePricing() {
    physicalProducts.configurePricing();
}

function manageDeliveries() {
    physicalProducts.manageDeliveries();
}

function viewProductReports() {
    physicalProducts.viewProductReports();
}

// Initialize physical products system
const physicalProducts = new PhysicalProductsSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhysicalProductsSystem;
}

