// Processador de Marca D'água para Fotos63
// Aplica marca d'água nas imagens usando Canvas API

class WatermarkProcessor {
    constructor() {
        this.watermarkText = 'FOTOS63.COM';
        this.watermarkOpacity = 0.7;
        this.watermarkSize = 0.05; // 5% da largura da imagem
        this.positions = ['center', 'bottom-right', 'bottom-left', 'top-right', 'top-left'];
    }

    /**
     * Aplica marca d'água em uma imagem
     * @param {File} imageFile - Arquivo de imagem
     * @param {Object} options - Opções de marca d'água
     * @returns {Promise<Blob>} - Imagem com marca d'água
     */
    async applyWatermark(imageFile, options = {}) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();

                img.onload = () => {
                    try {
                        // Configurar canvas com as dimensões da imagem
                        canvas.width = img.width;
                        canvas.height = img.height;

                        // Desenhar imagem original
                        ctx.drawImage(img, 0, 0);

                        // Aplicar marca d'água
                        this.drawWatermark(ctx, canvas.width, canvas.height, options);

                        // Converter para blob
                        canvas.toBlob((blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Erro ao gerar imagem com marca d\'água'));
                            }
                        }, 'image/jpeg', 0.9);

                    } catch (error) {
                        reject(error);
                    }
                };

                img.onerror = () => {
                    reject(new Error('Erro ao carregar imagem'));
                };

                // Carregar imagem
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(imageFile);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Desenha marca d'água no canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     * @param {number} width - Largura da imagem
     * @param {number} height - Altura da imagem
     * @param {Object} options - Opções de marca d'água
     */
    drawWatermark(ctx, width, height, options = {}) {
        const {
            text = this.watermarkText,
            opacity = this.watermarkOpacity,
            position = 'center',
            color = '#FFD700',
            fontSize = Math.max(width * this.watermarkSize, 20),
            fontFamily = 'Arial Black',
            pattern = false
        } = options;

        // Salvar estado do contexto
        ctx.save();

        // Configurar fonte
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (pattern) {
            // Aplicar marca d'água em padrão (múltiplas posições)
            this.drawWatermarkPattern(ctx, width, height, text, fontSize);
        } else {
            // Aplicar marca d'água em posição específica
            this.drawWatermarkAtPosition(ctx, width, height, text, position);
        }

        // Restaurar estado do contexto
        ctx.restore();
    }

    /**
     * Desenha marca d'água em posição específica
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     * @param {number} width - Largura da imagem
     * @param {number} height - Altura da imagem
     * @param {string} text - Texto da marca d'água
     * @param {string} position - Posição da marca d'água
     */
    drawWatermarkAtPosition(ctx, width, height, text, position) {
        let x, y;

        switch (position) {
            case 'center':
                x = width / 2;
                y = height / 2;
                break;
            case 'top-left':
                x = width * 0.1;
                y = height * 0.1;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'top';
                break;
            case 'top-right':
                x = width * 0.9;
                y = height * 0.1;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'top';
                break;
            case 'bottom-left':
                x = width * 0.1;
                y = height * 0.9;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'bottom';
                break;
            case 'bottom-right':
                x = width * 0.9;
                y = height * 0.9;
                ctx.textAlign = 'right';
                ctx.textBaseline = 'bottom';
                break;
            default:
                x = width / 2;
                y = height / 2;
        }

        // Adicionar sombra para melhor legibilidade
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(text, x, y);
    }

    /**
     * Desenha marca d'água em padrão repetido
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     * @param {number} width - Largura da imagem
     * @param {number} height - Altura da imagem
     * @param {string} text - Texto da marca d'água
     * @param {number} fontSize - Tamanho da fonte
     */
    drawWatermarkPattern(ctx, width, height, text, fontSize) {
        const spacing = fontSize * 3;
        const rows = Math.ceil(height / spacing);
        const cols = Math.ceil(width / spacing);

        // Reduzir opacidade para padrão
        ctx.globalAlpha = ctx.globalAlpha * 0.3;

        // Rotacionar texto
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(-Math.PI / 6); // -30 graus
        ctx.translate(-width / 2, -height / 2);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = (col * spacing) + (spacing / 2);
                const y = (row * spacing) + (spacing / 2);

                // Offset alternado para criar padrão mais natural
                const offsetX = (row % 2) * (spacing / 2);
                
                ctx.fillText(text, x + offsetX, y);
            }
        }

        ctx.restore();
    }

    /**
     * Cria thumbnail da imagem
     * @param {File} imageFile - Arquivo de imagem
     * @param {number} maxWidth - Largura máxima
     * @param {number} maxHeight - Altura máxima
     * @returns {Promise<Blob>} - Thumbnail da imagem
     */
    async createThumbnail(imageFile, maxWidth = 300, maxHeight = 300) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();

                img.onload = () => {
                    try {
                        // Calcular dimensões mantendo proporção
                        const { width, height } = this.calculateThumbnailSize(
                            img.width, 
                            img.height, 
                            maxWidth, 
                            maxHeight
                        );

                        canvas.width = width;
                        canvas.height = height;

                        // Desenhar imagem redimensionada
                        ctx.drawImage(img, 0, 0, width, height);

                        // Converter para blob
                        canvas.toBlob((blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Erro ao gerar thumbnail'));
                            }
                        }, 'image/jpeg', 0.8);

                    } catch (error) {
                        reject(error);
                    }
                };

                img.onerror = () => {
                    reject(new Error('Erro ao carregar imagem para thumbnail'));
                };

                // Carregar imagem
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(imageFile);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Calcula dimensões do thumbnail mantendo proporção
     * @param {number} originalWidth - Largura original
     * @param {number} originalHeight - Altura original
     * @param {number} maxWidth - Largura máxima
     * @param {number} maxHeight - Altura máxima
     * @returns {Object} - Novas dimensões
     */
    calculateThumbnailSize(originalWidth, originalHeight, maxWidth, maxHeight) {
        let width = originalWidth;
        let height = originalHeight;

        // Redimensionar se necessário
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }

        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }

        return { width: Math.round(width), height: Math.round(height) };
    }

    /**
     * Comprime imagem mantendo qualidade aceitável
     * @param {File} imageFile - Arquivo de imagem
     * @param {number} quality - Qualidade (0-1)
     * @param {number} maxWidth - Largura máxima
     * @returns {Promise<Blob>} - Imagem comprimida
     */
    async compressImage(imageFile, quality = 0.8, maxWidth = 1920) {
        return new Promise((resolve, reject) => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();

                img.onload = () => {
                    try {
                        let { width, height } = img;

                        // Redimensionar se necessário
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }

                        canvas.width = width;
                        canvas.height = height;

                        // Desenhar imagem
                        ctx.drawImage(img, 0, 0, width, height);

                        // Converter para blob com qualidade especificada
                        canvas.toBlob((blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error('Erro ao comprimir imagem'));
                            }
                        }, 'image/jpeg', quality);

                    } catch (error) {
                        reject(error);
                    }
                };

                img.onerror = () => {
                    reject(new Error('Erro ao carregar imagem para compressão'));
                };

                // Carregar imagem
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(imageFile);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Extrai metadados da imagem
     * @param {File} imageFile - Arquivo de imagem
     * @returns {Promise<Object>} - Metadados da imagem
     */
    async extractImageMetadata(imageFile) {
        return new Promise((resolve, reject) => {
            try {
                const img = new Image();

                img.onload = () => {
                    const metadata = {
                        width: img.width,
                        height: img.height,
                        aspectRatio: img.width / img.height,
                        fileSize: imageFile.size,
                        fileName: imageFile.name,
                        fileType: imageFile.type,
                        lastModified: new Date(imageFile.lastModified)
                    };

                    resolve(metadata);
                };

                img.onerror = () => {
                    reject(new Error('Erro ao extrair metadados da imagem'));
                };

                // Carregar imagem
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(imageFile);

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Processa upload completo de imagem
     * @param {File} imageFile - Arquivo de imagem
     * @param {Object} options - Opções de processamento
     * @returns {Promise<Object>} - Resultado do processamento
     */
    async processImageUpload(imageFile, options = {}) {
        try {
            // Validar arquivo
            if (!this.validateImageFile(imageFile)) {
                throw new Error('Arquivo de imagem inválido');
            }

            // Extrair metadados
            const metadata = await this.extractImageMetadata(imageFile);

            // Comprimir imagem original se necessário
            let processedImage = imageFile;
            if (imageFile.size > 5 * 1024 * 1024) { // > 5MB
                processedImage = await this.compressImage(imageFile, 0.85);
            }

            // Aplicar marca d'água
            const watermarkedImage = await this.applyWatermark(processedImage, {
                position: options.watermarkPosition || 'center',
                pattern: options.watermarkPattern || false,
                opacity: options.watermarkOpacity || this.watermarkOpacity
            });

            // Criar thumbnail
            const thumbnail = await this.createThumbnail(watermarkedImage);

            return {
                success: true,
                data: {
                    original: processedImage,
                    watermarked: watermarkedImage,
                    thumbnail: thumbnail,
                    metadata: metadata
                }
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Valida arquivo de imagem
     * @param {File} file - Arquivo a ser validado
     * @returns {boolean} - Se o arquivo é válido
     */
    validateImageFile(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!allowedTypes.includes(file.type)) {
            return false;
        }

        if (file.size > maxSize) {
            return false;
        }

        return true;
    }

    /**
     * Converte blob para File
     * @param {Blob} blob - Blob a ser convertido
     * @param {string} fileName - Nome do arquivo
     * @returns {File} - Arquivo convertido
     */
    blobToFile(blob, fileName) {
        return new File([blob], fileName, {
            type: blob.type,
            lastModified: Date.now()
        });
    }

    /**
     * Gera preview da imagem para exibição
     * @param {File} imageFile - Arquivo de imagem
     * @returns {Promise<string>} - URL de preview
     */
    async generatePreview(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                resolve(e.target.result);
            };
            
            reader.onerror = () => {
                reject(new Error('Erro ao gerar preview da imagem'));
            };
            
            reader.readAsDataURL(imageFile);
        });
    }
}

// Instanciar processador globalmente
window.WatermarkProcessor = new WatermarkProcessor();

// Exportar para uso em módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WatermarkProcessor;
}

