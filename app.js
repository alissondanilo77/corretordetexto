const textoEl = document.getElementById('texto');
const langEl = document.getElementById('lang');
const btnEl = document.getElementById('btnCorretor');
const statusEl = document.getElementById('status');
const saidaEl = document.getElementById('saida');
const ocorrenciasEl = document.getElementById('ocorrencias');

function setStatus(msg, kind = 'info'){
  statusEl.textContent = msg;
  statusEl.style.color = kind === 'err' ? 'var(--danger)' : kind === 'ok' ? 'var(--ok)' : 'var(--muted)';
}

function escapeHtml(s){
  return (s ?? '').toString()
    .replaceAll('&','&amp;')
    .replaceAll('<','<')
    .replaceAll('>','>')
    .replaceAll('"','"')
    .replaceAll("'",'&#039;');
}

function renderOccurrences(matches){
  ocorrenciasEl.innerHTML = '';
  if(!matches || matches.length === 0){
    ocorrenciasEl.innerHTML = '<div class="occ-item"><div class="occ-head"><span class="badge ok">OK</span></div><div class="occ-meta">Nenhuma ocorrência encontrada.</div></div>';
    return;
  }

  for(const m of matches){
    const replacements = (m.replacements || []).slice(0, 8);
    const sugg = replacements.length
      ? `<div class="occ-sug"><div class="occ-meta">Sugestões</div><ul>${replacements.map(r=>`<li>${escapeHtml(r)}</li>`).join('')}</ul></div>`
      : '';

    const ruleId = m.ruleId ? escapeHtml(m.ruleId) : '';
    const msg = m.message ? escapeHtml(m.message) : '';

    const badgeClass = replacements.length ? 'err' : '';
    const badgeText = replacements.length ? 'Sugestão' : 'Ocorrência';

    const item = document.createElement('div');
    item.className = 'occ-item';
    item.innerHTML = `
      <div class="occ-head">
        <span class="badge ${badgeClass}">${badgeText}</span>
        <span class="badge">${ruleId}</span>
      </div>
      <div class="occ-meta">${msg}</div>
      ${sugg}
    `;
    ocorrenciasEl.appendChild(item);
  }
}

btnEl.addEventListener('click', async () => {
  const text = textoEl.value ?? '';
  const lang = langEl.value;

  if(text.trim().length === 0){
    setStatus('Digite um texto para corrigir.', 'err');
    return;
  }

  btnEl.disabled = true;
  setStatus('Corrigindo...');
  saidaEl.textContent = '—';

  try{
    const res = await fetch('/api/correct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, lang })
    });

    if(!res.ok){
      const err = await res.text();
      throw new Error(err || `HTTP ${res.status}`);
    }

    const data = await res.json();

    // data.original, data.corrected (string), data.matches (array)
    saidaEl.textContent = data.corrected || '(sem sugestão)';
    renderOccurrences(data.matches || []);

    setStatus('Finalizado.', 'ok');
  }catch(e){
    console.error(e);
    setStatus('Falha ao corrigir. Verifique o servidor e a configuração da API.', 'err');
  }finally{
    btnEl.disabled = false;
  }
});

