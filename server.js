import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json({ limit: '1mb' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname)));

// LanguageTool API: http(s)://api.languagetool.org/v2/check
// Recomendado: criar um servidor local para esconder token e evitar CORS.

app.post('/api/correct', async (req, res) => {
  try{
    const { text, lang } = req.body || {};
    if(!text || typeof text !== 'string'){
      return res.status(400).send('Missing "text"');
    }

    const language = lang || 'pt';

    const baseUrl = 'https://api.languagetool.org/v2/check';
    const apiKey = process.env.LT_API_KEY || ''; // opcional (muitas contas exigem)

    const params = new URLSearchParams();
    params.set('text', text);
    params.set('language', language);

    // Se você tiver token, envia em header. Algumas instâncias também aceitam query parameter.
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    if(apiKey){
      // LanguageTool usa diferentes esquemas conforme plano/instância.
      // Para cloud pública, o mais comum é Authorization: Bearer <token>.
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const r = await fetch(`${baseUrl}?${params.toString()}`, { headers });
    if(!r.ok){
      const t = await r.text();
      return res.status(r.status).send(t);
    }

    const data = await r.json();

    // Construir versão corrigida aplicando replace sugerido (simples/heurístico).
    // LanguageTool retorna matches com offsets e replacements.
    const matches = Array.isArray(data.matches) ? data.matches : [];

    // Ordenar por offset decrescente para aplicar substituições sem quebrar offsets.
    const ordered = matches
      .filter(m => m && Array.isArray(m.replacements) && m.replacements.length > 0)
      .slice()
      .sort((a,b) => (b.offset||0) - (a.offset||0));

    let corrected = text;
    for(const m of ordered){
      const off = m.offset;
      const len = m.length;
      const rep = m.replacements[0];
      if(typeof off === 'number' && typeof len === 'number' && rep){
        corrected = corrected.slice(0, off) + rep + corrected.slice(off + len);
      }
    }

    res.json({
      original: text,
      corrected,
      matches
    });

  }catch(e){
    console.error(e);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Corretor rodando em http://localhost:${PORT}`);
});


