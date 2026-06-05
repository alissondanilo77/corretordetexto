@echo off
REM Script de setup do projeto Corretor de Texto

echo 🚀 Iniciando setup do Corretor de Texto...

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js não está instalado. Por favor, instale Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% detectado

REM Instalar dependências
echo 📦 Instalando dependências...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)

echo ✅ Dependências instaladas

REM Criar arquivo .env.local se não existir
if not exist .env.local (
    echo 📝 Criando .env.local...
    copy .env.example .env.local
    echo ✅ .env.local criado. Configure com sua API key do LanguageTool se necessário
)

REM Build
echo 🔨 Compilando projeto...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Erro ao compilar
    pause
    exit /b 1
)

echo ✅ Build concluído

echo.
echo ================================================
echo ✨ Setup completo!
echo ================================================
echo.
echo Para iniciar o servidor de desenvolvimento:
echo   npm run dev
echo.
echo Aplicação estará disponível em: http://localhost:3000
echo.
pause
