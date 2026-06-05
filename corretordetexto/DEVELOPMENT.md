# 🛠️ Guia de Desenvolvimento

## Stack Técnico Explicado

### Frontend
- **Next.js 16**: Framework React com SSR/SSG
- **Tailwind CSS 4**: Utility-first CSS framework
- **Lexical**: Editor de texto avançado (criado pelo Meta/Facebook)
- **Zustand**: State management leve e reativo

### Backend
- **Next.js API Routes**: Serverless functions
- **LanguageTool**: Engine de correção de texto

### Validation & Type Safety
- **TypeScript**: Type safety
- **Zod**: Runtime validation de dados

## 📁 Estrutura do Código Explicada

### `/app`
Contém as páginas e API routes do Next.js.

```
app/
├── api/correct/route.ts          # POST /api/correct - processa correções
├── editor.css                     # Estilos específicos do editor
├── globals.css                    # Estilos globais Tailwind
├── layout.tsx                     # Layout raiz (HTML)
└── page.tsx                       # Página inicial
```

### `/components`
Componentes React reutilizáveis.

```
components/
├── ErrorBoundary.tsx             # Error boundary para erros do Lexical
├── LexicalEditor.tsx             # Componente principal do editor
├── SuggestionMenu.tsx            # Menu com sugestões de correção
└── UnderlinePlugin.tsx           # Plugin que renderiza erros
```

### `/lib`
Lógica compartilhada e hooks.

```
lib/
├── correction.ts                 # Funções de validação e fetch da API
├── hooks.ts                      # Custom hooks (useCorrectionCheck)
├── lexical-utils.ts              # Utilitários para Lexical
└── store.ts                      # Zustand store global
```

### `/types`
Definições de tipos TypeScript.

```
types/
└── correction.ts                 # Types: CorrectionMatch, CorrectionResponse
```

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────┐
│                         Página (page.tsx)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ LexicalEditor Component                                │ │
│  │                                                        │ │
│  │  onChange(editorState) →                              │ │
│  │  • Extrai texto                                       │ │
│  │  • Atualiza store (setText)                           │ │
│  │  • Faz debounce de 500ms                              │ │
│  │  • Chama checkText(text, language)                    │ │
│  └────────────────────────────────────────────────────────┘ │
│               ↓                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ API Call: /api/correct                                │ │
│  │                                                        │ │
│  │  POST { text, lang } →                                │ │
│  │  Server calls LanguageTool →                          │ │
│  │  Response { matches, corrected } ←                    │ │
│  └────────────────────────────────────────────────────────┘ │
│               ↓                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Zustand Store Update                                  │ │
│  │                                                        │ │
│  │  setSuggestions(matches)                              │ │
│  │  setIsLoading(false)                                  │ │
│  └────────────────────────────────────────────────────────┘ │
│               ↓                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Re-render Components                                  │ │
│  │                                                        │ │
│  │  • UnderlinePlugin: Renderiza sublinhados             │ │
│  │  • SuggestionsList: Mostra erros encontrados          │ │
│  │  • SuggestionMenu: Menu ao clicar em palavra          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Segurança

### Validação
- **Zod** valida dados da API
- TypeScript previne tipos inválidos
- Sanitização básica de input

### Rate Limiting
- LanguageTool tem limite (20 req/min sem API key)
- Debounce evita requisições excessivas
- Considerar implementar rate limit no servidor

### CORS
- API routes são same-origin
- Nenhum CORS necessário

## 🎨 Customização

### Cores
Edite em `editor.css`:
```css
.underline-error {
  @apply underline decoration-red-500 decoration-wavy;
}
```

### Debounce
Edite em `LexicalEditor.tsx`:
```tsx
const newTimer = setTimeout(async () => {
  // Aumentar ou diminuir este valor (em ms)
}, 500);  // ← Aqui
```

### Idiomas
Edite em `page.tsx`:
```tsx
<select value={language} onChange={(e) => setLanguage(e.target.value)}>
  <option value="pt">Português</option>
  <option value="novo-codigo">Novo Idioma</option>
</select>
```

## 🧪 Testes

### Manual
1. Abrir http://localhost:3000
2. Digitar texto com erros (ex: "Testo com erro")
3. Aguardar 500ms
4. Verificar sugestões

### API
```bash
curl -X POST http://localhost:3000/api/correct \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Testo com erro",
    "lang": "pt"
  }'
```

### Type Check
```bash
npx tsc --noEmit
```

## 🐛 Debugging

### Console
```tsx
// Em qualquer componente
console.log('store:', useEditorStore.getState());
```

### React DevTools
Instale extensão de browser para debugar componentes

### Network Tab
Verifique requisições da API em F12 → Network

## 📊 Performance

### Lighthouse
```bash
# Build para produção
npm run build

# Servir locally
npm start

# Abrir em http://localhost:3000
# F12 → Lighthouse → Gerar relatório
```

### Metrics Importantes
- FCP (First Contentful Paint): < 1.8s
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1

## 🚀 Deployment

### Vercel (Recomendado)
1. Push para GitHub
2. Connect repo no Vercel
3. Deploy automático

### Environment Variables
Criar `.env.local` com:
```
LT_API_KEY=sua_chave_aqui
```

### Build
```bash
npm run build
npm start
```

## 📚 Referências Internas

### Como usar Zustand
```tsx
import { useEditorStore } from '@/lib/store';

export default function MyComponent() {
  const { text, suggestions } = useEditorStore();
  // Hook atualiza automaticamente quando store muda
}
```

### Como fazer fetch da API
```tsx
import { checkText } from '@/lib/correction';

const matches = await checkText(text, 'pt');
// matches é tipado e validado com Zod
```

### Como usar Custom Hook
```tsx
import { useCorrectionCheck } from '@/lib/hooks';

export default function MyComponent() {
  const { checkAndUpdateSuggestions } = useCorrectionCheck();
  
  // Usar em useEffect
  useEffect(() => {
    checkAndUpdateSuggestions(text);
  }, [text, checkAndUpdateSuggestions]);
}
```

## 🎓 Dicas & Boas Práticas

1. **Sempre usar `@/` para imports** (alias configurado)
2. **Colocar `'use client'` no topo de componentes React**
3. **Usar TypeScript strict mode**
4. **Debounce de operações pesadas**
5. **Validar sempre com Zod**

## 📞 Troubleshooting

### "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules .next
npm install
npm run dev
```

### "Cannot use 'use client'"
- Verifique se está em um file com `'use client'` no topo
- Components de servidor não podem usar hooks

### "LanguageTool API returning 401"
- Configure `LT_API_KEY` em `.env.local`
- Ou use a API pública (com limitações)

## ✅ Checklist para Novas Features

- [ ] Criar component/hook em arquivo separado
- [ ] Adicionar tipos em `types/`
- [ ] Atualizar store se necessário
- [ ] Usar Zod para validar dados
- [ ] Testar localmente
- [ ] Verificar tipos com `tsc --noEmit`
- [ ] Adicionar documentação em comentários

