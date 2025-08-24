// Intuitive UX and Guided Interface System
// Sistema de Interface de Usuário Intuitiva e Guiada

class IntuitiveUXSystem {
    constructor() {
        this.tours = {};
        this.tooltips = {};
        this.onboarding = {};
        this.userProgress = {};
        this.contextualHelp = {};
        this.initializeSystem();
    }

    initializeSystem() {
        this.setupOnboardingFlows();
        this.setupContextualHelp();
        this.setupSmartTooltips();
        this.setupProgressTracking();
        this.setupAccessibility();
    }

    // Create intuitive UX interface
    createUXInterface(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="intuitive-ux">
                <!-- Welcome Tour -->
                <div class="welcome-tour" id="welcomeTour" style="display: none;">
                    <div class="tour-overlay"></div>
                    <div class="tour-content">
                        <div class="tour-step" id="tourStep">
                            <!-- Tour steps will be loaded here -->
                        </div>
                        <div class="tour-controls">
                            <button class="btn btn-outline-secondary" onclick="skipTour()">Pular</button>
                            <div class="tour-navigation">
                                <button class="btn btn-secondary" id="prevStep" onclick="previousStep()">Anterior</button>
                                <button class="btn btn-primary" id="nextStep" onclick="nextStep()">Próximo</button>
                            </div>
                        </div>
                        <div class="tour-progress">
                            <div class="progress">
                                <div class="progress-bar" id="tourProgress" style="width: 0%"></div>
                            </div>
                            <span class="step-counter" id="stepCounter">1 de 5</span>
                        </div>
                    </div>
                </div>

                <!-- Contextual Help Panel -->
                <div class="help-panel" id="helpPanel">
                    <button class="help-toggle" onclick="toggleHelpPanel()">
                        <i class="bi bi-question-circle"></i>
                        <span>Ajuda</span>
                    </button>
                    
                    <div class="help-content" id="helpContent" style="display: none;">
                        <div class="help-header">
                            <h5><i class="bi bi-lightbulb"></i> Ajuda Contextual</h5>
                            <button class="btn-close" onclick="closeHelpPanel()"></button>
                        </div>
                        
                        <div class="help-sections">
                            <div class="help-section active" id="quickHelp">
                                <h6>Dicas Rápidas</h6>
                                <div class="help-tips" id="contextualTips">
                                    <!-- Contextual tips will be loaded here -->
                                </div>
                            </div>
                            
                            <div class="help-section" id="videoHelp">
                                <h6>Vídeos Tutoriais</h6>
                                <div class="video-tutorials" id="videoTutorials">
                                    <!-- Video tutorials will be loaded here -->
                                </div>
                            </div>
                            
                            <div class="help-section" id="faqHelp">
                                <h6>Perguntas Frequentes</h6>
                                <div class="faq-items" id="faqItems">
                                    <!-- FAQ items will be loaded here -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="help-actions">
                            <button class="btn btn-outline-primary" onclick="contactSupport()">
                                <i class="bi bi-headset"></i> Falar com Suporte
                            </button>
                            <button class="btn btn-outline-secondary" onclick="suggestImprovement()">
                                <i class="bi bi-lightbulb"></i> Sugerir Melhoria
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Smart Tooltips -->
                <div class="smart-tooltips" id="smartTooltips">
                    <!-- Dynamic tooltips will be created here -->
                </div>

                <!-- Progress Indicator -->
                <div class="progress-indicator" id="progressIndicator">
                    <div class="progress-header">
                        <h6><i class="bi bi-trophy"></i> Seu Progresso</h6>
                        <button class="btn-close" onclick="hideProgressIndicator()"></button>
                    </div>
                    
                    <div class="progress-content">
                        <div class="progress-circle">
                            <svg class="progress-ring" width="60" height="60">
                                <circle class="progress-ring-circle" cx="30" cy="30" r="25"></circle>
                            </svg>
                            <span class="progress-percentage" id="progressPercentage">0%</span>
                        </div>
                        
                        <div class="progress-details">
                            <h6 id="progressTitle">Configuração do Perfil</h6>
                            <p id="progressDescription">Complete seu perfil para ter uma melhor experiência</p>
                            
                            <div class="progress-checklist">
                                <div class="checklist-item" data-task="profile">
                                    <i class="bi bi-circle"></i>
                                    <span>Completar perfil</span>
                                </div>
                                <div class="checklist-item" data-task="photo">
                                    <i class="bi bi-circle"></i>
                                    <span>Adicionar foto de perfil</span>
                                </div>
                                <div class="checklist-item" data-task="gallery">
                                    <i class="bi bi-circle"></i>
                                    <span>Criar primeira galeria</span>
                                </div>
                                <div class="checklist-item" data-task="upload">
                                    <i class="bi bi-circle"></i>
                                    <span>Fazer primeiro upload</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Interactive Hints -->
                <div class="interactive-hints" id="interactiveHints">
                    <!-- Dynamic hints will be shown here -->
                </div>

                <!-- Accessibility Tools -->
                <div class="accessibility-tools" id="accessibilityTools">
                    <button class="accessibility-toggle" onclick="toggleAccessibilityMenu()">
                        <i class="bi bi-universal-access"></i>
                    </button>
                    
                    <div class="accessibility-menu" id="accessibilityMenu" style="display: none;">
                        <h6>Acessibilidade</h6>
                        
                        <div class="accessibility-options">
                            <div class="option-item">
                                <label>
                                    <input type="checkbox" id="highContrast" onchange="toggleHighContrast()">
                                    Alto Contraste
                                </label>
                            </div>
                            
                            <div class="option-item">
                                <label>
                                    <input type="checkbox" id="largeText" onchange="toggleLargeText()">
                                    Texto Grande
                                </label>
                            </div>
                            
                            <div class="option-item">
                                <label>
                                    <input type="checkbox" id="reducedMotion" onchange="toggleReducedMotion()">
                                    Reduzir Animações
                                </label>
                            </div>
                            
                            <div class="option-item">
                                <label>
                                    <input type="checkbox" id="screenReader" onchange="toggleScreenReader()">
                                    Leitor de Tela
                                </label>
                            </div>
                        </div>
                        
                        <div class="font-size-control">
                            <label>Tamanho da Fonte</label>
                            <input type="range" id="fontSizeSlider" min="12" max="24" value="16" onchange="adjustFontSize()">
                            <span id="fontSizeValue">16px</span>
                        </div>
                    </div>
                </div>

                <!-- Smart Search -->
                <div class="smart-search" id="smartSearch">
                    <div class="search-container">
                        <input type="text" class="form-control" id="smartSearchInput" placeholder="O que você está procurando?">
                        <button class="search-btn" onclick="performSmartSearch()">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                    
                    <div class="search-suggestions" id="searchSuggestions" style="display: none;">
                        <!-- Search suggestions will be shown here -->
                    </div>
                </div>

                <!-- Guided Actions -->
                <div class="guided-actions" id="guidedActions">
                    <div class="action-card" data-action="upload-first-photo">
                        <div class="action-icon">
                            <i class="bi bi-upload"></i>
                        </div>
                        <div class="action-content">
                            <h6>Faça seu primeiro upload</h6>
                            <p>Comece compartilhando suas melhores fotos</p>
                            <button class="btn btn-primary btn-sm" onclick="startGuidedUpload()">Começar</button>
                        </div>
                    </div>
                    
                    <div class="action-card" data-action="create-gallery">
                        <div class="action-icon">
                            <i class="bi bi-images"></i>
                        </div>
                        <div class="action-content">
                            <h6>Crie sua primeira galeria</h6>
                            <p>Organize suas fotos em galerias temáticas</p>
                            <button class="btn btn-primary btn-sm" onclick="startGalleryCreation()">Criar</button>
                        </div>
                    </div>
                    
                    <div class="action-card" data-action="customize-profile">
                        <div class="action-icon">
                            <i class="bi bi-person-gear"></i>
                        </div>
                        <div class="action-content">
                            <h6>Personalize seu perfil</h6>
                            <p>Torne seu perfil mais atrativo para clientes</p>
                            <button class="btn btn-primary btn-sm" onclick="startProfileCustomization()">Personalizar</button>
                        </div>
                    </div>
                </div>

                <!-- Feedback Widget -->
                <div class="feedback-widget" id="feedbackWidget">
                    <button class="feedback-trigger" onclick="openFeedbackModal()">
                        <i class="bi bi-chat-heart"></i>
                        <span>Feedback</span>
                    </button>
                </div>

                <!-- Feedback Modal -->
                <div class="modal fade" id="feedbackModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Compartilhe sua Experiência</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div class="feedback-form">
                                    <div class="rating-section">
                                        <h6>Como você avalia sua experiência?</h6>
                                        <div class="star-rating" id="starRating">
                                            <i class="bi bi-star" data-rating="1"></i>
                                            <i class="bi bi-star" data-rating="2"></i>
                                            <i class="bi bi-star" data-rating="3"></i>
                                            <i class="bi bi-star" data-rating="4"></i>
                                            <i class="bi bi-star" data-rating="5"></i>
                                        </div>
                                    </div>
                                    
                                    <div class="feedback-type">
                                        <h6>Tipo de Feedback</h6>
                                        <div class="feedback-options">
                                            <label>
                                                <input type="radio" name="feedbackType" value="bug">
                                                <i class="bi bi-bug"></i> Reportar Bug
                                            </label>
                                            <label>
                                                <input type="radio" name="feedbackType" value="suggestion">
                                                <i class="bi bi-lightbulb"></i> Sugestão
                                            </label>
                                            <label>
                                                <input type="radio" name="feedbackType" value="compliment">
                                                <i class="bi bi-heart"></i> Elogio
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>Conte-nos mais</label>
                                        <textarea class="form-control" id="feedbackMessage" rows="4" placeholder="Descreva sua experiência ou sugestão..."></textarea>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label>
                                            <input type="checkbox" id="allowContact">
                                            Permitir contato para esclarecimentos
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                <button type="button" class="btn btn-primary" onclick="submitFeedback()">
                                    <i class="bi bi-send"></i> Enviar Feedback
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupUXEvents();
        this.initializeOnboarding();
        this.loadContextualHelp();
    }

    // Setup event listeners
    setupUXEvents() {
        // Smart search
        document.getElementById('smartSearchInput').addEventListener('input', (e) => {
            this.handleSmartSearch(e.target.value);
        });

        // Star rating
        document.querySelectorAll('#starRating i').forEach(star => {
            star.addEventListener('click', (e) => {
                this.setRating(parseInt(e.target.dataset.rating));
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Page visibility for contextual help
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateContextualHelp();
            }
        });
    }

    // Initialize onboarding
    initializeOnboarding() {
        const isFirstVisit = !localStorage.getItem('fotos63_onboarding_completed');
        
        if (isFirstVisit) {
            setTimeout(() => {
                this.startWelcomeTour();
            }, 1000);
        }
    }

    // Start welcome tour
    startWelcomeTour() {
        this.currentStep = 0;
        this.tourSteps = [
            {
                title: "Bem-vindo ao Fotos63!",
                content: "Vamos fazer um tour rápido para você conhecer as principais funcionalidades.",
                target: null,
                position: "center"
            },
            {
                title: "Navegação Principal",
                content: "Use o menu superior para navegar entre as diferentes seções da plataforma.",
                target: ".navbar",
                position: "bottom"
            },
            {
                title: "Busca Inteligente",
                content: "Nossa busca inteligente te ajuda a encontrar fotos rapidamente usando reconhecimento facial e tags.",
                target: "#smartSearch",
                position: "bottom"
            },
            {
                title: "Seu Dashboard",
                content: "Aqui você encontra todas as suas estatísticas, vendas e gerencia seu perfil.",
                target: ".dashboard-section",
                position: "left"
            },
            {
                title: "Ajuda Sempre Disponível",
                content: "Clique no ícone de ajuda a qualquer momento para obter dicas contextuais.",
                target: "#helpPanel",
                position: "left"
            }
        ];

        this.showTourStep();
        document.getElementById('welcomeTour').style.display = 'block';
    }

    // Show tour step
    showTourStep() {
        const step = this.tourSteps[this.currentStep];
        const stepElement = document.getElementById('tourStep');
        
        stepElement.innerHTML = `
            <div class="step-content">
                <h5>${step.title}</h5>
                <p>${step.content}</p>
            </div>
        `;

        // Update progress
        const progress = ((this.currentStep + 1) / this.tourSteps.length) * 100;
        document.getElementById('tourProgress').style.width = `${progress}%`;
        document.getElementById('stepCounter').textContent = `${this.currentStep + 1} de ${this.tourSteps.length}`;

        // Update navigation buttons
        document.getElementById('prevStep').disabled = this.currentStep === 0;
        document.getElementById('nextStep').textContent = this.currentStep === this.tourSteps.length - 1 ? 'Finalizar' : 'Próximo';

        // Highlight target element
        if (step.target) {
            this.highlightElement(step.target);
        }
    }

    // Highlight element
    highlightElement(selector) {
        // Remove previous highlights
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });

        // Add highlight to target
        const target = document.querySelector(selector);
        if (target) {
            target.classList.add('tour-highlight');
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Next step
    nextStep() {
        if (this.currentStep < this.tourSteps.length - 1) {
            this.currentStep++;
            this.showTourStep();
        } else {
            this.completeTour();
        }
    }

    // Previous step
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showTourStep();
        }
    }

    // Skip tour
    skipTour() {
        this.completeTour();
    }

    // Complete tour
    completeTour() {
        document.getElementById('welcomeTour').style.display = 'none';
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });
        
        localStorage.setItem('fotos63_onboarding_completed', 'true');
        
        // Show completion message
        this.showNotification('Tour concluído! Explore a plataforma e não hesite em usar a ajuda contextual.', 'success');
    }

    // Load contextual help
    loadContextualHelp() {
        const currentPage = window.location.pathname;
        const helpContent = this.getContextualHelpContent(currentPage);
        
        document.getElementById('contextualTips').innerHTML = helpContent.tips;
        document.getElementById('videoTutorials').innerHTML = helpContent.videos;
        document.getElementById('faqItems').innerHTML = helpContent.faq;
    }

    // Get contextual help content
    getContextualHelpContent(page) {
        const helpData = {
            '/dashboard': {
                tips: `
                    <div class="tip-item">
                        <i class="bi bi-lightbulb text-warning"></i>
                        <div>
                            <h6>Maximize suas vendas</h6>
                            <p>Fotos com boa iluminação e composição vendem 3x mais</p>
                        </div>
                    </div>
                    <div class="tip-item">
                        <i class="bi bi-graph-up text-success"></i>
                        <div>
                            <h6>Acompanhe suas métricas</h6>
                            <p>Verifique regularmente quais tipos de foto têm melhor performance</p>
                        </div>
                    </div>
                `,
                videos: `
                    <div class="video-item">
                        <div class="video-thumbnail">
                            <img src="/images/tutorial-dashboard.jpg" alt="Tutorial Dashboard">
                            <i class="bi bi-play-circle"></i>
                        </div>
                        <div class="video-info">
                            <h6>Como usar o Dashboard</h6>
                            <span>3:45</span>
                        </div>
                    </div>
                `,
                faq: `
                    <div class="faq-item">
                        <h6>Como interpretar as estatísticas?</h6>
                        <p>As estatísticas mostram visualizações, downloads e receita em tempo real...</p>
                    </div>
                `
            },
            // Add more page-specific help content
        };

        return helpData[page] || helpData['/dashboard'];
    }

    // Handle smart search
    handleSmartSearch(query) {
        if (query.length < 2) {
            document.getElementById('searchSuggestions').style.display = 'none';
            return;
        }

        // Simulate smart suggestions
        const suggestions = [
            { type: 'photo', text: `Fotos de "${query}"`, icon: 'bi-image' },
            { type: 'photographer', text: `Fotógrafos relacionados a "${query}"`, icon: 'bi-person' },
            { type: 'event', text: `Eventos de "${query}"`, icon: 'bi-calendar-event' },
            { type: 'action', text: `Como fazer "${query}"`, icon: 'bi-question-circle' }
        ];

        const suggestionsHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" onclick="selectSuggestion('${suggestion.type}', '${suggestion.text}')">
                <i class="${suggestion.icon}"></i>
                <span>${suggestion.text}</span>
            </div>
        `).join('');

        document.getElementById('searchSuggestions').innerHTML = suggestionsHTML;
        document.getElementById('searchSuggestions').style.display = 'block';
    }

    // Toggle help panel
    toggleHelpPanel() {
        const helpContent = document.getElementById('helpContent');
        const isVisible = helpContent.style.display !== 'none';
        
        helpContent.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.updateContextualHelp();
        }
    }

    // Update contextual help
    updateContextualHelp() {
        this.loadContextualHelp();
    }

    // Toggle accessibility menu
    toggleAccessibilityMenu() {
        const menu = document.getElementById('accessibilityMenu');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }

    // Toggle high contrast
    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        localStorage.setItem('fotos63_high_contrast', document.body.classList.contains('high-contrast'));
    }

    // Toggle large text
    toggleLargeText() {
        document.body.classList.toggle('large-text');
        localStorage.setItem('fotos63_large_text', document.body.classList.contains('large-text'));
    }

    // Adjust font size
    adjustFontSize() {
        const size = document.getElementById('fontSizeSlider').value;
        document.documentElement.style.fontSize = `${size}px`;
        document.getElementById('fontSizeValue').textContent = `${size}px`;
        localStorage.setItem('fotos63_font_size', size);
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('smartSearchInput').focus();
        }
        
        // F1 for help
        if (e.key === 'F1') {
            e.preventDefault();
            this.toggleHelpPanel();
        }
        
        // Escape to close modals/panels
        if (e.key === 'Escape') {
            this.closeAllPanels();
        }
    }

    // Close all panels
    closeAllPanels() {
        document.getElementById('helpContent').style.display = 'none';
        document.getElementById('accessibilityMenu').style.display = 'none';
        document.getElementById('searchSuggestions').style.display = 'none';
    }

    // Set rating
    setRating(rating) {
        document.querySelectorAll('#starRating i').forEach((star, index) => {
            if (index < rating) {
                star.classList.remove('bi-star');
                star.classList.add('bi-star-fill');
            } else {
                star.classList.remove('bi-star-fill');
                star.classList.add('bi-star');
            }
        });
        
        this.selectedRating = rating;
    }

    // Submit feedback
    async submitFeedback() {
        try {
            const feedbackData = {
                rating: this.selectedRating,
                type: document.querySelector('input[name="feedbackType"]:checked')?.value,
                message: document.getElementById('feedbackMessage').value,
                allow_contact: document.getElementById('allowContact').checked,
                page: window.location.pathname,
                user_agent: navigator.userAgent
            };

            const response = await fetch('/api/feedback/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify(feedbackData)
            });

            if (response.ok) {
                this.showNotification('Obrigado pelo seu feedback! Ele nos ajuda a melhorar.', 'success');
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
                modal.hide();
                
                // Reset form
                this.resetFeedbackForm();
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            this.showNotification('Erro ao enviar feedback. Tente novamente.', 'error');
        }
    }

    // Reset feedback form
    resetFeedbackForm() {
        this.selectedRating = 0;
        document.querySelectorAll('#starRating i').forEach(star => {
            star.classList.remove('bi-star-fill');
            star.classList.add('bi-star');
        });
        document.getElementById('feedbackMessage').value = '';
        document.getElementById('allowContact').checked = false;
        document.querySelectorAll('input[name="feedbackType"]').forEach(radio => {
            radio.checked = false;
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="bi bi-x"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }
}

// Global functions
function nextStep() {
    intuitiveUX.nextStep();
}

function previousStep() {
    intuitiveUX.previousStep();
}

function skipTour() {
    intuitiveUX.skipTour();
}

function toggleHelpPanel() {
    intuitiveUX.toggleHelpPanel();
}

function closeHelpPanel() {
    document.getElementById('helpContent').style.display = 'none';
}

function toggleAccessibilityMenu() {
    intuitiveUX.toggleAccessibilityMenu();
}

function toggleHighContrast() {
    intuitiveUX.toggleHighContrast();
}

function toggleLargeText() {
    intuitiveUX.toggleLargeText();
}

function adjustFontSize() {
    intuitiveUX.adjustFontSize();
}

function openFeedbackModal() {
    const modal = new bootstrap.Modal(document.getElementById('feedbackModal'));
    modal.show();
}

function submitFeedback() {
    intuitiveUX.submitFeedback();
}

function performSmartSearch() {
    const query = document.getElementById('smartSearchInput').value;
    alert(`Pesquisando por: ${query}`);
}

function selectSuggestion(type, text) {
    document.getElementById('smartSearchInput').value = text;
    document.getElementById('searchSuggestions').style.display = 'none';
}

// Initialize intuitive UX system
const intuitiveUX = new IntuitiveUXSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntuitiveUXSystem;
}

