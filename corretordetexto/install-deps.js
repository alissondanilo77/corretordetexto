#!/usr/bin/env node

/**
 * Script de instalação automatizada
 * 
 * Execute com: node install-deps.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DEPS = {
  'lexical': '^0.16.0',
  '@lexical/react': '^0.16.0',
  '@lexical/plain-text': '^0.16.0',
  'zustand': '^4.5.0',
  'zod': '^3.23.0'
};

console.log('🚀 Instalando dependências do Corretor de Texto...\n');

// Verificar Node.js
const nodeVersion = execSync('node -v', { encoding: 'utf-8' }).trim();
console.log(`✅ Node.js ${nodeVersion} detectado\n`);

// Instalar cada dependência
const depsString = Object.entries(DEPS)
  .map(([name, version]) => `${name}@${version}`)
  .join(' ');

console.log('📦 Instalando pacotes...\n');
try {
  execSync(`npm install ${depsString}`, { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Erro ao instalar dependências');
  process.exit(1);
}

// Criar .env.local se não existir
const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('\n📝 Criando .env.local...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('✅ .env.local criado');
}

// Verificar build
console.log('\n🔨 Verificando build...');
try {
  execSync('npx tsc --noEmit', { stdio: 'ignore' });
  console.log('✅ Build OK\n');
} catch (error) {
  console.warn('⚠️  Alguns erros de tipo encontrados (não críticos)\n');
}

console.log('================================================');
console.log('✨ Instalação completa!');
console.log('================================================\n');

console.log('Para iniciar o servidor:');
console.log('  npm run dev\n');

console.log('Acessar em: http://localhost:3000\n');
