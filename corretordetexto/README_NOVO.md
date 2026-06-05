# 🎯 Corretor de Texto

Um corretor de ortografia e gramática em tempo real usando **Lexical**, **LanguageTool** e **Next.js 15+**.

## 🚀 Stack Tecnológico

- **Next.js 16** - Framework React moderno
- **Tailwind CSS 4** - Estilização
- **Lexical** - Editor de texto avançado
- **LanguageTool** - Motor de correção
- **Zustand** - State management
- **Zod** - Validação de dados

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- (Opcional) API key do LanguageTool para limites maiores

## ⚙️ Instalação

1. **Clone o repositório e entre no diretório:**
```bash
cd corretordetexto
```

2. **Instale as dependências:**
```bash
npm install
```

3. **(Opcional) Configure a API key do LanguageTool:**
```bash
# .env.local
LT_API_KEY=sua_chave_aqui
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

## ✨ Funcionalidades Implementadas

### ✅ Fase 1: Editor Funcionando
- ✅ Editor Lexical integrado
- ✅ Debounce de 500ms para melhor performance
- ✅ Suporte a múltiplos idiomas (PT, PT-BR, EN, ES, FR)
- ✅ State global com Zustand

### ✅ Fase 2: API de Correção
- ✅ Integração com LanguageTool
- ✅ Validação de dados com Zod
- ✅ Resposta estruturada com sugestões

### 🔄 Fase 3: Sublinhados Vermelhos (Em desenvolvimento)
- ⏳ Renderização de sublinhados nas palavras com erros
- ⏳ Atualização dinâmica dos sublinhados

### 🔄 Fase 4: Menu de Sugestões (Em desenvolvimento)
- ⏳ Menu contextual ao clicar em palavra marcada
- ⏳ Aplicação de sugestões ao texto

## 📁 Estrutura do Projeto

```
corretordetexto/
├── app/
│   ├── api/
│   │   └── correct/route.ts       # API de correção
│   ├── editor.css                  # Estilos do editor
│   ├── globals.css                 # Estilos globais
│   ├── layout.tsx                  # Layout raiz
│   └── page.tsx                    # Página inicial
├── components/
│   ├── ErrorBoundary.tsx          # Limite de erros
│   ├── LexicalEditor.tsx          # Editor Lexical
│   ├── SuggestionMenu.tsx         # Menu de sugestões
│   └── UnderlinePlugin.tsx        # Plugin de sublinhados
├── lib/
│   ├── correction.ts              # Tipos e funções de correção
│   └── store.ts                   # Zustand store
├── types/
│   └── correction.ts              # Tipos TypeScript
├── package.json
└── tsconfig.json
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm start        # Inicia servidor de produção
npm run lint     # Executa linter
```

## 📚 API Endpoints

### POST `/api/correct`

Corrige um texto usando LanguageTool.

**Request:**
```json
{
  "text": "Texto para correção",
  "lang": "pt"
}
```

**Response:**
```json
{
  "original": "Texto para correção",
  "corrected": "Texto para correção",
  "matches": [
    {
      "id": 0,
      "ruleId": "RULE_ID",
      "message": "Descrição do erro",
      "offset": 0,
      "length": 5,
      "replacements": ["sugestão1", "sugestão2"]
    }
  ]
}
```

## 🎨 Customização

### Mudar estilo do editor

Edite [editor.css](app/editor.css) para customizar:
- Cores
- Tipografia
- Comportamento do placeholder
- Estilos de sublinhado

### Adicionar novos idiomas

Atualize o select em [page.tsx](app/page.tsx):
```tsx
<option value="novo_codigo">Novo Idioma</option>
```

## 🐛 Troubleshooting

### "LanguageTool request failed"
- Verifique sua conexão com internet
- Para solicitações frequentes, configure a API key

### Editor não aparece
- Verifique se Lexical está instalado: `npm list lexical`
- Limpe cache: `npm cache clean --force`

## 📝 Notas Importantes

1. **Limite de requisições**: Sem API key, LanguageTool permite ~20 requisições/minuto
2. **Debounce**: Configurado em 500ms para evitar requisições excessivas
3. **Sugestões**: Apenas mostra erros com pelo menos uma sugestão

## 🔐 Segurança

- As requisições são feitas do servidor (server-side), não do cliente
- Nenhum dado é armazenado
- O texto é processado apenas durante a validação

## 📄 Licença

MIT

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! 

## 📞 Suporte

Para mais informações sobre LanguageTool, visite: https://languagetool.org/
