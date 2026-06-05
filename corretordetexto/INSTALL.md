# 📦 Instalação de Dependências

## Pré-requisitos
- Node.js 18+
- npm ou yarn

## Passo 1: Instalar Dependências Principais

Execute no diretório `corretordetexto/`:

```bash
npm install lexical @lexical/react @lexical/plain-text zustand zod
```

### O que cada pacote faz:

| Pacote | Versão | Uso |
|--------|--------|-----|
| **lexical** | ^0.16.0 | Editor de texto avançado |
| **@lexical/react** | ^0.16.0 | Integração React para Lexical |
| **@lexical/plain-text** | ^0.16.0 | Plugin de texto simples |
| **zustand** | ^4.5.0 | State management |
| **zod** | ^3.23.0 | Validação de dados em runtime |

## Passo 2: Verificar Instalação

```bash
# Ver todos os pacotes instalados
npm list

# Verificar se TypeScript detecta tudo
npx tsc --noEmit
```

## Passo 3: Configurar Variáveis de Ambiente

### Copiar arquivo de exemplo:
```bash
cp .env.example .env.local
```

### (Opcional) Configurar API key do LanguageTool:

1. Visite: https://languagetool.org/dev
2. Crie uma conta
3. Gere uma API key
4. Cole em `.env.local`:
   ```
   LT_API_KEY=sua_chave_aqui
   ```

## Passo 4: Iniciar Servidor

```bash
npm run dev
```

Acesse: http://localhost:3000

## Troubleshooting

### "Cannot find module 'lexical'"
```bash
# Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install
```

### "Lexical is not defined"
- Verifique se o import está correto
- `import { LexicalComposer } from '@lexical/react/LexicalComposer'`

### "Zod validation failed"
- Verificar logs do servidor
- Checar se o JSON enviado está no formato correto

### "LanguageTool API error"
- Verificar conexão com internet
- Sem API key, limite é ~20 requisições/minuto
- Com API key, o limite é maior

## Dependências Já Incluídas

O projeto já vem com:
- ✅ Next.js 16
- ✅ React 19
- ✅ TypeScript 5
- ✅ Tailwind CSS 4
- ✅ ESLint 9

## Próximas Features (Quando Instalar)

Para adicionar mais features:

### Autenticação (NextAuth)
```bash
npm install next-auth
```

### Database (Prisma)
```bash
npm install @prisma/client
npm install -D prisma
```

### UI Components (shadcn/ui)
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dropdown-menu
```

### Analytics (Vercel)
```bash
npm install @vercel/analytics @vercel/web-vitals
```

## Verificação de Instalação

Após instalar, teste com:

```bash
# 1. Verificar tipos
npx tsc --noEmit

# 2. Iniciar servidor
npm run dev

# 3. Fazer request de teste
curl -X POST http://localhost:3000/api/correct \
  -H "Content-Type: application/json" \
  -d '{"text":"Testo com erro","lang":"pt"}'
```

## ✅ Checklist

- [ ] Node.js instalado (versão 18+)
- [ ] npm install executado
- [ ] .env.local criado (copiar de .env.example)
- [ ] npm run dev funciona
- [ ] Browser abre sem erros
- [ ] Digitar texto e ver sugestões aparecer
- [ ] API responde corretamente

## 📝 Notas Importantes

1. **Versões**: Às vezes, versões diferentes podem ter incompatibilidades. Se tiver problemas, tente instalar versões específicas:
   ```bash
   npm install lexical@0.16.0 @lexical/react@0.16.0
   ```

2. **Cache do npm**: Se houver problemas estranhos:
   ```bash
   npm cache clean --force
   rm -rf node_modules
   npm install
   ```

3. **Port já em uso**: Se porta 3000 estiver ocupada:
   ```bash
   npm run dev -- -p 3001
   ```

4. **Build para produção**:
   ```bash
   npm run build
   npm start
   ```

## 🆘 Suporte

Se tiver problemas:
1. Verificar console (F12)
2. Ler mensagens de erro
3. Conferir `.env.local`
4. Reinstalar node_modules
5. Verificar Node.js version
