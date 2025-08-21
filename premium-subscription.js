// Premium Subscription System for Photographers
// Sistema de Assinatura Premium para Fotógrafos

class PremiumSubscriptionSystem {
    constructor() {
        this.plans = [];
        this.currentSubscription = null;
        this.features = {};
        this.billing = {};
        this.initializeSystem();
    }

    initializeSystem() {
        this.loadSubscriptionPlans();
        this.loadCurrentSubscription();
        this.setupBillingSystem();
    }

    // Create subscription interface
    createSubscriptionInterface(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="premium-subscription">
                <div class="subscription-header">
                    <h3><i class="bi bi-star"></i> Planos Premium</h3>
                    <p>Desbloqueie recursos avançados e maximize seus ganhos</p>
                </div>

                <!-- Current Plan Status -->
                <div class="current-plan" id="currentPlanStatus">
                    <!-- Current plan info will be loaded here -->
                </div>

                <!-- Subscription Plans -->
                <div class="subscription-plans">
                    <div class="plan-card basic">
                        <div class="plan-header">
                            <h4>Básico</h4>
                            <div class="plan-price">
                                <span class="price">Gratuito</span>
                            </div>
                        </div>
                        <div class="plan-features">
                            <ul>
                                <li><i class="bi bi-check"></i> Até 50 fotos por mês</li>
                                <li><i class="bi bi-check"></i> Comissão de 15%</li>
                                <li><i class="bi bi-check"></i> Galeria básica</li>
                                <li><i class="bi bi-check"></i> Suporte por email</li>
                                <li><i class="bi bi-x text-muted"></i> Marca d'água removível</li>
                                <li><i class="bi bi-x text-muted"></i> Analytics avançados</li>
                            </ul>
                        </div>
                        <button class="btn btn-outline-secondary" disabled>Plano Atual</button>
                    </div>

                    <div class="plan-card pro popular">
                        <div class="plan-badge">Mais Popular</div>
                        <div class="plan-header">
                            <h4>Profissional</h4>
                            <div class="plan-price">
                                <span class="currency">R$</span>
                                <span class="price">49</span>
                                <span class="period">/mês</span>
                            </div>
                        </div>
                        <div class="plan-features">
                            <ul>
                                <li><i class="bi bi-check"></i> Fotos ilimitadas</li>
                                <li><i class="bi bi-check"></i> Comissão de 10%</li>
                                <li><i class="bi bi-check"></i> Galeria personalizada</li>
                                <li><i class="bi bi-check"></i> Marca d'água removível</li>
                                <li><i class="bi bi-check"></i> Analytics avançados</li>
                                <li><i class="bi bi-check"></i> Suporte prioritário</li>
                                <li><i class="bi bi-check"></i> Integração redes sociais</li>
                            </ul>
                        </div>
                        <button class="btn btn-primary" onclick="selectPlan('pro')">Assinar Agora</button>
                    </div>

                    <div class="plan-card enterprise">
                        <div class="plan-header">
                            <h4>Empresarial</h4>
                            <div class="plan-price">
                                <span class="currency">R$</span>
                                <span class="price">99</span>
                                <span class="period">/mês</span>
                            </div>
                        </div>
                        <div class="plan-features">
                            <ul>
                                <li><i class="bi bi-check"></i> Tudo do Profissional</li>
                                <li><i class="bi bi-check"></i> Comissão de 5%</li>
                                <li><i class="bi bi-check"></i> Múltiplos fotógrafos</li>
                                <li><i class="bi bi-check"></i> API personalizada</li>
                                <li><i class="bi bi-check"></i> White label</li>
                                <li><i class="bi bi-check"></i> Gerente dedicado</li>
                                <li><i class="bi bi-check"></i> Relatórios personalizados</li>
                            </ul>
                        </div>
                        <button class="btn btn-success" onclick="selectPlan('enterprise')">Assinar Agora</button>
                    </div>
                </div>

                <!-- Feature Comparison -->
                <div class="feature-comparison">
                    <h5>Comparação Detalhada de Recursos</h5>
                    <div class="comparison-table">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Recurso</th>
                                    <th>Básico</th>
                                    <th>Profissional</th>
                                    <th>Empresarial</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Upload de Fotos</td>
                                    <td>50/mês</td>
                                    <td>Ilimitado</td>
                                    <td>Ilimitado</td>
                                </tr>
                                <tr>
                                    <td>Comissão da Plataforma</td>
                                    <td>15%</td>
                                    <td>10%</td>
                                    <td>5%</td>
                                </tr>
                                <tr>
                                    <td>Personalização de Galeria</td>
                                    <td><i class="bi bi-x text-danger"></i></td>
                                    <td><i class="bi bi-check text-success"></i></td>
                                    <td><i class="bi bi-check text-success"></i></td>
                                </tr>
                                <tr>
                                    <td>Marca d'água Removível</td>
                                    <td><i class="bi bi-x text-danger"></i></td>
                                    <td><i class="bi bi-check text-success"></i></td>
                                    <td><i class="bi bi-check text-success"></i></td>
                                </tr>
                                <tr>
                                    <td>Analytics Avançados</td>
                                    <td><i class="bi bi-x text-danger"></i></td>
                                    <td><i class="bi bi-check text-success"></i></td>
                                    <td><i class="bi bi-check text-success"></i></td>
                                </tr>
                                <tr>
                                    <td>Integração Redes Sociais</td>
                                    <td><i class="bi bi-x text-danger"></i></td>
                                    <td><i class="bi bi-check text-success"></i></td>
                                    <td><i class="bi bi-check text-success"></i></td>
                                </tr>
                                <tr>
                                    <td>API Personalizada</td>
                                    <td><i class="bi bi-x text-danger"></i></td>
                                    <td><i class="bi bi-x text-danger"></i></td>
                                    <td><i class="bi bi-check text-success"></i></td>
                                </tr>
                                <tr>
                                    <td>White Label</td>
                                    <td><i class="bi bi-x text-danger"></i></td>
                                    <td><i class="bi bi-x text-danger"></i></td>
                                    <td><i class="bi bi-check text-success"></i></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Subscription Management -->
                <div class="subscription-management" id="subscriptionManagement" style="display: none;">
                    <h5>Gerenciar Assinatura</h5>
                    
                    <div class="management-options">
                        <div class="option-card">
                            <h6><i class="bi bi-credit-card"></i> Método de Pagamento</h6>
                            <p>Cartão terminado em ****1234</p>
                            <button class="btn btn-sm btn-outline-primary" onclick="updatePaymentMethod()">Alterar</button>
                        </div>

                        <div class="option-card">
                            <h6><i class="bi bi-calendar"></i> Próxima Cobrança</h6>
                            <p>15 de Janeiro, 2024</p>
                            <button class="btn btn-sm btn-outline-secondary" onclick="viewBillingHistory()">Ver Histórico</button>
                        </div>

                        <div class="option-card">
                            <h6><i class="bi bi-arrow-up-circle"></i> Upgrade/Downgrade</h6>
                            <p>Altere seu plano a qualquer momento</p>
                            <button class="btn btn-sm btn-outline-success" onclick="changePlan()">Alterar Plano</button>
                        </div>

                        <div class="option-card danger">
                            <h6><i class="bi bi-x-circle"></i> Cancelar Assinatura</h6>
                            <p>Cancele a qualquer momento</p>
                            <button class="btn btn-sm btn-outline-danger" onclick="cancelSubscription()">Cancelar</button>
                        </div>
                    </div>
                </div>

                <!-- ROI Calculator -->
                <div class="roi-calculator">
                    <h5>Calculadora de ROI</h5>
                    <p>Veja quanto você pode economizar com um plano premium</p>
                    
                    <div class="calculator-inputs">
                        <div class="input-group">
                            <label>Fotos vendidas por mês</label>
                            <input type="number" class="form-control" id="photosPerMonth" value="100" min="1">
                        </div>
                        
                        <div class="input-group">
                            <label>Preço médio por foto</label>
                            <div class="input-group">
                                <span class="input-group-text">R$</span>
                                <input type="number" class="form-control" id="avgPhotoPrice" value="15" min="1" step="0.01">
                            </div>
                        </div>
                    </div>

                    <div class="calculator-results" id="calculatorResults">
                        <!-- Results will be shown here -->
                    </div>
                </div>

                <!-- Testimonials -->
                <div class="testimonials">
                    <h5>O que nossos fotógrafos dizem</h5>
                    <div class="testimonials-grid">
                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <p>"Com o plano Profissional, minhas vendas aumentaram 300% e a comissão menor me dá mais lucro."</p>
                            </div>
                            <div class="testimonial-author">
                                <img src="/images/photographer1.jpg" alt="Maria Silva">
                                <div>
                                    <h6>Maria Silva</h6>
                                    <span>Fotógrafa de Casamentos</span>
                                </div>
                            </div>
                        </div>

                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <p>"Os analytics avançados me ajudaram a entender melhor meu público e otimizar minha estratégia."</p>
                            </div>
                            <div class="testimonial-author">
                                <img src="/images/photographer2.jpg" alt="João Santos">
                                <div>
                                    <h6>João Santos</h6>
                                    <span>Fotógrafo de Eventos</span>
                                </div>
                            </div>
                        </div>

                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <p>"O plano Empresarial transformou meu estúdio. Agora gerencio toda minha equipe em uma plataforma."</p>
                            </div>
                            <div class="testimonial-author">
                                <img src="/images/photographer3.jpg" alt="Ana Costa">
                                <div>
                                    <h6>Ana Costa</h6>
                                    <span>Estúdio Fotográfico</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FAQ -->
                <div class="subscription-faq">
                    <h5>Perguntas Frequentes</h5>
                    <div class="faq-accordion">
                        <div class="faq-item">
                            <div class="faq-question" onclick="toggleFAQ(this)">
                                <h6>Posso cancelar a qualquer momento?</h6>
                                <i class="bi bi-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxa de cancelamento e você continuará tendo acesso aos recursos premium até o final do período pago.</p>
                            </div>
                        </div>

                        <div class="faq-item">
                            <div class="faq-question" onclick="toggleFAQ(this)">
                                <h6>Como funciona o upgrade/downgrade?</h6>
                                <i class="bi bi-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>Você pode alterar seu plano a qualquer momento. No upgrade, você paga a diferença proporcional. No downgrade, o crédito é aplicado na próxima fatura.</p>
                            </div>
                        </div>

                        <div class="faq-item">
                            <div class="faq-question" onclick="toggleFAQ(this)">
                                <h6>Há desconto para pagamento anual?</h6>
                                <i class="bi bi-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>Sim! Pagando anualmente, você economiza 20% em qualquer plano. O desconto é aplicado automaticamente na finalização.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Subscription Modal -->
                <div class="modal fade" id="subscriptionModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Finalizar Assinatura</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="subscription-summary" id="subscriptionSummary">
                                    <!-- Subscription summary will be shown here -->
                                </div>

                                <div class="payment-form">
                                    <h6>Informações de Pagamento</h6>
                                    <form id="paymentForm">
                                        <div class="form-group">
                                            <label>Nome no Cartão</label>
                                            <input type="text" class="form-control" id="cardName" required>
                                        </div>
                                        
                                        <div class="form-group">
                                            <label>Número do Cartão</label>
                                            <input type="text" class="form-control" id="cardNumber" placeholder="1234 5678 9012 3456" required>
                                        </div>
                                        
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>Validade</label>
                                                    <input type="text" class="form-control" id="cardExpiry" placeholder="MM/AA" required>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label>CVV</label>
                                                    <input type="text" class="form-control" id="cardCVV" placeholder="123" required>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="billing-cycle">
                                            <h6>Ciclo de Cobrança</h6>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="billingCycle" id="monthly" value="monthly" checked>
                                                <label class="form-check-label" for="monthly">Mensal</label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="billingCycle" id="yearly" value="yearly">
                                                <label class="form-check-label" for="yearly">
                                                    Anual <span class="badge bg-success">20% OFF</span>
                                                </label>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" onclick="processSubscription()">
                                    <i class="bi bi-credit-card"></i> Confirmar Assinatura
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupSubscriptionEvents();
        this.loadCurrentSubscription();
        this.calculateROI();
    }

    // Setup event listeners
    setupSubscriptionEvents() {
        // ROI calculator inputs
        ['photosPerMonth', 'avgPhotoPrice'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.calculateROI();
            });
        });

        // Billing cycle change
        document.querySelectorAll('input[name="billingCycle"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateSubscriptionSummary();
            });
        });

        // Card number formatting
        document.getElementById('cardNumber').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value;
        });

        // Card expiry formatting
        document.getElementById('cardExpiry').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{2})(\d)/, '$1/$2');
            e.target.value = value;
        });
    }

    // Load current subscription
    async loadCurrentSubscription() {
        try {
            const response = await fetch('/api/subscription/current', {
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });

            if (response.ok) {
                this.currentSubscription = await response.json();
                this.updateCurrentPlanStatus();
            }
        } catch (error) {
            console.error('Error loading current subscription:', error);
        }
    }

    // Update current plan status
    updateCurrentPlanStatus() {
        const container = document.getElementById('currentPlanStatus');
        if (!this.currentSubscription) {
            container.innerHTML = `
                <div class="current-plan-card basic">
                    <div class="plan-info">
                        <h5>Plano Básico (Gratuito)</h5>
                        <p>Você está usando o plano gratuito</p>
                    </div>
                    <div class="plan-actions">
                        <button class="btn btn-primary" onclick="selectPlan('pro')">Fazer Upgrade</button>
                    </div>
                </div>
            `;
            return;
        }

        const subscription = this.currentSubscription;
        container.innerHTML = `
            <div class="current-plan-card ${subscription.plan}">
                <div class="plan-info">
                    <h5>Plano ${this.getPlanDisplayName(subscription.plan)}</h5>
                    <p>Próxima cobrança: ${this.formatDate(subscription.next_billing_date)}</p>
                    <div class="plan-usage">
                        <div class="usage-item">
                            <span>Fotos enviadas este mês:</span>
                            <strong>${subscription.photos_uploaded}/${subscription.photo_limit === -1 ? '∞' : subscription.photo_limit}</strong>
                        </div>
                        <div class="usage-item">
                            <span>Comissão atual:</span>
                            <strong>${subscription.commission_rate}%</strong>
                        </div>
                    </div>
                </div>
                <div class="plan-actions">
                    <button class="btn btn-outline-primary" onclick="showSubscriptionManagement()">Gerenciar</button>
                    ${subscription.plan !== 'enterprise' ? '<button class="btn btn-success" onclick="upgradePlan()">Upgrade</button>' : ''}
                </div>
            </div>
        `;

        // Show management section if user has active subscription
        if (subscription.status === 'active') {
            document.getElementById('subscriptionManagement').style.display = 'block';
        }
    }

    // Get plan display name
    getPlanDisplayName(plan) {
        const names = {
            basic: 'Básico',
            pro: 'Profissional',
            enterprise: 'Empresarial'
        };
        return names[plan] || plan;
    }

    // Select plan
    selectPlan(planType) {
        this.selectedPlan = planType;
        this.showSubscriptionModal();
    }

    // Show subscription modal
    showSubscriptionModal() {
        const modal = new bootstrap.Modal(document.getElementById('subscriptionModal'));
        this.updateSubscriptionSummary();
        modal.show();
    }

    // Update subscription summary
    updateSubscriptionSummary() {
        const container = document.getElementById('subscriptionSummary');
        const billingCycle = document.querySelector('input[name="billingCycle"]:checked').value;
        
        const plans = {
            pro: { name: 'Profissional', monthly: 49, yearly: 470 },
            enterprise: { name: 'Empresarial', monthly: 99, yearly: 950 }
        };

        const plan = plans[this.selectedPlan];
        const price = billingCycle === 'yearly' ? plan.yearly : plan.monthly;
        const savings = billingCycle === 'yearly' ? (plan.monthly * 12 - plan.yearly) : 0;

        container.innerHTML = `
            <div class="summary-card">
                <h6>Plano ${plan.name}</h6>
                <div class="price-summary">
                    <div class="price-line">
                        <span>Valor ${billingCycle === 'yearly' ? 'anual' : 'mensal'}:</span>
                        <strong>R$ ${price.toFixed(2)}</strong>
                    </div>
                    ${savings > 0 ? `
                        <div class="price-line savings">
                            <span>Economia anual:</span>
                            <strong class="text-success">R$ ${savings.toFixed(2)}</strong>
                        </div>
                    ` : ''}
                    <div class="price-line total">
                        <span>Total:</span>
                        <strong>R$ ${price.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        `;
    }

    // Process subscription
    async processSubscription() {
        try {
            const formData = {
                plan: this.selectedPlan,
                billing_cycle: document.querySelector('input[name="billingCycle"]:checked').value,
                payment_method: {
                    card_name: document.getElementById('cardName').value,
                    card_number: document.getElementById('cardNumber').value.replace(/\s/g, ''),
                    card_expiry: document.getElementById('cardExpiry').value,
                    card_cvv: document.getElementById('cardCVV').value
                }
            };

            const response = await fetch('/api/subscription/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erro ao processar assinatura');
            }

            const result = await response.json();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('subscriptionModal'));
            modal.hide();
            
            // Show success message
            alert('Assinatura ativada com sucesso!');
            
            // Reload subscription data
            this.loadCurrentSubscription();

        } catch (error) {
            console.error('Error processing subscription:', error);
            alert('Erro ao processar assinatura: ' + error.message);
        }
    }

    // Calculate ROI
    calculateROI() {
        const photosPerMonth = parseInt(document.getElementById('photosPerMonth').value) || 0;
        const avgPrice = parseFloat(document.getElementById('avgPhotoPrice').value) || 0;
        
        const monthlyRevenue = photosPerMonth * avgPrice;
        
        // Calculate commissions
        const basicCommission = monthlyRevenue * 0.15;
        const proCommission = monthlyRevenue * 0.10;
        const enterpriseCommission = monthlyRevenue * 0.05;
        
        // Calculate savings
        const proSavings = basicCommission - proCommission - 49; // Pro plan cost
        const enterpriseSavings = basicCommission - enterpriseCommission - 99; // Enterprise plan cost
        
        const container = document.getElementById('calculatorResults');
        container.innerHTML = `
            <div class="roi-results">
                <h6>Análise de ROI Mensal</h6>
                <div class="roi-comparison">
                    <div class="roi-plan">
                        <h6>Plano Básico</h6>
                        <div class="roi-item">
                            <span>Receita:</span>
                            <strong>R$ ${monthlyRevenue.toFixed(2)}</strong>
                        </div>
                        <div class="roi-item">
                            <span>Comissão (15%):</span>
                            <strong class="text-danger">-R$ ${basicCommission.toFixed(2)}</strong>
                        </div>
                        <div class="roi-item total">
                            <span>Lucro líquido:</span>
                            <strong>R$ ${(monthlyRevenue - basicCommission).toFixed(2)}</strong>
                        </div>
                    </div>

                    <div class="roi-plan">
                        <h6>Plano Profissional</h6>
                        <div class="roi-item">
                            <span>Receita:</span>
                            <strong>R$ ${monthlyRevenue.toFixed(2)}</strong>
                        </div>
                        <div class="roi-item">
                            <span>Comissão (10%):</span>
                            <strong class="text-warning">-R$ ${proCommission.toFixed(2)}</strong>
                        </div>
                        <div class="roi-item">
                            <span>Mensalidade:</span>
                            <strong class="text-warning">-R$ 49.00</strong>
                        </div>
                        <div class="roi-item total">
                            <span>Lucro líquido:</span>
                            <strong class="text-success">R$ ${(monthlyRevenue - proCommission - 49).toFixed(2)}</strong>
                        </div>
                        <div class="roi-savings ${proSavings > 0 ? 'positive' : 'negative'}">
                            ${proSavings > 0 ? 'Economia' : 'Custo adicional'}: R$ ${Math.abs(proSavings).toFixed(2)}
                        </div>
                    </div>

                    <div class="roi-plan">
                        <h6>Plano Empresarial</h6>
                        <div class="roi-item">
                            <span>Receita:</span>
                            <strong>R$ ${monthlyRevenue.toFixed(2)}</strong>
                        </div>
                        <div class="roi-item">
                            <span>Comissão (5%):</span>
                            <strong class="text-success">-R$ ${enterpriseCommission.toFixed(2)}</strong>
                        </div>
                        <div class="roi-item">
                            <span>Mensalidade:</span>
                            <strong class="text-warning">-R$ 99.00</strong>
                        </div>
                        <div class="roi-item total">
                            <span>Lucro líquido:</span>
                            <strong class="text-success">R$ ${(monthlyRevenue - enterpriseCommission - 99).toFixed(2)}</strong>
                        </div>
                        <div class="roi-savings ${enterpriseSavings > 0 ? 'positive' : 'negative'}">
                            ${enterpriseSavings > 0 ? 'Economia' : 'Custo adicional'}: R$ ${Math.abs(enterpriseSavings).toFixed(2)}
                        </div>
                    </div>
                </div>

                <div class="roi-recommendation">
                    <h6>Recomendação</h6>
                    <p>${this.getROIRecommendation(photosPerMonth, monthlyRevenue, proSavings, enterpriseSavings)}</p>
                </div>
            </div>
        `;
    }

    // Get ROI recommendation
    getROIRecommendation(photos, revenue, proSavings, enterpriseSavings) {
        if (revenue < 500) {
            return "Com sua receita atual, o plano Básico pode ser suficiente. Considere um upgrade quando suas vendas aumentarem.";
        } else if (proSavings > 0 && enterpriseSavings <= proSavings) {
            return "O plano Profissional oferece o melhor custo-benefício para seu volume de vendas atual.";
        } else if (enterpriseSavings > 0) {
            return "Com seu alto volume de vendas, o plano Empresarial maximizará seus lucros com a menor comissão.";
        } else {
            return "Considere aumentar suas vendas para aproveitar melhor os benefícios dos planos premium.";
        }
    }

    // Show subscription management
    showSubscriptionManagement() {
        document.getElementById('subscriptionManagement').style.display = 'block';
        document.getElementById('subscriptionManagement').scrollIntoView({ behavior: 'smooth' });
    }

    // Update payment method
    updatePaymentMethod() {
        alert('Funcionalidade de atualização de método de pagamento em desenvolvimento');
    }

    // View billing history
    viewBillingHistory() {
        alert('Funcionalidade de histórico de cobrança em desenvolvimento');
    }

    // Change plan
    changePlan() {
        alert('Funcionalidade de alteração de plano em desenvolvimento');
    }

    // Cancel subscription
    async cancelSubscription() {
        if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) {
            return;
        }

        try {
            const response = await fetch('/api/subscription/cancel', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.getAuthToken()}` }
            });

            if (response.ok) {
                alert('Assinatura cancelada com sucesso');
                this.loadCurrentSubscription();
            }
        } catch (error) {
            console.error('Error canceling subscription:', error);
            alert('Erro ao cancelar assinatura');
        }
    }

    // Toggle FAQ
    toggleFAQ(element) {
        const faqItem = element.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = element.querySelector('i');

        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            icon.classList.remove('bi-chevron-up');
            icon.classList.add('bi-chevron-down');
        } else {
            answer.style.display = 'block';
            icon.classList.remove('bi-chevron-down');
            icon.classList.add('bi-chevron-up');
        }
    }

    // Format date
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }
}

// Global functions
function selectPlan(planType) {
    premiumSubscription.selectPlan(planType);
}

function processSubscription() {
    premiumSubscription.processSubscription();
}

function showSubscriptionManagement() {
    premiumSubscription.showSubscriptionManagement();
}

function updatePaymentMethod() {
    premiumSubscription.updatePaymentMethod();
}

function viewBillingHistory() {
    premiumSubscription.viewBillingHistory();
}

function changePlan() {
    premiumSubscription.changePlan();
}

function cancelSubscription() {
    premiumSubscription.cancelSubscription();
}

function upgradePlan() {
    premiumSubscription.selectPlan('enterprise');
}

function toggleFAQ(element) {
    premiumSubscription.toggleFAQ(element);
}

// Initialize premium subscription system
const premiumSubscription = new PremiumSubscriptionSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PremiumSubscriptionSystem;
}

