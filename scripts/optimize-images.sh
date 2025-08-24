
#!/bin/bash

echo "🖼️  Script de otimização de imagens"
echo "   (Imagens já foram otimizadas anteriormente)"
echo "   Verificando se as otimizações existem..."

if [ -d "public/assets/optimized" ] && [ "$(ls -A public/assets/optimized)" ]; then
    echo "   ✅ Imagens otimizadas encontradas"
    ls -lh public/assets/optimized/ | awk 'NR>1{print "      " $9 ": " $5}'
else
    echo "   ❌ Otimizações não encontradas, executando otimização..."
    
    # Criar pastas
    mkdir -p public/assets/optimized public/assets/webp
    
    # Otimizar com ImageMagick
    if command -v convert &> /dev/null; then
        echo "   🔧 Usando ImageMagick para otimizar..."
        
        for img in src/assets/*.{png,jpg}; do
            if [ -f "$img" ]; then
                filename=$(basename "$img")
                echo "      Otimizando $filename..."
                
                if [[ "$filename" == *.png ]]; then
                    convert "$img" -quality 85 -strip "public/assets/optimized/$filename"
                    convert "$img" -quality 80 -format webp "public/assets/webp/${filename%.png}.webp"
                elif [[ "$filename" == *.jpg ]]; then
                    convert "$img" -quality 80 -strip "public/assets/optimized/$filename"
                    convert "$img" -quality 75 -format webp "public/assets/webp/${filename%.jpg}.webp"
                fi
            fi
        done
        
        echo "   ✅ Otimização concluída"
    else
        echo "   ❌ ImageMagick não encontrado, copiando originais..."
        cp src/assets/*.{png,jpg} public/assets/optimized/ 2>/dev/null || true
    fi
fi
