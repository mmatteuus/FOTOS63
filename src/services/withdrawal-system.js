// Withdrawal System for Fotos63
// Sistema de Saque Rápido e Flexível

class WithdrawalSystem {
    constructor() {
        this.minWithdrawal = 10.00; // Minimum withdrawal amount
        this.maxWithdrawal = 5000.00; // Maximum withdrawal amount per transaction
        this.dailyLimit = 10000.00; // Daily withdrawal limit
        this.withdrawalMethods = {
            pix: { fee: 0, processingTime: 'instant', minAmount: 1.00 },
            bank_transfer: { fee: 0, processingTime: '1-2 business days', minAmount: 10.00 },
            digital_wallet: { fee: 0.99, processingTime: 'instant', minAmount: 5.00 },
            express: { fee: 2.99, processingTime: '1 hour', minAmount: 20.00 }
        };
        this.initializeSystem();
    }

    initializeSystem() {
        this.loadPhotographerBalance();
        this.loadWithdrawalHistory();
    }

    // Load photographer's current balance
    async loadPhotographerBalance() {
        try {
            const response = await fetch('/api/photographer/balance', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                const balanceData = await response.json();
                this.currentBalance = balanceData.available_balance;
                this.pendingBalance = balanceData.pending_balance;
                this.totalEarnings = balanceData.total_earnings;
                this.updateBalanceDisplay();
            }
        } catch (error) {
            console.error('Error loading balance:', error);
        }
    }

    // Load withdrawal history
    async loadWithdrawalHistory() {
        try {
            const response = await fetch('/api/photographer/withdrawals', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                this.withdrawalHistory = await response.json();
            }
        } catch (error) {
            console.error('Error loading withdrawal history:', error);
        }
    }

    // Create withdrawal interface
    createWithdrawalUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = `
            <div class="withdrawal-system">
                <div class="withdrawal-header">
                    <h3><i class="bi bi-cash-coin"></i> Sacar Ganhos</h3>
                    <p>Transfira seus ganhos de forma rápida e segura</p>
                </div>

                <!-- Balance Overview -->
                <div class="balance-overview">
                    <div class="balance-card available">
                        <div class="balance-icon">
                            <i class="bi bi-wallet2"></i>
                        </div>
                        <div class="balance-info">
                            <h4>Saldo Disponível</h4>
                            <div class="balance-amount" id="availableBalance">R$ 0,00</div>
                            <small>Disponível para saque</small>
                        </div>
                    </div>

                    <div class="balance-card pending">
                        <div class="balance-icon">
                            <i class="bi bi-clock-history"></i>
                        </div>
                        <div class="balance-info">
                            <h4>Saldo Pendente</h4>
                            <div class="balance-amount" id="pendingBalance">R$ 0,00</div>
                            <small>Em processamento</small>
                        </div>
                    </div>

                    <div class="balance-card total">
                        <div class="balance-icon">
                            <i class="bi bi-graph-up"></i>
                        </div>
                        <div class="balance-info">
                            <h4>Total de Ganhos</h4>
                            <div class="balance-amount" id="totalEarnings">R$ 0,00</div>
                            <small>Ganhos acumulados</small>
                        </div>
                    </div>
                </div>

                <!-- Withdrawal Form -->
                <div class="withdrawal-form">
                    <div class="form-section">
                        <h4>Solicitar Saque</h4>
                        
                        <div class="amount-input">
                            <label>Valor do Saque</label>
                            <div class="input-group">
                                <span class="input-group-text">R$</span>
                                <input type="number" class="form-control" id="withdrawalAmount" 
                                       placeholder="0,00" min="1" step="0.01" max="${this.currentBalance || 0}">
                            </div>
                            <div class="amount-suggestions">
                                <button class="btn btn-sm btn-outline-secondary" onclick="setWithdrawalAmount(50)">R$ 50</button>
                                <button class="btn btn-sm btn-outline-secondary" onclick="setWithdrawalAmount(100)">R$ 100</button>
                                <button class="btn btn-sm btn-outline-secondary" onclick="setWithdrawalAmount(250)">R$ 250</button>
                                <button class="btn btn-sm btn-outline-secondary" onclick="setWithdrawalAmount('all')">Tudo</button>
                            </div>
                        </div>

                        <div class="withdrawal-methods">
                            <label>Método de Saque</label>
                            <div class="method-options">
                                <div class="method-option selected" data-method="pix">
                                    <div class="method-icon">
                                        <i class="bi bi-qr-code"></i>
                                    </div>
                                    <div class="method-info">
                                        <h5>PIX</h5>
                                        <p>Instantâneo • Sem taxa</p>
                                    </div>
                                    <div class="method-badge">
                                        <span class="badge bg-success">Recomendado</span>
                                    </div>
                                </div>

                                <div class="method-option" data-method="bank_transfer">
                                    <div class="method-icon">
                                        <i class="bi bi-bank"></i>
                                    </div>
                                    <div class="method-info">
                                        <h5>Transferência Bancária</h5>
                                        <p>1-2 dias úteis • Sem taxa</p>
                                    </div>
                                </div>

                                <div class="method-option" data-method="digital_wallet">
                                    <div class="method-icon">
                                        <i class="bi bi-phone"></i>
                                    </div>
                                    <div class="method-info">
                                        <h5>Carteira Digital</h5>
                                        <p>Instantâneo • Taxa R$ 0,99</p>
                                    </div>
                                </div>

                                <div class="method-option" data-method="express">
                                    <div class="method-icon">
                                        <i class="bi bi-lightning"></i>
                                    </div>
                                    <div class="method-info">
                                        <h5>Saque Expresso</h5>
                                        <p>1 hora • Taxa R$ 2,99</p>
                                    </div>
                                    <div class="method-badge">
                                        <span class="badge bg-warning">Express</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Method-specific forms -->
                        <div class="method-forms">
                            <!-- PIX Form -->
                            <div class="method-form active" id="pix-form">
                                <div class="form-group">
                                    <label>Chave PIX</label>
                                    <select class="form-control" id="pixKeyType">
                                        <option value="cpf">CPF</option>
                                        <option value="email">E-mail</option>
                                        <option value="phone">Telefone</option>
                                        <option value="random">Chave Aleatória</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control" id="pixKey" placeholder="Digite sua chave PIX">
                                </div>
                            </div>

                            <!-- Bank Transfer Form -->
                            <div class="method-form" id="bank_transfer-form">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>Banco</label>
                                            <select class="form-control" id="bankCode">
                                                <option value="">Selecione o banco</option>
                                                <option value="001">Banco do Brasil</option>
                                                <option value="104">Caixa Econômica</option>
                                                <option value="237">Bradesco</option>
                                                <option value="341">Itaú</option>
                                                <option value="033">Santander</option>
                                                <option value="260">Nu Pagamentos</option>
                                                <option value="077">Banco Inter</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label>Tipo de Conta</label>
                                            <select class="form-control" id="accountType">
                                                <option value="checking">Conta Corrente</option>
                                                <option value="savings">Poupança</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label>Agência</label>
                                            <input type="text" class="form-control" id="bankBranch" placeholder="0000">
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <label>Conta</label>
                                            <input type="text" class="form-control" id="bankAccount" placeholder="00000-0">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Digital Wallet Form -->
                            <div class="method-form" id="digital_wallet-form">
                                <div class="form-group">
                                    <label>Carteira Digital</label>
                                    <select class="form-control" id="walletProvider">
                                        <option value="picpay">PicPay</option>
                                        <option value="mercadopago">Mercado Pago</option>
                                        <option value="paypal">PayPal</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>E-mail ou Telefone</label>
                                    <input type="text" class="form-control" id="walletIdentifier" placeholder="seu@email.com ou (11) 99999-9999">
                                </div>
                            </div>

                            <!-- Express Form -->
                            <div class="method-form" id="express-form">
                                <div class="alert alert-info">
                                    <i class="bi bi-info-circle me-2"></i>
                                    O saque expresso utiliza sua chave PIX cadastrada para transferência em até 1 hora.
                                </div>
                                <div class="form-group">
                                    <label>Chave PIX para Saque Expresso</label>
                                    <input type="text" class="form-control" id="expressPixKey" placeholder="Digite sua chave PIX">
                                </div>
                            </div>
                        </div>

                        <!-- Withdrawal Summary -->
                        <div class="withdrawal-summary">
                            <div class="summary-row">
                                <span>Valor solicitado:</span>
                                <span id="summaryAmount">R$ 0,00</span>
                            </div>
                            <div class="summary-row">
                                <span>Taxa de processamento:</span>
                                <span id="summaryFee">R$ 0,00</span>
                            </div>
                            <div class="summary-row total">
                                <span>Valor a receber:</span>
                                <span id="summaryTotal">R$ 0,00</span>
                            </div>
                            <div class="summary-row">
                                <span>Tempo de processamento:</span>
                                <span id="summaryTime">-</span>
                            </div>
                        </div>

                        <button class="btn btn-primary btn-lg w-100" id="submitWithdrawal" disabled>
                            <i class="bi bi-arrow-right-circle"></i> Solicitar Saque
                        </button>
                    </div>
                </div>

                <!-- Withdrawal History -->
                <div class="withdrawal-history">
                    <div class="history-header">
                        <h4>Histórico de Saques</h4>
                        <button class="btn btn-outline-secondary btn-sm" onclick="refreshWithdrawalHistory()">
                            <i class="bi bi-arrow-clockwise"></i> Atualizar
                        </button>
                    </div>
                    <div class="history-list" id="withdrawalHistoryList">
                        <!-- History items will be loaded here -->
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <h4>Ações Rápidas</h4>
                    <div class="action-buttons">
                        <button class="btn btn-outline-primary" onclick="scheduleWithdrawal()">
                            <i class="bi bi-calendar-event"></i> Agendar Saque
                        </button>
                        <button class="btn btn-outline-secondary" onclick="downloadStatement()">
                            <i class="bi bi-download"></i> Extrato
                        </button>
                        <button class="btn btn-outline-info" onclick="viewTaxInfo()">
                            <i class="bi bi-info-circle"></i> Info Fiscal
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupWithdrawalEvents();
        this.updateBalanceDisplay();
        this.loadWithdrawalHistoryUI();
    }

    // Setup event listeners
    setupWithdrawalEvents() {
        // Amount input
        document.getElementById('withdrawalAmount').addEventListener('input', (e) => {
            this.updateWithdrawalSummary();
        });

        // Method selection
        document.querySelectorAll('.method-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectWithdrawalMethod(e.currentTarget.dataset.method);
            });
        });

        // Submit withdrawal
        document.getElementById('submitWithdrawal').addEventListener('click', () => {
            this.processWithdrawal();
        });

        // Form validation
        this.setupFormValidation();
    }

    // Select withdrawal method
    selectWithdrawalMethod(method) {
        // Update UI
        document.querySelectorAll('.method-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('selected');

        // Show corresponding form
        document.querySelectorAll('.method-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById(`${method}-form`).classList.add('active');

        this.selectedMethod = method;
        this.updateWithdrawalSummary();
    }

    // Update withdrawal summary
    updateWithdrawalSummary() {
        const amount = parseFloat(document.getElementById('withdrawalAmount').value) || 0;
        const method = this.selectedMethod || 'pix';
        const methodInfo = this.withdrawalMethods[method];
        
        const fee = methodInfo.fee;
        const total = Math.max(0, amount - fee);

        document.getElementById('summaryAmount').textContent = this.formatCurrency(amount);
        document.getElementById('summaryFee').textContent = this.formatCurrency(fee);
        document.getElementById('summaryTotal').textContent = this.formatCurrency(total);
        document.getElementById('summaryTime').textContent = methodInfo.processingTime;

        // Enable/disable submit button
        const submitButton = document.getElementById('submitWithdrawal');
        const isValid = amount >= methodInfo.minAmount && amount <= this.currentBalance && this.validateCurrentForm();
        submitButton.disabled = !isValid;
    }

    // Validate current form
    validateCurrentForm() {
        const method = this.selectedMethod || 'pix';
        const form = document.getElementById(`${method}-form`);
        const requiredInputs = form.querySelectorAll('input[required], select[required]');
        
        return Array.from(requiredInputs).every(input => input.value.trim() !== '');
    }

    // Setup form validation
    setupFormValidation() {
        // Real-time validation for all forms
        document.querySelectorAll('.method-form input, .method-form select').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
                this.updateWithdrawalSummary();
            });
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (field.id) {
            case 'pixKey':
                isValid = this.validatePixKey(value, document.getElementById('pixKeyType').value);
                errorMessage = 'Chave PIX inválida';
                break;
            case 'bankAccount':
                isValid = /^\d{4,}-?\d$/.test(value);
                errorMessage = 'Número da conta inválido';
                break;
            case 'bankBranch':
                isValid = /^\d{4}$/.test(value);
                errorMessage = 'Agência deve ter 4 dígitos';
                break;
            case 'walletIdentifier':
                isValid = /^[\w\.-]+@[\w\.-]+\.\w+$/.test(value) || /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value);
                errorMessage = 'E-mail ou telefone inválido';
                break;
        }

        field.classList.toggle('is-invalid', !isValid);
        
        // Show/hide error message
        let errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (!isValid && !errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        } else if (isValid && errorDiv) {
            errorDiv.remove();
        }

        return isValid;
    }

    // Validate PIX key
    validatePixKey(key, type) {
        switch (type) {
            case 'cpf':
                return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(key) || /^\d{11}$/.test(key);
            case 'email':
                return /^[\w\.-]+@[\w\.-]+\.\w+$/.test(key);
            case 'phone':
                return /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(key) || /^\d{10,11}$/.test(key);
            case 'random':
                return /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(key);
            default:
                return key.length > 0;
        }
    }

    // Process withdrawal
    async processWithdrawal() {
        try {
            const withdrawalData = this.collectWithdrawalData();
            
            // Validate withdrawal
            const validation = this.validateWithdrawal(withdrawalData);
            if (!validation.isValid) {
                alert(validation.message);
                return;
            }

            // Show confirmation
            if (!await this.confirmWithdrawal(withdrawalData)) {
                return;
            }

            // Submit withdrawal request
            const response = await fetch('/api/photographer/withdrawal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(withdrawalData)
            });

            if (!response.ok) {
                throw new Error('Erro ao processar saque');
            }

            const result = await response.json();
            
            // Show success message
            this.showWithdrawalSuccess(result);
            
            // Refresh data
            await this.loadPhotographerBalance();
            await this.loadWithdrawalHistory();
            this.loadWithdrawalHistoryUI();
            
            // Reset form
            this.resetWithdrawalForm();

        } catch (error) {
            console.error('Withdrawal error:', error);
            alert('Erro ao processar saque: ' + error.message);
        }
    }

    // Collect withdrawal data from form
    collectWithdrawalData() {
        const amount = parseFloat(document.getElementById('withdrawalAmount').value);
        const method = this.selectedMethod;
        const methodInfo = this.withdrawalMethods[method];
        
        const baseData = {
            amount: amount,
            method: method,
            fee: methodInfo.fee,
            net_amount: amount - methodInfo.fee,
            processing_time: methodInfo.processingTime
        };

        // Add method-specific data
        switch (method) {
            case 'pix':
                return {
                    ...baseData,
                    pix_key_type: document.getElementById('pixKeyType').value,
                    pix_key: document.getElementById('pixKey').value
                };
            case 'bank_transfer':
                return {
                    ...baseData,
                    bank_code: document.getElementById('bankCode').value,
                    account_type: document.getElementById('accountType').value,
                    branch: document.getElementById('bankBranch').value,
                    account: document.getElementById('bankAccount').value
                };
            case 'digital_wallet':
                return {
                    ...baseData,
                    wallet_provider: document.getElementById('walletProvider').value,
                    wallet_identifier: document.getElementById('walletIdentifier').value
                };
            case 'express':
                return {
                    ...baseData,
                    express_pix_key: document.getElementById('expressPixKey').value
                };
            default:
                return baseData;
        }
    }

    // Validate withdrawal request
    validateWithdrawal(data) {
        if (data.amount < this.minWithdrawal) {
            return { isValid: false, message: `Valor mínimo para saque é ${this.formatCurrency(this.minWithdrawal)}` };
        }

        if (data.amount > this.maxWithdrawal) {
            return { isValid: false, message: `Valor máximo por saque é ${this.formatCurrency(this.maxWithdrawal)}` };
        }

        if (data.amount > this.currentBalance) {
            return { isValid: false, message: 'Saldo insuficiente' };
        }

        const methodInfo = this.withdrawalMethods[data.method];
        if (data.amount < methodInfo.minAmount) {
            return { isValid: false, message: `Valor mínimo para este método é ${this.formatCurrency(methodInfo.minAmount)}` };
        }

        return { isValid: true };
    }

    // Confirm withdrawal with user
    async confirmWithdrawal(data) {
        const message = `
            Confirmar saque de ${this.formatCurrency(data.amount)}?
            
            Método: ${this.getMethodDisplayName(data.method)}
            Taxa: ${this.formatCurrency(data.fee)}
            Valor líquido: ${this.formatCurrency(data.net_amount)}
            Tempo: ${data.processing_time}
        `;

        return confirm(message);
    }

    // Show withdrawal success message
    showWithdrawalSuccess(result) {
        const message = `
            <div class="alert alert-success">
                <h5><i class="bi bi-check-circle"></i> Saque solicitado com sucesso!</h5>
                <p><strong>ID:</strong> ${result.withdrawal_id}</p>
                <p><strong>Valor:</strong> ${this.formatCurrency(result.net_amount)}</p>
                <p><strong>Status:</strong> ${result.status}</p>
                <p><strong>Previsão:</strong> ${result.estimated_completion}</p>
            </div>
        `;

        // Show in a modal or alert
        alert('Saque solicitado com sucesso! ID: ' + result.withdrawal_id);
    }

    // Reset withdrawal form
    resetWithdrawalForm() {
        document.getElementById('withdrawalAmount').value = '';
        document.querySelectorAll('.method-form input, .method-form select').forEach(input => {
            if (input.type !== 'submit') {
                input.value = '';
                input.classList.remove('is-invalid');
            }
        });
        this.updateWithdrawalSummary();
    }

    // Update balance display
    updateBalanceDisplay() {
        if (document.getElementById('availableBalance')) {
            document.getElementById('availableBalance').textContent = this.formatCurrency(this.currentBalance || 0);
        }
        if (document.getElementById('pendingBalance')) {
            document.getElementById('pendingBalance').textContent = this.formatCurrency(this.pendingBalance || 0);
        }
        if (document.getElementById('totalEarnings')) {
            document.getElementById('totalEarnings').textContent = this.formatCurrency(this.totalEarnings || 0);
        }
    }

    // Load withdrawal history UI
    loadWithdrawalHistoryUI() {
        const historyList = document.getElementById('withdrawalHistoryList');
        if (!historyList || !this.withdrawalHistory) return;

        if (this.withdrawalHistory.length === 0) {
            historyList.innerHTML = '<p class="text-muted text-center">Nenhum saque realizado ainda.</p>';
            return;
        }

        historyList.innerHTML = this.withdrawalHistory.map(withdrawal => `
            <div class="history-item">
                <div class="history-info">
                    <div class="history-amount">${this.formatCurrency(withdrawal.net_amount)}</div>
                    <div class="history-method">${this.getMethodDisplayName(withdrawal.method)}</div>
                    <div class="history-date">${this.formatDate(withdrawal.created_at)}</div>
                </div>
                <div class="history-status">
                    <span class="badge bg-${this.getStatusColor(withdrawal.status)}">${withdrawal.status}</span>
                </div>
                <div class="history-actions">
                    <button class="btn btn-sm btn-outline-secondary" onclick="viewWithdrawalDetails('${withdrawal.id}')">
                        <i class="bi bi-eye"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Get method display name
    getMethodDisplayName(method) {
        const names = {
            pix: 'PIX',
            bank_transfer: 'Transferência Bancária',
            digital_wallet: 'Carteira Digital',
            express: 'Saque Expresso'
        };
        return names[method] || method;
    }

    // Get status color for badges
    getStatusColor(status) {
        const colors = {
            pending: 'warning',
            processing: 'info',
            completed: 'success',
            failed: 'danger',
            cancelled: 'secondary'
        };
        return colors[status] || 'secondary';
    }

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount || 0);
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

    // Schedule withdrawal
    async scheduleWithdrawal() {
        // Implementation for scheduled withdrawals
        alert('Funcionalidade de agendamento em desenvolvimento');
    }

    // Download statement
    async downloadStatement() {
        try {
            const response = await fetch('/api/photographer/statement', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `extrato-fotos63-${new Date().toISOString().split('T')[0]}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error downloading statement:', error);
            alert('Erro ao baixar extrato');
        }
    }

    // View tax information
    viewTaxInfo() {
        const taxInfo = `
            <div class="tax-info">
                <h4>Informações Fiscais</h4>
                <p><strong>Regime Tributário:</strong> Pessoa Física</p>
                <p><strong>Retenção IR:</strong> Não aplicável para valores até R$ 1.903,98/mês</p>
                <p><strong>Documentação:</strong> Recibo de Pagamento Autônomo (RPA)</p>
                <p><strong>Declaração:</strong> Valores devem ser declarados como rendimentos de trabalho não assalariado</p>
                <hr>
                <small>Consulte sempre um contador para orientações específicas sobre sua situação fiscal.</small>
            </div>
        `;
        
        // Show in modal or alert
        alert('Informações fiscais: Consulte um contador para orientações específicas sobre declaração de rendimentos.');
    }
}

// Global functions for UI interactions
function setWithdrawalAmount(amount) {
    const input = document.getElementById('withdrawalAmount');
    if (amount === 'all') {
        input.value = withdrawalSystem.currentBalance || 0;
    } else {
        input.value = amount;
    }
    withdrawalSystem.updateWithdrawalSummary();
}

function refreshWithdrawalHistory() {
    withdrawalSystem.loadWithdrawalHistory().then(() => {
        withdrawalSystem.loadWithdrawalHistoryUI();
    });
}

function viewWithdrawalDetails(withdrawalId) {
    // Implementation for viewing withdrawal details
    alert(`Detalhes do saque ${withdrawalId} - Em desenvolvimento`);
}

function scheduleWithdrawal() {
    withdrawalSystem.scheduleWithdrawal();
}

function downloadStatement() {
    withdrawalSystem.downloadStatement();
}

function viewTaxInfo() {
    withdrawalSystem.viewTaxInfo();
}

// Initialize withdrawal system
const withdrawalSystem = new WithdrawalSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WithdrawalSystem;
}

