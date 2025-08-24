// Payment Integration for Fotos63
// Integração com Stripe e PagSeguro para processamento de pagamentos

class PaymentProcessor {
    constructor() {
        this.stripe = null;
        this.pagSeguro = null;
        this.initializePaymentGateways();
    }

    async initializePaymentGateways() {
        try {
            // Initialize Stripe
            if (window.Stripe) {
                this.stripe = Stripe(process.env.STRIPE_PUBLIC_KEY || 'pk_test_...');
                console.log('Stripe inicializado');
            }

            // Initialize PagSeguro
            if (window.PagSeguroDirectPayment) {
                PagSeguroDirectPayment.setSessionId(await this.getPagSeguroSessionId());
                console.log('PagSeguro inicializado');
            }
        } catch (error) {
            console.error('Erro ao inicializar gateways de pagamento:', error);
        }
    }

    async getPagSeguroSessionId() {
        try {
            const response = await fetch('/api/pagseguro/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });
            const data = await response.json();
            return data.sessionId;
        } catch (error) {
            console.error('Erro ao obter session ID do PagSeguro:', error);
            return null;
        }
    }

    // Stripe Payment Processing
    async processStripePayment(paymentData) {
        try {
            const { clientSecret } = await this.createStripePaymentIntent(paymentData);
            
            const result = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: paymentData.cardElement,
                    billing_details: {
                        name: paymentData.customerName,
                        email: paymentData.customerEmail,
                    },
                }
            });

            if (result.error) {
                throw new Error(result.error.message);
            }

            return {
                success: true,
                paymentIntent: result.paymentIntent,
                transactionId: result.paymentIntent.id
            };
        } catch (error) {
            console.error('Erro no pagamento Stripe:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async createStripePaymentIntent(paymentData) {
        const response = await fetch('/api/stripe/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify({
                amount: paymentData.amount * 100, // Stripe uses cents
                currency: 'brl',
                metadata: {
                    photoIds: paymentData.photoIds.join(','),
                    customerId: paymentData.customerId,
                    photographerId: paymentData.photographerId
                }
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao criar payment intent');
        }

        return await response.json();
    }

    // PagSeguro Payment Processing
    async processPagSeguroPayment(paymentData) {
        try {
            const cardToken = await this.createPagSeguroCardToken(paymentData.cardData);
            
            const transactionData = {
                paymentMode: 'default',
                paymentMethod: 'creditCard',
                receiverEmail: process.env.PAGSEGURO_EMAIL,
                currency: 'BRL',
                extraAmount: '0.00',
                itemId1: paymentData.photoIds[0],
                itemDescription1: 'Compra de fotos - Fotos63',
                itemAmount1: paymentData.amount.toFixed(2),
                itemQuantity1: paymentData.photoIds.length,
                notificationURL: `${window.location.origin}/api/pagseguro/notification`,
                reference: `FOTOS63_${Date.now()}`,
                senderName: paymentData.customerName,
                senderCPF: paymentData.customerCPF,
                senderAreaCode: paymentData.customerPhone.substring(0, 2),
                senderPhone: paymentData.customerPhone.substring(2),
                senderEmail: paymentData.customerEmail,
                creditCardToken: cardToken,
                installmentQuantity: paymentData.installments || 1,
                installmentValue: (paymentData.amount / (paymentData.installments || 1)).toFixed(2),
                noInterestInstallmentQuantity: 3,
                creditCardHolderName: paymentData.cardData.holderName,
                creditCardHolderCPF: paymentData.cardData.holderCPF,
                creditCardHolderBirthDate: paymentData.cardData.holderBirthDate,
                creditCardHolderAreaCode: paymentData.cardData.holderPhone.substring(0, 2),
                creditCardHolderPhone: paymentData.cardData.holderPhone.substring(2),
                billingAddressStreet: paymentData.billingAddress.street,
                billingAddressNumber: paymentData.billingAddress.number,
                billingAddressComplement: paymentData.billingAddress.complement,
                billingAddressDistrict: paymentData.billingAddress.district,
                billingAddressPostalCode: paymentData.billingAddress.postalCode,
                billingAddressCity: paymentData.billingAddress.city,
                billingAddressState: paymentData.billingAddress.state,
                billingAddressCountry: 'BRA'
            };

            const result = await this.submitPagSeguroTransaction(transactionData);
            
            return {
                success: true,
                transactionId: result.code,
                status: result.status
            };
        } catch (error) {
            console.error('Erro no pagamento PagSeguro:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async createPagSeguroCardToken(cardData) {
        return new Promise((resolve, reject) => {
            PagSeguroDirectPayment.createCardToken({
                cardNumber: cardData.number,
                brand: cardData.brand,
                cvv: cardData.cvv,
                expirationMonth: cardData.expirationMonth,
                expirationYear: cardData.expirationYear,
                success: function(response) {
                    resolve(response.card.token);
                },
                error: function(response) {
                    reject(new Error('Erro ao criar token do cartão'));
                }
            });
        });
    }

    async submitPagSeguroTransaction(transactionData) {
        const response = await fetch('/api/pagseguro/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify(transactionData)
        });

        if (!response.ok) {
            throw new Error('Erro ao processar transação PagSeguro');
        }

        return await response.json();
    }

    // PIX Payment Processing
    async createPixPayment(paymentData) {
        try {
            const response = await fetch('/api/pix/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    amount: paymentData.amount,
                    description: 'Compra de fotos - Fotos63',
                    photoIds: paymentData.photoIds,
                    customerId: paymentData.customerId,
                    photographerId: paymentData.photographerId,
                    customerName: paymentData.customerName,
                    customerEmail: paymentData.customerEmail,
                    customerCPF: paymentData.customerCPF
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao criar pagamento PIX');
            }

            const data = await response.json();
            
            return {
                success: true,
                pixCode: data.pixCode,
                qrCode: data.qrCode,
                transactionId: data.transactionId,
                expiresAt: data.expiresAt
            };
        } catch (error) {
            console.error('Erro ao criar pagamento PIX:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Payment Status Checking
    async checkPaymentStatus(transactionId, gateway = 'stripe') {
        try {
            const response = await fetch(`/api/payment/status/${gateway}/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao verificar status do pagamento');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao verificar status:', error);
            return { success: false, error: error.message };
        }
    }

    // Webhook Processing
    async processWebhook(webhookData, gateway) {
        try {
            const response = await fetch(`/api/webhook/${gateway}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(webhookData)
            });

            return await response.json();
        } catch (error) {
            console.error('Erro ao processar webhook:', error);
            return { success: false, error: error.message };
        }
    }

    // Refund Processing
    async processRefund(transactionId, amount, gateway = 'stripe') {
        try {
            const response = await fetch(`/api/refund/${gateway}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    transactionId,
                    amount,
                    reason: 'requested_by_customer'
                })
            });

            if (!response.ok) {
                throw new Error('Erro ao processar reembolso');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro no reembolso:', error);
            return { success: false, error: error.message };
        }
    }

    // Utility Methods
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }

    validateCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
        
        const cpfDigits = cpf.split('').map(el => +el);
        const rest = (count) => (cpfDigits.slice(0, count-12)
            .reduce((soma, el, index) => (soma + el * (count-index)), 0) * 10) % 11 % 10;
        
        return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
    }

    validateCardNumber(number) {
        // Luhn algorithm
        const digits = number.replace(/\D/g, '').split('').map(Number);
        let sum = 0;
        let isEven = false;
        
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = digits[i];
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }

    getCardBrand(number) {
        const patterns = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/,
            discover: /^6(?:011|5)/,
            elo: /^(4011|4312|4389|4514|4573|6277|6362|6363|6504|6505|6516)/,
            hipercard: /^(3841|6062)/
        };

        for (const [brand, pattern] of Object.entries(patterns)) {
            if (pattern.test(number)) {
                return brand;
            }
        }
        
        return 'unknown';
    }

    // Commission Calculation
    calculateCommission(amount, photographerTier = 'basic') {
        const commissionRates = {
            basic: 0.15,      // 15%
            premium: 0.10,    // 10%
            pro: 0.05         // 5%
        };

        const rate = commissionRates[photographerTier] || commissionRates.basic;
        const commission = amount * rate;
        const photographerEarning = amount - commission;

        return {
            totalAmount: amount,
            commission: commission,
            photographerEarning: photographerEarning,
            commissionRate: rate
        };
    }

    // Payment Analytics
    async getPaymentAnalytics(period = '30d') {
        try {
            const response = await fetch(`/api/analytics/payments?period=${period}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao obter analytics de pagamento');
            }

            return await response.json();
        } catch (error) {
            console.error('Erro ao obter analytics:', error);
            return { success: false, error: error.message };
        }
    }
}

// WhatsApp Integration
class WhatsAppIntegration {
    constructor() {
        this.apiUrl = 'https://api.whatsapp.com/send';
        this.businessPhone = process.env.WHATSAPP_BUSINESS_PHONE || '5563999999999';
    }

    sendPurchaseNotification(purchaseData) {
        const message = this.formatPurchaseMessage(purchaseData);
        const url = `${this.apiUrl}?phone=${this.businessPhone}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    sendPhotographerNotification(saleData) {
        const message = this.formatSaleMessage(saleData);
        const url = `${this.apiUrl}?phone=${saleData.photographerPhone}&text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    formatPurchaseMessage(data) {
        return `🎉 *Nova compra realizada!*

📸 *Fotos63* - Marketplace de Fotos

👤 *Cliente:* ${data.customerName}
📧 *Email:* ${data.customerEmail}
🖼️ *Fotos:* ${data.photoCount} foto(s)
💰 *Valor:* ${this.formatCurrency(data.amount)}
🆔 *Pedido:* #${data.orderId}

Obrigado por escolher o Fotos63! 📷✨`;
    }

    formatSaleMessage(data) {
        return `💰 *Parabéns! Você fez uma venda!*

📸 *Fotos63* - Sua foto foi vendida

🖼️ *Foto:* ${data.photoTitle}
👤 *Comprador:* ${data.customerName}
💰 *Valor:* ${this.formatCurrency(data.amount)}
💵 *Seu ganho:* ${this.formatCurrency(data.photographerEarning)}
🆔 *Venda:* #${data.saleId}

Acesse seu dashboard para mais detalhes! 🚀`;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    }
}

// Instagram Integration
class InstagramIntegration {
    constructor() {
        this.apiUrl = 'https://graph.instagram.com';
        this.accessToken = localStorage.getItem('instagram_access_token');
    }

    async connectAccount() {
        const clientId = process.env.INSTAGRAM_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/instagram/callback`;
        const scope = 'user_profile,user_media';
        
        const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
        
        window.location.href = authUrl;
    }

    async getUserProfile() {
        if (!this.accessToken) {
            throw new Error('Instagram não conectado');
        }

        try {
            const response = await fetch(`${this.apiUrl}/me?fields=id,username,account_type,media_count&access_token=${this.accessToken}`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter perfil do Instagram:', error);
            throw error;
        }
    }

    async getUserMedia(limit = 25) {
        if (!this.accessToken) {
            throw new Error('Instagram não conectado');
        }

        try {
            const response = await fetch(`${this.apiUrl}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&limit=${limit}&access_token=${this.accessToken}`);
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter mídia do Instagram:', error);
            throw error;
        }
    }

    async importPhotosFromInstagram() {
        try {
            const media = await this.getUserMedia();
            const photos = media.data.filter(item => item.media_type === 'IMAGE');
            
            const importPromises = photos.map(photo => this.importPhoto(photo));
            const results = await Promise.allSettled(importPromises);
            
            return {
                success: true,
                imported: results.filter(r => r.status === 'fulfilled').length,
                failed: results.filter(r => r.status === 'rejected').length
            };
        } catch (error) {
            console.error('Erro ao importar fotos do Instagram:', error);
            return { success: false, error: error.message };
        }
    }

    async importPhoto(instagramPhoto) {
        const response = await fetch('/api/photos/import-instagram', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify({
                instagramId: instagramPhoto.id,
                caption: instagramPhoto.caption,
                mediaUrl: instagramPhoto.media_url,
                permalink: instagramPhoto.permalink
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao importar foto');
        }

        return await response.json();
    }

    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }
}

// Google Analytics 4 Integration
class GoogleAnalytics {
    constructor() {
        this.measurementId = process.env.GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';
        this.initializeGA4();
    }

    initializeGA4() {
        // Load GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', this.measurementId);

        window.gtag = gtag;
    }

    // E-commerce Events
    trackPurchase(purchaseData) {
        gtag('event', 'purchase', {
            transaction_id: purchaseData.transactionId,
            value: purchaseData.amount,
            currency: 'BRL',
            items: purchaseData.items.map(item => ({
                item_id: item.photoId,
                item_name: item.photoTitle,
                category: item.category,
                quantity: 1,
                price: item.price
            }))
        });
    }

    trackAddToCart(photoData) {
        gtag('event', 'add_to_cart', {
            currency: 'BRL',
            value: photoData.price,
            items: [{
                item_id: photoData.id,
                item_name: photoData.title,
                category: photoData.category,
                quantity: 1,
                price: photoData.price
            }]
        });
    }

    trackViewItem(photoData) {
        gtag('event', 'view_item', {
            currency: 'BRL',
            value: photoData.price,
            items: [{
                item_id: photoData.id,
                item_name: photoData.title,
                category: photoData.category,
                price: photoData.price
            }]
        });
    }

    trackSearch(searchTerm, results) {
        gtag('event', 'search', {
            search_term: searchTerm,
            results_count: results
        });
    }

    trackSignUp(method = 'email') {
        gtag('event', 'sign_up', {
            method: method
        });
    }

    trackLogin(method = 'email') {
        gtag('event', 'login', {
            method: method
        });
    }

    trackPhotoUpload(photoData) {
        gtag('event', 'photo_upload', {
            custom_parameter_1: photoData.category,
            custom_parameter_2: photoData.photographerId
        });
    }

    trackEarningsWithdrawal(amount) {
        gtag('event', 'earnings_withdrawal', {
            currency: 'BRL',
            value: amount
        });
    }

    // Custom Events
    trackCustomEvent(eventName, parameters = {}) {
        gtag('event', eventName, parameters);
    }

    // User Properties
    setUserProperties(properties) {
        gtag('config', this.measurementId, {
            user_properties: properties
        });
    }

    // Enhanced E-commerce
    trackBeginCheckout(checkoutData) {
        gtag('event', 'begin_checkout', {
            currency: 'BRL',
            value: checkoutData.amount,
            items: checkoutData.items
        });
    }

    trackAddPaymentInfo() {
        gtag('event', 'add_payment_info', {
            currency: 'BRL'
        });
    }
}

// Initialize integrations
const paymentProcessor = new PaymentProcessor();
const whatsappIntegration = new WhatsAppIntegration();
const instagramIntegration = new InstagramIntegration();
const googleAnalytics = new GoogleAnalytics();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PaymentProcessor,
        WhatsAppIntegration,
        InstagramIntegration,
        GoogleAnalytics
    };
}

