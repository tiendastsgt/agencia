#!/bin/bash

# Preparar MarketPro GT para GitHub
echo "🚀 Preparando MarketPro GT para GitHub..."

# Limpiar archivos de desarrollo
echo "🧹 Limpiando archivos de desarrollo..."
rm -rf node_modules/
rm -rf dist/
rm -rf .vite/
rm -f .env.local

# Verificar que no hay información sensible
echo "🔒 Verificando que no hay información sensible..."
if grep -r "eyJ\|sk-" src/ 2>/dev/null; then
    echo "❌ ¡ADVERTENCIA! Se encontró información sensible en src/"
    echo "   Por favor, revisa los archivos antes de subir a GitHub"
    exit 1
else
    echo "✅ No se encontró información sensible en src/"
fi

# Verificar que existe .env.example
if [ ! -f ".env.example" ]; then
    echo "❌ Falta el archivo .env.example"
    exit 1
else
    echo "✅ .env.example encontrado"
fi

# Verificar que existe .gitignore
if [ ! -f ".gitignore" ]; then
    echo "❌ Falta el archivo .gitignore"
    exit 1
else
    echo "✅ .gitignore encontrado"
fi

echo ""
echo "✅ ¡MarketPro GT está listo para GitHub!"
echo ""
echo "📋 Próximos pasos:"
echo "1. git init (si es un repo nuevo)"
echo "2. git add ."
echo "3. git commit -m 'feat: initial commit - MarketPro GT v1.0.0'"
echo "4. git remote add origin https://github.com/tu-usuario/marketpro-gt.git"
echo "5. git push -u origin main"
echo ""
echo "🔧 No olvides:"
echo "- Configurar las GitHub Secrets para CI/CD"
echo "- Configurar Vercel/Netlify para deployment"
echo "- Actualizar las URLs en README.md"
