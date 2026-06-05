# 📝 Próximos Passos - Desenvolvimento

## Status Atual ✅

- [x] Editor Lexical integrado e funcionando
- [x] API de correção com LanguageTool integrada
- [x] Store Zustand configurado
- [x] Validação com Zod
- [x] Estilos Tailwind CSS
- [ ] Sublinhados visuais funcionando perfeitamente
- [ ] Menu de sugestões interativo

## 🎯 Fase 3: Melhorias nos Sublinhados

### Problema Atual
O plugin de sublinhados precisa de uma abordagem mais robusta para:
1. Renderizar estilos inline corretamente no Lexical
2. Sincronizar com os updates de texto
3. Manter os sublinhados mesmo após edições

### Solução Proposta

**Opção A: Usar um Custom Decorator Node**
```tsx
// components/ErrorNode.tsx
// Criar um node customizado do Lexical que renderize erros
import { DecoratorNode } from 'lexical';

export class ErrorNode extends DecoratorNode<HTMLSpanElement> {
  // Implementar decorador para palavras com erro
}
```

**Opção B: Usar Plugin com Overlay**
- Renderizar uma camada sobreposta com sublinhados CSS
- Sincronizar posições com o texto do editor

### Próximas Ações
1. [ ] Escolher entre Opção A ou B
2. [ ] Implementar sublinhados visuais
3. [ ] Testar com textos longos (>500 palavras)
4. [ ] Otimizar performance com debounce

## 🎯 Fase 4: Menu de Sugestões Avançado

### Recursos para Adicionar
- [ ] Detectar clique em palavra com erro
- [ ] Mostrar menu contextual com sugestões
- [ ] Aplicar sugestão com um clique
- [ ] Navegar entre erros com setas
- [ ] Ignorar/adicionar ao dicionário (quando integrado)

### Componentes Necessários
```tsx
// components/ContextMenu.tsx
- Posicionamento inteligente (não sair da tela)
- Atalhos de teclado (Tab, Enter, Escape)
- Acesso rápido às 3 primeiras sugestões

// hooks/useContextMenu.ts
- Gerenciar abertura/fechamento
- Rastrear posição do mouse
- Aplicar sugestão ao pressionar Enter
```

### Próximas Ações
1. [ ] Implementar detecção de clique em palavra
2. [ ] Conectar menu com sistema de sugestões
3. [ ] Testar atalhos de teclado
4. [ ] Adicionar ícones visuais

## 🎯 Fase 5: Banco de Dados (Futuro)

Quando quiser armazenar histórico ou dicionário customizado:

### Schema Sugerido
```sql
-- Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Histórico de correções
CREATE TABLE corrections (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  original_text TEXT,
  corrected_text TEXT,
  corrections_count INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dicionário customizado
CREATE TABLE custom_dictionary (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  word VARCHAR(255),
  language VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, word, language)
);
```

### ORM Sugerido
- **Prisma** + PostgreSQL
- Migrações automáticas
- Type-safe queries

### Próximas Ações
1. [ ] Escolher banco de dados (PostgreSQL / MongoDB)
2. [ ] Configurar Prisma
3. [ ] Implementar autenticação (NextAuth)
4. [ ] Salvar correções no banco

## 🚀 Otimizações

### Performance
- [ ] Lazy load do Lexical
- [ ] Web Workers para validação em background
- [ ] Cache de requisições do LanguageTool
- [ ] Compressão de texto antes de enviar

### UX
- [ ] Animações de sublinhado
- [ ] Toast notifications
- [ ] Tooltips com explicações dos erros
- [ ] Dark mode

### SEO & Deployment
- [ ] Open Graph meta tags
- [ ] Sitemap
- [ ] Deploy no Vercel
- [ ] Analytics (Vercel Analytics)

## 📚 Recursos Úteis

### Documentação
- [Lexical Editor](https://lexical.dev)
- [LanguageTool API](https://languagetool.org/dev)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Tailwind CSS 4](https://tailwindcss.com)

### Referências
- Grammar checkers: Grammarly, ProWritingAid
- Editor de código: VS Code (usa Lexical)
- Collab editing: Yjs + Lexical

## 🔧 Desenvolvimento Local

### Debug
```bash
# Ver logs do servidor
npm run dev

# Abrir DevTools do navegador
F12 → Console/Network/Performance
```

### Testar API localmente
```bash
curl -X POST http://localhost:3000/api/correct \
  -H "Content-Type: application/json" \
  -d '{"text":"Testo com erro","lang":"pt"}'
```

### Verificar tipos
```bash
npx tsc --noEmit
```

## 💡 Ideias Extras

- [ ] Integração com Google Docs
- [ ] Exportar para PDF com correções destacadas
- [ ] Modo de escrita focada (distraction-free)
- [ ] Sugestões em tempo real com IA
- [ ] Plugin para VSCode
- [ ] Integração com Slack/Discord
- [ ] API pública para desenvolvedores

## 📞 Contato & Suporte

Para dúvidas:
1. Verificar documentação do LanguageTool
2. Consultar Lexical docs
3. Abrir issue no repositório
