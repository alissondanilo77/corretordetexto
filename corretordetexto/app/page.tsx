"use client";

import React, { useState } from "react";

type Match = {
  id?: number;
  ruleId?: string;
  message?: string;
  replacements?: string[];
  offset?: number | null;
  length?: number | null;
  contextText?: string;
};

type StatusKind = "info" | "err" | "ok";

type Status = {
  msg: string;
  kind: StatusKind;
};

export default function Home() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("pt");
  const [status, setStatus] = useState<Status>({
    msg: "",
    kind: "info",
  });

  const [ocorrencias, setOcorrencias] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleCorrect() {
    if (!text.trim()) {
      setStatus({
        msg: "Digite um texto para corrigir.",
        kind: "err",
      });
      return;
    }

    setLoading(true);
    setOcorrencias([]);

    setStatus({
      msg: "Corrigindo...",
      kind: "info",
    });

    try {
      const res = await fetch("/api/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          lang,
        }),
      });

      const responseText = await res.text();

      let data: unknown = {};


      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Resposta inválida da API:\n${responseText.slice(0, 300)}`
        );
      }

      type ApiResponse = {
        message?: string;
        error?: string;
        matches?: unknown;
        corrected?: unknown;
      };

      const api = data as ApiResponse;

      if (!res.ok) {
        throw new Error(api.message || api.error || `Erro HTTP ${res.status}`);
      }

      setOcorrencias(Array.isArray(api.matches) ? (api.matches as Match[]) : []);


      setStatus({
        msg: `Verificação concluída. ${Array.isArray(api.matches) ? api.matches.length : 0} ocorrência(s) encontrada(s).`,
        kind: "ok",
      });

    } catch (error) {
      console.error(error);
      setStatus({
        msg: error instanceof Error ? error.message : "Erro desconhecido.",
        kind: "err",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <header className="header">
        <h1>Corretor Ortográfico</h1>
        <p className="subtitle">Correção usando LanguageTool</p>
      </header>

      <section className="card">
        <label htmlFor="texto">Digite seu texto</label>

        <textarea
          id="texto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite um texto para análise..."
        />

        <div className="row">
          <div className="field">
            <label htmlFor="lang">Idioma</label>

            <select
              id="lang"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="pt">Português</option>
              <option value="en-US">Inglês</option>
              <option value="es">Espanhol</option>
              <option value="fr">Francês</option>
            </select>
          </div>

          <div className="field">
            <label>&nbsp;</label>

            <button onClick={handleCorrect} disabled={loading}>
              {loading ? "Corrigindo..." : "Corrigir"}
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Resultado</h2>

        <div
          className="status"
          style={{
            color:
              status.kind === "err" ? "red" : status.kind === "ok" ? "green" : "#666",
          }}
        >
          {status.msg}
        </div>

        <details open>
          <summary>Ocorrências encontradas</summary>

          {ocorrencias.length === 0 ? (
            <p>Nenhuma ocorrência encontrada.</p>
          ) : (
            ocorrencias.map((item, idx) => (
              <div key={idx} className="occ-item">
                <h4>{item.ruleId || "Regra"}</h4>

                <p>{item.message}</p>

                {item.contextText && (
                  <p>
                    <strong>Contexto:</strong> {item.contextText}
                  </p>
                )}

                {item.replacements && item.replacements.length > 0 && (
                  <>
                    <strong>Sugestões:</strong>
                    <ul>
                      {item.replacements.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))
          )}
        </details>
      </section>
    </main>
  );
}

