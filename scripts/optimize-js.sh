
#!/bin/bash

echo "📦 Script de otimização JavaScript"
echo "   Verificando arquivos minificados..."

if [ -d "public/js" ] && [ "$(ls -A public/js/*.min.js 2>/dev/null)" ]; then
    echo "   ✅ JavaScript minificado encontrado"
    ls -lh public/js/*.min.js | awk '{print "      " $9 ": " $5}'
else
    echo "   🔧 Minificando JavaScript..."
    
    mkdir -p public/js
    
    # Lista dos arquivos JavaScript para minificar
    JS_FILES=("event-analytics-dashboard.js" "event-management.js" "email-marketing.js" "gallery-customization.js" "print-on-demand.js" "premium-subscription.js" "physical-products.js" "seo-optimization.js" "api-functions.js" "facial-recognition.js" "intelligent-upsell.js" "intuitive-ux.js" "payment-integration.js" "watermark-processor.js" "withdrawal-system.js")
    
    for file in "${JS_FILES[@]}"; do
        if [ -f "src/services/$file" ]; then
            echo "      Minificando $file..."
            npx terser src/services/$file -o public/js/${file%.js}.min.js --compress --mangle --source-map 2>/dev/null || {
                echo "         ⚠️  Falha na minificação, copiando original..."
                cp src/services/$file public/js/${file%.js}.min.js
            }
        fi
    done
    
    echo "   ✅ Minificação concluída"
fi
