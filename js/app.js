
// FOTOS63 - Simplified App JavaScript
(function() {
    'use strict';

    // Initialize Supabase - Mock configuration for development
    // Note: Replace with actual Supabase credentials when available
    const SUPABASE_URL = 'https://placeholder.supabase.co';
    const SUPABASE_KEY = 'placeholder-key';
    
    let supabaseClient = null;
    
    // Initialize app when DOM loads
    document.addEventListener('DOMContentLoaded', function() {
        try {
            if (window.supabase) {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                console.log('✅ Supabase connected successfully');
            } else {
                console.error('❌ Supabase SDK not loaded');
            }
            
            initializeApp();
        } catch (error) {
            console.error('❌ App initialization error:', error);
        }
    });

    function initializeApp() {
        loadFeaturedPhotos();
        loadEventsData();
        setupEventListeners();
        setupFormHandlers();
    }

    // Navigation Functions
    window.showSection = function(sectionId) {
        // Hide all sections
        document.querySelectorAll('.page-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected section
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.remove('hidden');
        }
        
        // Update navbar active state
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Scroll to top
        window.scrollTo(0, 0);
    };

    // Load Featured Photos
    function loadFeaturedPhotos() {
        const featuredPhotos = [
            {
                id: 1,
                title: "Casamento Elegante",
                photographer: "Ana Silva",
                price: "R$ 150,00",
                image: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=400",
                category: "casamento"
            },
            {
                id: 2,
                title: "Retrato Profissional",
                photographer: "Carlos Santos",
                price: "R$ 80,00",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                category: "retrato"
            },
            {
                id: 3,
                title: "Evento Corporativo",
                photographer: "Maria Costa",
                price: "R$ 200,00",
                image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400",
                category: "evento"
            },
            {
                id: 4,
                title: "Ensaio Esportivo",
                photographer: "João Oliveira",
                price: "R$ 120,00",
                image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
                category: "esporte"
            },
            {
                id: 5,
                title: "Festa de Aniversário",
                photographer: "Lucia Ferreira",
                price: "R$ 100,00",
                image: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=400",
                category: "evento"
            },
            {
                id: 6,
                title: "Sessão Familiar",
                photographer: "Pedro Lima",
                price: "R$ 180,00",
                image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400",
                category: "retrato"
            }
        ];

        renderPhotos(featuredPhotos, 'featured-photos');
        renderPhotos(featuredPhotos, 'photos-grid');
    }

    // Render Photos
    function renderPhotos(photos, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = photos.map(photo => `
            <div class="col-md-4 mb-4">
                <div class="photo-card">
                    <img src="${photo.image}" alt="${photo.title}" loading="lazy">
                    <div class="p-3">
                        <h5 class="mb-2">${photo.title}</h5>
                        <p class="text-muted mb-2">
                            <i class="bi bi-person-circle"></i> ${photo.photographer}
                        </p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-bold text-primary">${photo.price}</span>
                            <button class="btn btn-outline-primary btn-sm" onclick="buyPhoto(${photo.id})">
                                <i class="bi bi-cart-plus"></i> Comprar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Load Events
    function loadEventsData() {
        const events = [
            {
                id: 1,
                title: "Rei e Rainha da Via Lago 2025",
                date: "15 de Março de 2025",
                location: "Via Lago, Araguaína",
                photographer: "Equipe FOTOS63",
                image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400"
            },
            {
                id: 2,
                title: "Corrida do Trabalhador",
                date: "1 de Maio de 2025",
                location: "Centro de Araguaína",
                photographer: "Carlos Sports",
                image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400"
            },
            {
                id: 3,
                title: "Festival de Verão 2025",
                date: "20 de Janeiro de 2025",
                location: "Praia da Tartaruga",
                photographer: "Ana Eventos",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400"
            }
        ];

        const eventsContainer = document.getElementById('events-list');
        if (eventsContainer) {
            eventsContainer.innerHTML = events.map(event => `
                <div class="col-md-4 mb-4">
                    <div class="photo-card">
                        <img src="${event.image}" alt="${event.title}" loading="lazy">
                        <div class="p-3">
                            <h5 class="mb-2">${event.title}</h5>
                            <p class="text-muted mb-1">
                                <i class="bi bi-calendar"></i> ${event.date}
                            </p>
                            <p class="text-muted mb-1">
                                <i class="bi bi-geo-alt"></i> ${event.location}
                            </p>
                            <p class="text-muted mb-2">
                                <i class="bi bi-camera"></i> ${event.photographer}
                            </p>
                            <button class="btn btn-primary btn-sm w-100" onclick="viewEvent(${event.id})">
                                <i class="bi bi-images"></i> Ver Fotos
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }

        // Filter functionality
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', handleFilter);
        }

        const priceFilter = document.getElementById('priceFilter');
        if (priceFilter) {
            priceFilter.addEventListener('change', handleFilter);
        }
    }

    // Setup Form Handlers
    function setupFormHandlers() {
        // Photographer registration form
        const photographerForm = document.getElementById('photographerForm');
        if (photographerForm) {
            photographerForm.addEventListener('submit', handlePhotographerRegistration);
        }

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactForm);
        }
    }

    // Handle Photographer Registration
    async function handlePhotographerRegistration(e) {
        e.preventDefault();
        
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        const alertDiv = document.getElementById('registerAlert');
        
        try {
            // Show loading state
            submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Cadastrando...';
            submitButton.disabled = true;
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                city: document.getElementById('city').value.trim(),
                experience: document.getElementById('experience').value,
                portfolio: document.getElementById('portfolio').value.trim(),
                bio: document.getElementById('bio').value.trim(),
                specialties: Array.from(document.getElementById('specialties').selectedOptions).map(option => option.value),
                status: 'pending',
                created_at: new Date().toISOString()
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.city) {
                throw new Error('Por favor, preencha todos os campos obrigatórios');
            }

            // Save to Supabase (Mock implementation for development)
            // TODO: Replace with actual Supabase connection when available
            console.log('📋 Mock registration data:', formData);
            
            // Simulate successful registration
            const mockResponse = {
                id: 'mock-id-' + Date.now(),
                ...formData,
                created_at: new Date().toISOString()
            };
            
            console.log('✅ Mock photographer registered:', mockResponse);
            
            // Show success message
            alertDiv.className = 'alert alert-success';
            alertDiv.innerHTML = `
                <i class="bi bi-check-circle"></i> 
                <strong>Cadastro realizado com sucesso!</strong><br>
                Você receberá um email de confirmação em breve. Nossa equipe entrará em contato.
            `;
            alertDiv.classList.remove('hidden');
            
            // Reset form
            e.target.reset();
            
        } catch (error) {
            console.error('❌ Registration error:', error);
            
            // Show error message
            alertDiv.className = 'alert alert-danger';
            alertDiv.innerHTML = `
                <i class="bi bi-exclamation-triangle"></i> 
                <strong>Erro no cadastro:</strong> ${error.message}
            `;
            alertDiv.classList.remove('hidden');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Scroll to alert
            alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Handle Contact Form
    async function handleContactForm(e) {
        e.preventDefault();
        
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        const alertDiv = document.getElementById('contactAlert');
        
        try {
            // Show loading state
            submitButton.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';
            submitButton.disabled = true;
            
            // Get form data
            const formData = {
                name: document.getElementById('contactName').value.trim(),
                email: document.getElementById('contactEmail').value.trim(),
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim(),
                created_at: new Date().toISOString(),
                status: 'new'
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.message) {
                throw new Error('Por favor, preencha todos os campos obrigatórios');
            }

            // Save to Supabase (Mock implementation for development)
            // TODO: Replace with actual Supabase connection when available
            console.log('📩 Mock contact data:', formData);
            
            // Simulate successful message sending
            const mockResponse = {
                id: 'mock-contact-' + Date.now(),
                ...formData,
                created_at: new Date().toISOString()
            };
            
            console.log('✅ Mock message sent:', mockResponse);
            
            // Show success message
            alertDiv.className = 'alert alert-success';
            alertDiv.innerHTML = `
                <i class="bi bi-check-circle"></i> 
                <strong>Mensagem enviada com sucesso!</strong><br>
                Retornaremos o contato em até 24 horas.
            `;
            alertDiv.classList.remove('hidden');
            
            // Reset form
            e.target.reset();
            
        } catch (error) {
            console.error('❌ Contact error:', error);
            
            // Show error message
            alertDiv.className = 'alert alert-danger';
            alertDiv.innerHTML = `
                <i class="bi bi-exclamation-triangle"></i> 
                <strong>Erro ao enviar mensagem:</strong> ${error.message}
            `;
            alertDiv.classList.remove('hidden');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Scroll to alert
            alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Search functionality
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const photoCards = document.querySelectorAll('#photos-grid .col-md-4');
        
        photoCards.forEach(card => {
            const title = card.querySelector('h5').textContent.toLowerCase();
            const photographer = card.querySelector('.text-muted').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || photographer.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Filter functionality
    function handleFilter() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const priceFilter = document.getElementById('priceFilter').value;
        const photoCards = document.querySelectorAll('#photos-grid .col-md-4');
        
        photoCards.forEach(card => {
            let show = true;
            
            // Apply category filter (simplified - in real app would need data attributes)
            if (categoryFilter && show) {
                // This is a simplified filter - in a real app, you'd store category data
                show = true;
            }
            
            // Apply price filter (simplified)
            if (priceFilter && show) {
                const priceText = card.querySelector('.fw-bold').textContent;
                const price = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));
                
                if (priceFilter === '0-50' && price > 50) show = false;
                if (priceFilter === '50-100' && (price < 50 || price > 100)) show = false;
                if (priceFilter === '100-200' && (price < 100 || price > 200)) show = false;
                if (priceFilter === '200+' && price < 200) show = false;
            }
            
            card.style.display = show ? 'block' : 'none';
        });
    }

    // Global functions for button clicks
    window.buyPhoto = function(photoId) {
        // Redirect to checkout page with photo ID
        if (confirm('Deseja prosseguir para a compra desta foto?')) {
            window.location.href = `src/pages/checkout.html?photo=${photoId}`;
        }
    };

    window.viewEvent = function(eventId) {
        // Show event details or redirect to gallery filtered by event
        if (confirm('Deseja visualizar as fotos deste evento?')) {
            showSection('gallery');
            // Could add event filtering here
        }
    };
    
    // Additional utility functions
    window.goToLogin = function() {
        window.location.href = 'src/pages/auth.html';
    };
    
    window.goToDashboard = function() {
        window.location.href = 'src/pages/dashboard.html';
    };
    
    window.goToSupport = function() {
        window.location.href = 'src/pages/suporte.html';
    };

})();
