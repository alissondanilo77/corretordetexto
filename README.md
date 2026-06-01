# Corretor de Texto (LanguageTool API)

## O que é
Um corretor simples em HTML/JS que chama a LanguageTool API via um servidor Node local.

> Observação: para chamadas reais à API, pode ser necessário uma **chave (token)** dependendo do plano/instância.

## Como rodar
1. Instale Node.js (se ainda não tiver)
2. No diretório do projeto (`corretor-de-texto`), execute:

```bash
npm install
npm run dev
```

3. Abra no navegador:
- http://localhost:3001


## Token da LanguageTool (se necessário)
Se sua conta exigir, crie uma variável de ambiente:

- Windows (PowerShell):
```powershell
$env:LT_API_KEY="SEU_TOKEN_AQUI"
npm run dev
```

- CMD:
```bat
set LT_API_KEY=SEU_TOKEN_AQUI
npm run dev
```

Depois recarregue a página e clique em **Corrigir**.

