const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');

async function optimizeImages() {
    console.log('🖼️  Otimizando imagens...');
    
    try {
        // Otimizar PNGs
        const pngFiles = await imagemin(['src/assets/*.png'], {
            destination: 'src/assets/optimized',
            plugins: [
                imageminPngquant({
                    quality: [0.6, 0.8],
                    strip: true
                })
            ]
        });
        
        // Otimizar JPEGs  
        const jpegFiles = await imagemin(['src/assets/*.jpg'], {
            destination: 'src/assets/optimized',
            plugins: [
                imageminMozjpeg({
                    quality: 80,
                    progressive: true
                })
            ]
        });
        
        // Gerar versões WebP
        const webpFiles = await imagemin(['src/assets/*.{png,jpg}'], {
            destination: 'src/assets/webp',
            plugins: [
                imageminWebp({
                    quality: 80
                })
            ]
        });
        
        console.log('✅ Otimização concluída!');
        console.log(`📊 PNGs otimizados: ${pngFiles.length}`);
        console.log(`📊 JPEGs otimizados: ${jpegFiles.length}`);
        console.log(`📊 WebPs gerados: ${webpFiles.length}`);
        
        // Mostrar economia de espaço
        for (const file of [...pngFiles, ...jpegFiles]) {
            const originalPath = file.sourcePath;
            const optimizedPath = file.destinationPath;
            
            if (fs.existsSync(originalPath) && fs.existsSync(optimizedPath)) {
                const originalSize = fs.statSync(originalPath).size;
                const optimizedSize = fs.statSync(optimizedPath).size;
                const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
                
                console.log(`💾 ${file.sourcePath.split('/').pop()}: ${(originalSize/1024/1024).toFixed(1)}MB → ${(optimizedSize/1024/1024).toFixed(1)}MB (${savings}% economia)`);
            }
        }
        
    } catch (error) {
        console.error('❌ Erro na otimização:', error);
    }
}

optimizeImages();
