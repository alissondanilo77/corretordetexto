# 🔌 Exemplos de Uso da API

## Endpoint: POST `/api/correct`

Corrige um texto usando LanguageTool.

## cURL

### Português
```bash
curl -X POST http://localhost:3000/api/correct \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Testo com erro de acentuação",
    "lang": "pt"
  }'
```

### Português Brasil
```bash
curl -X POST http://localhost:3000/api/correct \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Texto com erroo",
    "lang": "pt-BR"
  }'
```

### Inglês
```bash
curl -X POST http://localhost:3000/api/correct \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a sentense with error",
    "lang": "en-US"
  }'
```

## JavaScript/Fetch

### Exemplo Básico
```javascript
async function checkText(text, lang = 'pt') {
  const response = await fetch('/api/correct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, lang }),
  });

  const data = await response.json();
  return data;
}

// Usar
checkText('Testo com erro').then(result => {
  console.log('Erros encontrados:', result.matches);
  console.log('Texto corrigido:', result.corrected);
});
```

### Exemplo com Error Handling
```javascript
async function checkTextSafe(text, lang = 'pt') {
  try {
    const response = await fetch('/api/correct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, lang }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('API retornou erro:', data.error);
      return null;
    }

    return {
      matches: data.matches || [],
      corrected: data.corrected || text,
      original: data.original || text,
    };
  } catch (error) {
    console.error('Erro ao verificar texto:', error);
    return null;
  }
}
```

## Python

```python
import requests
import json

def check_text(text, lang='pt'):
    """
    Verifica texto usando a API do Corretor
    """
    url = 'http://localhost:3000/api/correct'
    
    payload = {
        'text': text,
        'lang': lang
    }
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Erro na requisição: {e}')
        return None

# Exemplos de uso
if __name__ == '__main__':
    # Português
    result = check_text('Testo com erro')
    if result:
        print(f'Erros encontrados: {len(result["matches"])}')
        for match in result['matches']:
            print(f'  - {match["message"]}')
            print(f'    Sugestões: {", ".join(match["replacements"])}')
    
    # Inglês
    result = check_text('This is a sentense', 'en-US')
    if result:
        print(f'Erros: {result["matches"]}')
```

## Response Format

### Success (200)
```json
{
  "original": "Testo com erro",
  "corrected": "Texto com erro",
  "matches": [
    {
      "id": 0,
      "ruleId": "TYPO",
      "message": "Possível erro de digitação",
      "offset": 0,
      "length": 5,
      "replacements": ["Texto"]
    },
    {
      "id": 1,
      "ruleId": "DE_CASE",
      "message": "Erro de maiúscula/minúscula",
      "offset": 10,
      "length": 3,
      "replacements": ["com"]
    }
  ]
}
```

### Error (400)
```json
{
  "error": "Missing \"text\""
}
```

### Error (502)
```json
{
  "error": "LanguageTool request failed",
  "status": 500,
  "details": "Internal server error"
}
```

## Request Parameters

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `text` | string | ✅ Sim | - | Texto a verificar |
| `lang` | string | ❌ Não | `pt` | Código de idioma |

## Idiomas Suportados

| Código | Idioma |
|--------|--------|
| `pt` | Português (Portugal) |
| `pt-BR` | Português (Brasil) |
| `en` | Inglês (genérico) |
| `en-US` | Inglês (EUA) |
| `en-GB` | Inglês (Reino Unido) |
| `es` | Espanhol |
| `fr` | Francês |
| `de` | Alemão |
| `nl` | Holandês |
| `it` | Italiano |
| `ru` | Russo |
| `pl` | Polonês |
| `uk` | Ucraniano |
| `ja` | Japonês |
| `zh` | Chinês |

## Rate Limiting

### Sem API Key
- **Limite**: ~20 requisições por minuto
- **Reset**: A cada minuto

### Com API Key
- **Limite**: Ilimitado (depende do plano)
- **Configure**: Adicione `LT_API_KEY` em `.env.local`

## Testing

### Com Postman
1. Criar nova requisição POST
2. URL: `http://localhost:3000/api/correct`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "text": "Seu texto aqui",
  "lang": "pt"
}
```

### Com Thunder Client (VS Code)
- Extensão: Thunder Client
- Mesma configuração que Postman

### Com REST Client (VS Code)
```http
POST http://localhost:3000/api/correct
Content-Type: application/json

{
  "text": "Testo com erro",
  "lang": "pt"
}
```

## Performance Tips

1. **Debounce de requisições**: Não fazer request a cada keystroke
2. **Cache de respostas**: Para o mesmo texto, reusar resultado
3. **Batch requests**: Enviar múltiplos textos em uma requisição
4. **Comprimir dados**: Para textos muito longos

## Exemplo: Debounce

```javascript
let debounceTimer;

function handleTextChange(text) {
  clearTimeout(debounceTimer);
  
  debounceTimer = setTimeout(() => {
    checkText(text);
  }, 500); // aguardar 500ms após parar de digitar
}
```

## Exemplo: Cache

```javascript
const cache = new Map();

async function checkTextCached(text, lang = 'pt') {
  const key = `${text}:${lang}`;
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = await checkText(text, lang);
  cache.set(key, result);
  
  return result;
}
```

## Troubleshooting

### "Cannot POST /api/correct"
- Servidor não está rodando
- Caminho da URL está errado
- Método da requisição não é POST

### "401 Unauthorized"
- API Key inválida em `.env.local`
- Ou requisição excessiva (rate limit)

### "429 Too Many Requests"
- Excedeu limite de requisições
- Adicione debounce
- Configure API Key do LanguageTool

### "500 Internal Server Error"
- Erro no servidor
- Verificar logs com `npm run dev`

## Documentação Oficial

- [LanguageTool API](https://languagetool.org/dev)
- [LanguageTool API Doc](https://languagetool.org/api/swagger-ui/index.html)
