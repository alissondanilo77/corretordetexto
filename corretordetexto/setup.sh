#!/bin/bash

# Script de setup do projeto Corretor de Texto

echo "🚀 Iniciando setup do Corretor de Texto..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale Node.js 18+"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas"

# Criar arquivo .env.local se não existir
if [ ! -f .env.local ]; then
    echo "📝 Criando .env.local..."
    cp .env.example .env.local
    echo "✅ .env.local criado. Configure com sua API key do LanguageTool se necessário"
fi

# Build
echo "🔨 Compilando projeto..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro ao compilar"
    exit 1
fi

echo "✅ Build concluído"

echo ""
echo "================================================"
echo "✨ Setup completo!"
echo "================================================"
echo ""
echo "Para iniciar o servidor de desenvolvimento:"
echo "  npm run dev"
echo ""
echo "Aplicação estará disponível em: http://localhost:3000"
echo ""
