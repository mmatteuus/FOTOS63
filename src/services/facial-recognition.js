// Facial Recognition System for Fotos63
// Sistema de Reconhecimento Facial Inteligente

class FacialRecognitionSystem {
    constructor() {
        this.apiUrl = 'https://api.face-api.js.org'; // Face-api.js or similar service
        this.models = {
            ssdMobilenetv1: null,
            faceLandmark68Net: null,
            faceRecognitionNet: null,
            faceExpressionNet: null
        };
        this.isInitialized = false;
        this.faceDescriptors = new Map(); // Cache for face descriptors
        this.initializeModels();
    }

    async initializeModels() {
        try {
            // Load face-api.js models
            if (typeof faceapi !== 'undefined') {
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                    faceapi.nets.faceExpressionNet.loadFromUri('/models')
                ]);
                this.isInitialized = true;
                console.log('Face recognition models loaded successfully');
            } else {
                console.warn('Face-api.js not available, using fallback API');
                this.isInitialized = true;
            }
        } catch (error) {
            console.error('Error loading face recognition models:', error);
            this.isInitialized = false;
        }
    }

    // Extract face descriptors from an image
    async extractFaceDescriptors(imageElement) {
        if (!this.isInitialized) {
            throw new Error('Face recognition system not initialized');
        }

        try {
            if (typeof faceapi !== 'undefined') {
                const detections = await faceapi
                    .detectAllFaces(imageElement)
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                return detections.map(detection => ({
                    descriptor: Array.from(detection.descriptor),
                    box: detection.detection.box,
                    landmarks: detection.landmarks.positions,
                    confidence: detection.detection.score
                }));
            } else {
                // Fallback to API service
                return await this.extractFaceDescriptorsAPI(imageElement);
            }
        } catch (error) {
            console.error('Error extracting face descriptors:', error);
            return [];
        }
    }

    // Fallback API method for face detection
    async extractFaceDescriptorsAPI(imageElement) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = imageElement.width;
            canvas.height = imageElement.height;
            ctx.drawImage(imageElement, 0, 0);
            
            const imageData = canvas.toDataURL('image/jpeg', 0.8);
            
            const response = await fetch('/api/face-recognition/extract', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    image: imageData,
                    options: {
                        detectFaces: true,
                        extractDescriptors: true,
                        detectLandmarks: true
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Face recognition API error');
            }

            const result = await response.json();
            return result.faces || [];
        } catch (error) {
            console.error('API face extraction error:', error);
            return [];
        }
    }

    // Compare two face descriptors
    calculateFaceDistance(descriptor1, descriptor2) {
        if (!descriptor1 || !descriptor2 || descriptor1.length !== descriptor2.length) {
            return 1; // Maximum distance (no match)
        }

        // Calculate Euclidean distance
        let sum = 0;
        for (let i = 0; i < descriptor1.length; i++) {
            sum += Math.pow(descriptor1[i] - descriptor2[i], 2);
        }
        
        return Math.sqrt(sum);
    }

    // Find matching faces in a collection of photos
    async findMatchingFaces(referenceDescriptor, photoCollection, threshold = 0.6) {
        const matches = [];

        for (const photo of photoCollection) {
            try {
                const photoDescriptors = await this.getPhotoDescriptors(photo.id);
                
                for (const photoDescriptor of photoDescriptors) {
                    const distance = this.calculateFaceDistance(referenceDescriptor, photoDescriptor.descriptor);
                    
                    if (distance < threshold) {
                        matches.push({
                            photoId: photo.id,
                            photoUrl: photo.url,
                            photoTitle: photo.title,
                            photographerId: photo.photographerId,
                            photographerName: photo.photographerName,
                            confidence: 1 - distance, // Convert distance to confidence
                            faceBox: photoDescriptor.box,
                            matchedAt: new Date().toISOString()
                        });
                    }
                }
            } catch (error) {
                console.error(`Error processing photo ${photo.id}:`, error);
            }
        }

        // Sort by confidence (highest first)
        return matches.sort((a, b) => b.confidence - a.confidence);
    }

    // Get or extract face descriptors for a photo
    async getPhotoDescriptors(photoId) {
        // Check cache first
        if (this.faceDescriptors.has(photoId)) {
            return this.faceDescriptors.get(photoId);
        }

        try {
            // Try to get from database
            const response = await fetch(`/api/photos/${photoId}/face-descriptors`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                const descriptors = await response.json();
                this.faceDescriptors.set(photoId, descriptors);
                return descriptors;
            }

            // If not in database, extract and save
            const photoElement = await this.loadPhotoElement(photoId);
            const descriptors = await this.extractFaceDescriptors(photoElement);
            
            // Save to database
            await this.savePhotoDescriptors(photoId, descriptors);
            
            // Cache locally
            this.faceDescriptors.set(photoId, descriptors);
            
            return descriptors;
        } catch (error) {
            console.error(`Error getting descriptors for photo ${photoId}:`, error);
            return [];
        }
    }

    // Load photo element for processing
    async loadPhotoElement(photoId) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load photo ${photoId}`));
            
            // Get photo URL from API
            fetch(`/api/photos/${photoId}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            })
            .then(response => response.json())
            .then(photo => {
                img.src = photo.file_url;
            })
            .catch(reject);
        });
    }

    // Save face descriptors to database
    async savePhotoDescriptors(photoId, descriptors) {
        try {
            const response = await fetch(`/api/photos/${photoId}/face-descriptors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAuthToken()}`
                },
                body: JSON.stringify({
                    descriptors: descriptors,
                    extractedAt: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save face descriptors');
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving face descriptors:', error);
            throw error;
        }
    }

    // Process uploaded reference image for face search
    async processReferenceImage(imageFile) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = async (e) => {
                img.onload = async () => {
                    try {
                        const descriptors = await this.extractFaceDescriptors(img);
                        
                        if (descriptors.length === 0) {
                            reject(new Error('Nenhum rosto foi detectado na imagem. Tente uma foto mais clara.'));
                            return;
                        }

                        if (descriptors.length > 1) {
                            // If multiple faces, let user choose or use the largest face
                            const largestFace = descriptors.reduce((prev, current) => 
                                (prev.box.width * prev.box.height) > (current.box.width * current.box.height) ? prev : current
                            );
                            resolve([largestFace]);
                        } else {
                            resolve(descriptors);
                        }
                    } catch (error) {
                        reject(error);
                    }
                };
                img.src = e.target.result;
            };

            reader.onerror = () => reject(new Error('Erro ao ler o arquivo de imagem'));
            reader.readAsDataURL(imageFile);
        });
    }

    // Search for photos containing a specific person
    async searchPhotosByFace(referenceImage, options = {}) {
        const {
            threshold = 0.6,
            maxResults = 50,
            categories = [],
            photographers = [],
            dateRange = null
        } = options;

        try {
            // Process reference image
            const referenceDescriptors = await this.processReferenceImage(referenceImage);
            const mainDescriptor = referenceDescriptors[0].descriptor;

            // Get photo collection based on filters
            const photoCollection = await this.getFilteredPhotoCollection({
                categories,
                photographers,
                dateRange,
                limit: 1000 // Process up to 1000 photos
            });

            // Find matches
            const matches = await this.findMatchingFaces(mainDescriptor, photoCollection, threshold);

            // Limit results
            return matches.slice(0, maxResults);
        } catch (error) {
            console.error('Face search error:', error);
            throw error;
        }
    }

    // Get filtered photo collection
    async getFilteredPhotoCollection(filters) {
        try {
            const queryParams = new URLSearchParams();
            
            if (filters.categories && filters.categories.length > 0) {
                queryParams.append('categories', filters.categories.join(','));
            }
            
            if (filters.photographers && filters.photographers.length > 0) {
                queryParams.append('photographers', filters.photographers.join(','));
            }
            
            if (filters.dateRange) {
                queryParams.append('date_from', filters.dateRange.from);
                queryParams.append('date_to', filters.dateRange.to);
            }
            
            if (filters.limit) {
                queryParams.append('limit', filters.limit);
            }

            const response = await fetch(`/api/photos/search?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch photo collection');
            }

            const result = await response.json();
            return result.photos || [];
        } catch (error) {
            console.error('Error fetching photo collection:', error);
            return [];
        }
    }

    // Batch process photos for face extraction (background job)
    async batchProcessPhotos(photoIds, onProgress = null) {
        const results = {
            processed: 0,
            failed: 0,
            total: photoIds.length,
            errors: []
        };

        for (let i = 0; i < photoIds.length; i++) {
            const photoId = photoIds[i];
            
            try {
                await this.getPhotoDescriptors(photoId);
                results.processed++;
            } catch (error) {
                results.failed++;
                results.errors.push({
                    photoId,
                    error: error.message
                });
            }

            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: photoIds.length,
                    processed: results.processed,
                    failed: results.failed
                });
            }

            // Small delay to prevent overwhelming the system
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return results;
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('fotos63_auth_token') || '';
    }

    // Utility method to create face search UI
    createFaceSearchUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = `
            <div class="face-search-container">
                <div class="face-search-header">
                    <h3><i class="bi bi-person-check"></i> Busca por Reconhecimento Facial</h3>
                    <p>Faça upload de uma foto para encontrar todas as imagens em que você aparece</p>
                </div>
                
                <div class="face-search-upload">
                    <div class="upload-area" id="faceUploadArea">
                        <i class="bi bi-cloud-upload"></i>
                        <p>Clique ou arraste uma foto aqui</p>
                        <small>JPG, PNG ou WEBP - Máximo 5MB</small>
                    </div>
                    <input type="file" id="faceUploadInput" accept="image/*" style="display: none;">
                </div>
                
                <div class="face-search-options" style="display: none;">
                    <div class="search-filters">
                        <div class="filter-group">
                            <label>Categorias:</label>
                            <select multiple id="categoryFilter">
                                <option value="casamento">Casamento</option>
                                <option value="evento">Evento</option>
                                <option value="esporte">Esporte</option>
                                <option value="retrato">Retrato</option>
                                <option value="familia">Família</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>Fotógrafo:</label>
                            <select id="photographerFilter">
                                <option value="">Todos os fotógrafos</option>
                            </select>
                        </div>
                        
                        <div class="filter-group">
                            <label>Precisão:</label>
                            <select id="precisionFilter">
                                <option value="0.4">Alta (mais restritiva)</option>
                                <option value="0.6" selected>Média (recomendada)</option>
                                <option value="0.8">Baixa (mais resultados)</option>
                            </select>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary" id="startFaceSearch">
                        <i class="bi bi-search"></i> Buscar Fotos
                    </button>
                </div>
                
                <div class="face-search-results" id="faceSearchResults" style="display: none;">
                    <div class="results-header">
                        <h4>Resultados da Busca</h4>
                        <span class="results-count" id="resultsCount">0 fotos encontradas</span>
                    </div>
                    <div class="results-grid" id="resultsGrid"></div>
                </div>
                
                <div class="face-search-loading" id="faceSearchLoading" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p>Analisando fotos... Isso pode levar alguns minutos.</p>
                    <div class="progress-bar">
                        <div class="progress-fill" id="searchProgress"></div>
                    </div>
                </div>
            </div>
        `;

        this.setupFaceSearchEvents();
    }

    // Setup event listeners for face search UI
    setupFaceSearchEvents() {
        const uploadArea = document.getElementById('faceUploadArea');
        const uploadInput = document.getElementById('faceUploadInput');
        const startButton = document.getElementById('startFaceSearch');

        // Upload area events
        uploadArea.addEventListener('click', () => uploadInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleReferenceImageUpload(files[0]);
            }
        });

        // File input change
        uploadInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleReferenceImageUpload(e.target.files[0]);
            }
        });

        // Start search button
        startButton.addEventListener('click', () => {
            this.performFaceSearch();
        });
    }

    // Handle reference image upload
    async handleReferenceImageUpload(file) {
        try {
            // Validate file
            if (!file.type.startsWith('image/')) {
                throw new Error('Por favor, selecione um arquivo de imagem válido');
            }

            if (file.size > 5 * 1024 * 1024) {
                throw new Error('O arquivo deve ter no máximo 5MB');
            }

            // Show preview and options
            const uploadArea = document.getElementById('faceUploadArea');
            const reader = new FileReader();
            
            reader.onload = (e) => {
                uploadArea.innerHTML = `
                    <img src="${e.target.result}" alt="Foto de referência" style="max-width: 200px; max-height: 200px; border-radius: 8px;">
                    <p>Foto carregada com sucesso!</p>
                    <button class="btn btn-sm btn-outline-secondary" onclick="location.reload()">Trocar foto</button>
                `;
            };
            
            reader.readAsDataURL(file);

            // Store reference file
            this.referenceImage = file;

            // Show search options
            document.querySelector('.face-search-options').style.display = 'block';

            // Load photographers for filter
            await this.loadPhotographersFilter();

        } catch (error) {
            alert(error.message);
        }
    }

    // Load photographers for filter dropdown
    async loadPhotographersFilter() {
        try {
            const response = await fetch('/api/photographers', {
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            if (response.ok) {
                const photographers = await response.json();
                const select = document.getElementById('photographerFilter');
                
                photographers.forEach(photographer => {
                    const option = document.createElement('option');
                    option.value = photographer.id;
                    option.textContent = photographer.name;
                    select.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error loading photographers:', error);
        }
    }

    // Perform face search
    async performFaceSearch() {
        if (!this.referenceImage) {
            alert('Por favor, faça upload de uma foto de referência primeiro');
            return;
        }

        const loadingDiv = document.getElementById('faceSearchLoading');
        const resultsDiv = document.getElementById('faceSearchResults');
        
        loadingDiv.style.display = 'block';
        resultsDiv.style.display = 'none';

        try {
            // Get search options
            const categoryFilter = Array.from(document.getElementById('categoryFilter').selectedOptions).map(o => o.value);
            const photographerFilter = document.getElementById('photographerFilter').value;
            const precisionFilter = parseFloat(document.getElementById('precisionFilter').value);

            const options = {
                threshold: precisionFilter,
                maxResults: 100,
                categories: categoryFilter,
                photographers: photographerFilter ? [photographerFilter] : []
            };

            // Perform search
            const matches = await this.searchPhotosByFace(this.referenceImage, options);

            // Display results
            this.displaySearchResults(matches);

        } catch (error) {
            console.error('Face search error:', error);
            alert('Erro na busca: ' + error.message);
        } finally {
            loadingDiv.style.display = 'none';
        }
    }

    // Display search results
    displaySearchResults(matches) {
        const resultsDiv = document.getElementById('faceSearchResults');
        const resultsGrid = document.getElementById('resultsGrid');
        const resultsCount = document.getElementById('resultsCount');

        resultsCount.textContent = `${matches.length} foto${matches.length !== 1 ? 's' : ''} encontrada${matches.length !== 1 ? 's' : ''}`;

        if (matches.length === 0) {
            resultsGrid.innerHTML = '<p class="no-results">Nenhuma foto foi encontrada com o rosto fornecido. Tente ajustar a precisão da busca.</p>';
        } else {
            resultsGrid.innerHTML = matches.map(match => `
                <div class="result-item" data-photo-id="${match.photoId}">
                    <div class="result-image">
                        <img src="${match.photoUrl}" alt="${match.photoTitle}" loading="lazy">
                        <div class="confidence-badge">${Math.round(match.confidence * 100)}%</div>
                    </div>
                    <div class="result-info">
                        <h5>${match.photoTitle}</h5>
                        <p>por ${match.photographerName}</p>
                        <button class="btn btn-sm btn-primary" onclick="viewPhoto('${match.photoId}')">
                            Ver Foto
                        </button>
                    </div>
                </div>
            `).join('');
        }

        resultsDiv.style.display = 'block';
    }
}

// Initialize facial recognition system
const facialRecognition = new FacialRecognitionSystem();

// Global function to view photo (called from result items)
function viewPhoto(photoId) {
    window.open(`/photo/${photoId}`, '_blank');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacialRecognitionSystem;
}

