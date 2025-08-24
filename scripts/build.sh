
#!/bin/bash

echo "🚀 Iniciando build otimizado do Fotos63..."

# Limpar diretório de build
echo "🧹 Limpando diretório public..."
rm -rf public/*.html public/js/* public/css/*

# Criar estrutura necessária
mkdir -p public/js public/css public/assets public/config public/database

# Copiar páginas HTML 
echo "📄 Copiando páginas HTML..."
cp src/pages/*.html public/

# Copiar configurações
echo "⚙️  Copiando configurações..."
cp -r src/config public/
cp -r database/* public/database/

# Copiar imagens otimizadas (já foram otimizadas anteriormente)
echo "🖼️  Copiando assets otimizados..."
cp -r public/assets/* public/assets/ 2>/dev/null || true

# Copiar JavaScript minificado (já foi minificado)
echo "📦 Copiando JavaScript minificado..."
cp public/js/*.min.js public/js/ 2>/dev/null || true

# Atualizar caminhos nas páginas HTML para usar assets otimizados
echo "🔗 Atualizando referências para assets otimizados..."

for htmlfile in public/*.html; do
    if [ -f "$htmlfile" ]; then
        # Atualizar caminhos das imagens para versões otimizadas
        sed -i 's|src="favicon\.png"|src="assets/optimized/favicon.png"|g' "$htmlfile"
        sed -i 's|href="favicon\.png"|href="assets/optimized/favicon.png"|g' "$htmlfile"
        sed -i 's|src="hero-image\.jpg"|src="assets/optimized/hero-image.jpg"|g' "$htmlfile"
        sed -i 's|src="sports-hero\.png"|src="assets/optimized/sports-hero.png"|g' "$htmlfile"
        
        # Atualizar caminhos dos scripts de configuração
        sed -i 's|src="../config/|src="config/|g' "$htmlfile"
        
        echo "   ✅ Atualizado: $(basename "$htmlfile")"
    fi
done

# Criar arquivo de configuração de build
cat > public/_headers << 'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/js/*
  Cache-Control: public, max-age=31536000, immutable

/css/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate
EOF

# Criar arquivo de redirecionamentos para Netlify
cat > public/_redirects << 'EOF'
# Redirecionar raiz para index.html
/ /index.html 200

# SPA fallback para rotas não encontradas
/* /index.html 404
EOF

echo ""
echo "✅ Build concluído com sucesso!"
echo ""
echo "📊 Resumo do build:"
echo "   📄 HTMLs: $(ls public/*.html | wc -l) arquivos"
echo "   🖼️  Imagens otimizadas: $(ls public/assets/optimized/* 2>/dev/null | wc -l) arquivos"
echo "   📦 JavaScripts minificados: $(ls public/js/*.min.js 2>/dev/null | wc -l) arquivos"
echo "   💾 Tamanho total: $(du -sh public/ | cut -f1)"
echo ""
echo "🌐 Para testar o build: yarn serve:prod"
echo "🚀 Para deploy no Netlify: yarn deploy:netlify"
EOF

# Dar permissão de execução
chmod +x scripts/build.sh
