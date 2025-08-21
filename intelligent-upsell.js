// Intelligent Upsell and Cross-sell System
// Sistema de Upsell e Cross-sell Inteligente

class IntelligentUpsellSystem {
    constructor() {
        this.userBehavior = {};
        this.recommendations = {};
        this.purchaseHistory = {};
        this.aiEngine = {};
        this.conversionTracking = {};
        this.initializeSystem();
    }

    initializeSystem() {
        this.setupBehaviorTracking();
        this.setupRecommendationEngine();
        this.setupConversionTracking();
        this.loadUserData();
    }

    // Create upsell interface
    createUpsellInterface(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="intelligent-upsell">
                <!-- Smart Recommendations Widget -->
                <div class="recommendations-widget" id="recommendationsWidget">
                    <div class="widget-header">
                        <h5><i class="bi bi-stars"></i> Recomendado para Você</h5>
                        <button class="btn-close" onclick="hideRecommendations()"></button>
                    </div>
                    
                    <div class="recommendations-content" id="recommendationsContent">
                        <!-- Dynamic recommendations will be loaded here -->
                    </div>
                </div>

                <!-- Cart Upsell -->
                <div class="cart-upsell" id="cartUpsell" style="display: none;">
                    <div class="upsell-header">
                        <h6><i class="bi bi-plus-circle"></i> Complete sua compra</h6>
                        <p>Outros clientes também compraram:</p>
                    </div>
                    
                    <div class="upsell-items" id="cartUpsellItems">
                        <!-- Cart upsell items will be loaded here -->
                    </div>
                </div>

                <!-- Bundle Offers -->
                <div class="bundle-offers" id="bundleOffers">
                    <div class="bundle-header">
                        <h5><i class="bi bi-box-seam"></i> Ofertas Especiais</h5>
                        <p>Economize comprando em conjunto</p>
                    </div>
                    
                    <div class="bundles-grid" id="bundlesGrid">
                        <!-- Bundle offers will be loaded here -->
                    </div>
                </div>

                <!-- Personalized Promotions -->
                <div class="personalized-promotions" id="personalizedPromotions">
                    <div class="promotions-slider" id="promotionsSlider">
                        <!-- Personalized promotions will be loaded here -->
                    </div>
                </div>

                <!-- Exit Intent Popup -->
                <div class="exit-intent-popup" id="exitIntentPopup" style="display: none;">
                    <div class="popup-overlay"></div>
                    <div class="popup-content">
                        <div class="popup-header">
                            <h5>Espere! Não vá embora ainda</h5>
                            <button class="btn-close" onclick="closeExitIntent()"></button>
                        </div>
                        
                        <div class="popup-body">
                            <div class="special-offer">
                                <div class="offer-badge">Oferta Especial</div>
                                <h6 id="exitOfferTitle">15% OFF na sua primeira compra</h6>
                                <p id="exitOfferDescription">Use o cupom PRIMEIRA15 e economize em qualquer foto</p>
                                
                                <div class="offer-countdown">
                                    <span>Esta oferta expira em:</span>
                                    <div class="countdown-timer" id="offerCountdown">05:00</div>
                                </div>
                                
                                <div class="offer-actions">
                                    <button class="btn btn-primary" onclick="applyExitOffer()">
                                        <i class="bi bi-tag"></i> Aplicar Desconto
                                    </button>
                                    <button class="btn btn-outline-secondary" onclick="closeExitIntent()">
                                        Talvez depois
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Smart Pricing Display -->
                <div class="smart-pricing" id="smartPricing">
                    <div class="pricing-insights">
                        <div class="insight-item">
                            <i class="bi bi-graph-down text-success"></i>
                            <span>Preço 20% menor que a média do mercado</span>
                        </div>
                        <div class="insight-item">
                            <i class="bi bi-clock text-warning"></i>
                            <span>Oferta válida por tempo limitado</span>
                        </div>
                        <div class="insight-item">
                            <i class="bi bi-people text-info"></i>
                            <span>12 pessoas compraram nas últimas 24h</span>
                        </div>
                    </div>
                </div>

                <!-- Loyalty Program Widget -->
                <div class="loyalty-widget" id="loyaltyWidget">
                    <div class="loyalty-header">
                        <h6><i class="bi bi-award"></i> Programa de Fidelidade</h6>
                    </div>
                    
                    <div class="loyalty-progress">
                        <div class="progress-info">
                            <span>Próximo benefício em:</span>
                            <strong id="pointsToNext">50 pontos</strong>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" id="loyaltyProgress" style="width: 60%"></div>
                        </div>
                        <div class="loyalty-benefits">
                            <div class="benefit-item">
                                <i class="bi bi-gift"></i>
                                <span>Desconto de 10% na próxima compra</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Social Proof -->
                <div class="social-proof" id="socialProof">
                    <div class="proof-items">
                        <div class="proof-item">
                            <i class="bi bi-eye"></i>
                            <span id="viewersCount">23 pessoas</span>
                            <span>visualizando agora</span>
                        </div>
                        <div class="proof-item">
                            <i class="bi bi-cart"></i>
                            <span id="recentPurchases">5 vendas</span>
                            <span>nas últimas 2 horas</span>
                        </div>
                        <div class="proof-item">
                            <i class="bi bi-star-fill"></i>
                            <span id="averageRating">4.8</span>
                            <span>avaliação média</span>
                        </div>
                    </div>
                </div>

                <!-- Urgency Indicators -->
                <div class="urgency-indicators" id="urgencyIndicators">
                    <div class="urgency-item stock-low">
                        <i class="bi bi-exclamation-triangle text-warning"></i>
                        <span>Apenas <strong>3 unidades</strong> restantes</span>
                    </div>
                    <div class="urgency-item time-limited">
                        <i class="bi bi-clock text-danger"></i>
                        <span>Promoção termina em <strong id="promoCountdown">2h 15m</strong></span>
                    </div>
                </div>

                <!-- Recommendation Modal -->
                <div class="modal fade" id="recommendationModal" tabindex="-1">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Recomendações Personalizadas</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="recommendation-categories">
                                    <div class="category-tabs">
                                        <button class="tab-btn active" data-category="similar">Similares</button>
                                        <button class="tab-btn" data-category="bundle">Combos</button>
                                        <button class="tab-btn" data-category="upgrade">Upgrades</button>
                                        <button class="tab-btn" data-category="trending">Em Alta</button>
                                    </div>
                                    
                                    <div class="recommendations-grid" id="modalRecommendations">
                                        <!-- Modal recommendations will be loaded here -->
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                <button type="button" class="btn btn-primary" onclick="addRecommendationsToCart()">
                                    <i class="bi bi-cart-plus"></i> Adicionar Selecionados
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- A/B Test Container -->
                <div class="ab-test-container" id="abTestContainer">
                    <!-- A/B test variations will be loaded here -->
                </div>
            </div>
        `;

        this.setupUpsellEvents();
        this.loadRecommendations();
        this.startBehaviorTracking();
        this.setupExitIntent();
    }

    // Setup event listeners
    setupUpsellEvents() {
        // Track user interactions
        document.addEventListener('click', (e) => {
            this.trackInteraction('click', e.target);
        });

        document.addEventListener('scroll', () => {
            this.trackScrollBehavior();
        });

        // Cart changes
        document.addEventListener('cartUpdated', (e) => {
            this.updateCartUpsells(e.detail);
        });

        // Page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackTimeOnPage();
            }
        });
    }

    // Load recommendations
    async loadRecommendations() {
        try {
            const response = await fetch('/api/recommendations/personalized', {
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });

            if (response.ok) {
                const recommendations = await response.json();
                this.displayRecommendations(recommendations);
            }
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    }

    // Display recommendations
    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendationsContent');
        
        container.innerHTML = recommendations.map(item => `
            <div class="recommendation-item" data-item-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="recommendation-badge">${item.confidence}% match</div>
                </div>
                <div class="item-info">
                    <h6>${item.title}</h6>
                    <p>${item.description}</p>
                    <div class="item-pricing">
                        ${item.original_price ? `<span class="original-price">R$ ${item.original_price}</span>` : ''}
                        <span class="current-price">R$ ${item.price}</span>
                        ${item.discount ? `<span class="discount-badge">${item.discount}% OFF</span>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-primary" onclick="addToCart('${item.id}')">
                            <i class="bi bi-cart-plus"></i> Adicionar
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="viewItem('${item.id}')">
                            Ver Detalhes
                        </button>
                    </div>
                </div>
                <div class="recommendation-reason">
                    <i class="bi bi-lightbulb"></i>
                    <span>${item.reason}</span>
                </div>
            </div>
        `).join('');
    }

    // Update cart upsells
    updateCartUpsells(cartData) {
        if (cartData.items.length === 0) {
            document.getElementById('cartUpsell').style.display = 'none';
            return;
        }

        this.generateCartUpsells(cartData.items).then(upsells => {
            const container = document.getElementById('cartUpsellItems');
            
            container.innerHTML = upsells.map(item => `
                <div class="upsell-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="upsell-info">
                        <h6>${item.title}</h6>
                        <span class="price">R$ ${item.price}</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="addUpsellToCart('${item.id}')">
                            + Adicionar
                        </button>
                    </div>
                </div>
            `).join('');

            document.getElementById('cartUpsell').style.display = 'block';
        });
    }

    // Generate cart upsells
    async generateCartUpsells(cartItems) {
        try {
            const response = await fetch('/api/recommendations/cart-upsell', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({ cart_items: cartItems })
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error generating cart upsells:', error);
        }
        
        return [];
    }

    // Setup exit intent
    setupExitIntent() {
        let exitIntentTriggered = false;
        
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                this.showExitIntent();
            }
        });

        // Mobile exit intent (scroll to top quickly)
        let lastScrollTop = 0;
        document.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop < lastScrollTop && scrollTop < 100 && !exitIntentTriggered) {
                exitIntentTriggered = true;
                setTimeout(() => this.showExitIntent(), 500);
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // Show exit intent popup
    showExitIntent() {
        const popup = document.getElementById('exitIntentPopup');
        popup.style.display = 'block';
        
        // Start countdown
        this.startOfferCountdown();
        
        // Track exit intent trigger
        this.trackEvent('exit_intent_triggered');
    }

    // Start offer countdown
    startOfferCountdown() {
        let timeLeft = 300; // 5 minutes
        const countdownElement = document.getElementById('offerCountdown');
        
        const countdown = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
                this.closeExitIntent();
            }
            
            timeLeft--;
        }, 1000);
    }

    // Apply exit offer
    applyExitOffer() {
        // Apply discount code
        this.applyCoupon('PRIMEIRA15');
        
        // Close popup
        this.closeExitIntent();
        
        // Track conversion
        this.trackEvent('exit_intent_converted');
        
        // Show success message
        this.showNotification('Desconto de 15% aplicado com sucesso!', 'success');
    }

    // Close exit intent
    closeExitIntent() {
        document.getElementById('exitIntentPopup').style.display = 'none';
    }

    // Track user behavior
    trackInteraction(type, element) {
        const data = {
            type,
            element: element.tagName,
            class: element.className,
            id: element.id,
            timestamp: Date.now(),
            page: window.location.pathname
        };

        this.userBehavior.interactions = this.userBehavior.interactions || [];
        this.userBehavior.interactions.push(data);

        // Send to analytics
        this.sendBehaviorData(data);
    }

    // Track scroll behavior
    trackScrollBehavior() {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        this.userBehavior.maxScroll = Math.max(this.userBehavior.maxScroll || 0, scrollPercent);
        
        // Trigger recommendations based on scroll depth
        if (scrollPercent > 50 && !this.userBehavior.midPageRecommendationsShown) {
            this.showMidPageRecommendations();
            this.userBehavior.midPageRecommendationsShown = true;
        }
    }

    // Show mid-page recommendations
    showMidPageRecommendations() {
        const widget = document.getElementById('recommendationsWidget');
        widget.style.display = 'block';
        widget.scrollIntoView({ behavior: 'smooth' });
    }

    // Generate bundle offers
    async generateBundleOffers() {
        try {
            const response = await fetch('/api/recommendations/bundles', {
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });

            if (response.ok) {
                const bundles = await response.json();
                this.displayBundleOffers(bundles);
            }
        } catch (error) {
            console.error('Error generating bundle offers:', error);
        }
    }

    // Display bundle offers
    displayBundleOffers(bundles) {
        const container = document.getElementById('bundlesGrid');
        
        container.innerHTML = bundles.map(bundle => `
            <div class="bundle-card">
                <div class="bundle-badge">
                    <span>Economize ${bundle.savings_percent}%</span>
                </div>
                <div class="bundle-images">
                    ${bundle.items.slice(0, 3).map(item => `
                        <img src="${item.image}" alt="${item.title}">
                    `).join('')}
                    ${bundle.items.length > 3 ? `<div class="more-items">+${bundle.items.length - 3}</div>` : ''}
                </div>
                <div class="bundle-info">
                    <h6>${bundle.title}</h6>
                    <p>${bundle.description}</p>
                    <div class="bundle-pricing">
                        <span class="original-price">R$ ${bundle.original_price}</span>
                        <span class="bundle-price">R$ ${bundle.price}</span>
                        <span class="savings">Economize R$ ${bundle.savings}</span>
                    </div>
                    <button class="btn btn-success" onclick="addBundleToCart('${bundle.id}')">
                        <i class="bi bi-box"></i> Comprar Combo
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Personalize promotions
    async personalizePromotions() {
        try {
            const response = await fetch('/api/recommendations/promotions', {
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });

            if (response.ok) {
                const promotions = await response.json();
                this.displayPersonalizedPromotions(promotions);
            }
        } catch (error) {
            console.error('Error personalizing promotions:', error);
        }
    }

    // Display personalized promotions
    displayPersonalizedPromotions(promotions) {
        const container = document.getElementById('promotionsSlider');
        
        container.innerHTML = `
            <div class="promotions-carousel">
                ${promotions.map(promo => `
                    <div class="promotion-slide">
                        <div class="promo-content">
                            <div class="promo-icon">
                                <i class="${promo.icon}"></i>
                            </div>
                            <h6>${promo.title}</h6>
                            <p>${promo.description}</p>
                            <div class="promo-action">
                                <button class="btn btn-primary" onclick="applyPromotion('${promo.code}')">
                                    ${promo.cta}
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Apply coupon
    async applyCoupon(code) {
        try {
            const response = await fetch('/api/cart/apply-coupon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({ coupon_code: code })
            });

            if (response.ok) {
                const result = await response.json();
                this.updateCartDisplay(result.cart);
                return true;
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
        }
        
        return false;
    }

    // Track conversion events
    trackEvent(eventName, data = {}) {
        const eventData = {
            event: eventName,
            timestamp: Date.now(),
            page: window.location.pathname,
            user_id: this.getUserId(),
            session_id: this.getSessionId(),
            ...data
        };

        // Send to analytics
        fetch('/api/analytics/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify(eventData)
        }).catch(error => {
            console.error('Error tracking event:', error);
        });
    }

    // Send behavior data
    sendBehaviorData(data) {
        // Batch behavior data and send periodically
        this.behaviorQueue = this.behaviorQueue || [];
        this.behaviorQueue.push(data);

        if (this.behaviorQueue.length >= 10) {
            this.flushBehaviorData();
        }
    }

    // Flush behavior data
    async flushBehaviorData() {
        if (!this.behaviorQueue || this.behaviorQueue.length === 0) return;

        try {
            await fetch('/api/analytics/behavior', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({ behaviors: this.behaviorQueue })
            });

            this.behaviorQueue = [];
        } catch (error) {
            console.error('Error sending behavior data:', error);
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Get user ID
    getUserId() {
        return localStorage.getItem('fotos63_user_id') || 'anonymous';
    }

    // Get session ID
    getSessionId() {
        let sessionId = sessionStorage.getItem('fotos63_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('fotos63_session_id', sessionId);
        }
        return sessionId;
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }
}

// Global functions
function hideRecommendations() {
    document.getElementById('recommendationsWidget').style.display = 'none';
}

function addToCart(itemId) {
    intelligentUpsell.trackEvent('recommendation_add_to_cart', { item_id: itemId });
    alert(`Item ${itemId} adicionado ao carrinho!`);
}

function viewItem(itemId) {
    intelligentUpsell.trackEvent('recommendation_view_details', { item_id: itemId });
    window.location.href = `/foto/${itemId}`;
}

function addUpsellToCart(itemId) {
    intelligentUpsell.trackEvent('upsell_add_to_cart', { item_id: itemId });
    alert(`Upsell ${itemId} adicionado ao carrinho!`);
}

function addBundleToCart(bundleId) {
    intelligentUpsell.trackEvent('bundle_add_to_cart', { bundle_id: bundleId });
    alert(`Combo ${bundleId} adicionado ao carrinho!`);
}

function applyPromotion(code) {
    intelligentUpsell.applyCoupon(code);
}

function closeExitIntent() {
    intelligentUpsell.closeExitIntent();
}

function applyExitOffer() {
    intelligentUpsell.applyExitOffer();
}

function addRecommendationsToCart() {
    const selectedItems = document.querySelectorAll('.recommendation-item input:checked');
    selectedItems.forEach(item => {
        addToCart(item.value);
    });
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('recommendationModal'));
    modal.hide();
}

// Initialize intelligent upsell system
const intelligentUpsell = new IntelligentUpsellSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntelligentUpsellSystem;
}

