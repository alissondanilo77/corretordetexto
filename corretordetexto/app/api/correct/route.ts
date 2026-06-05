import { NextResponse } from "next/server";

import type { CorrectionMatch, CorrectionResponse } from "../../types/correction";

type LTReplacement = {
value: string;
};

type LTMatch = {
offset: number;
length: number;
replacements: LTReplacement[];
message?: string;
rule?: {
id?: string;
};
};

type LTResponse = {
matches?: LTMatch[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { text?: unknown; lang?: unknown }
      | null;

    if (!body || typeof body.text !== "string") {
      return NextResponse.json(
        { error: 'Missing "text"' },
        { status: 400 }
      );
    }

    const text = body.text;
    const language =
      typeof body.lang === "string" && body.lang ? body.lang : "pt";

    const params = new URLSearchParams();
    params.set("text", text);
    params.set("language", language);

    const apiKey = process.env.LT_API_KEY || "";

    const headers: Record<string, string> = {
      "Content-Type": "application/x-www-form-urlencoded",
    };

    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    const response = await fetch(
      "https://api.languagetool.org/v2/check",
      {
        method: "POST",
        headers,
        body: params.toString(),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: "LanguageTool request failed",
          status: response.status,
          details: errorText,
        },
        { status: 502 }
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const bodyText = await response.text();
      return NextResponse.json(
        {
          error: "LanguageTool returned non-json",
          contentType,
          details: bodyText,
        },
        { status: 502 }
      );
    }

    const data = (await response.json()) as LTResponse;
    const matches = Array.isArray(data?.matches) ? data.matches : [];

    // sort desc by offset so slicing works
    const ordered = [...matches]
      .filter(
        (m) =>
          m &&
          Array.isArray(m.replacements) &&
          m.replacements.length > 0 &&
          typeof m.offset === "number" &&
          typeof m.length === "number"
      )
      .sort((a, b) => b.offset - a.offset);

    let corrected = text;
    for (const match of ordered) {
      const replacement = String(match.replacements?.[0]?.value ?? "");
      if (!replacement) continue;
      corrected =
        corrected.slice(0, match.offset) +
        replacement +
        corrected.slice(match.offset + match.length);
    }

    const normalized: CorrectionMatch[] = matches.map((match, index) => ({
      id: index,
      ruleId: match.rule?.id ?? "unknown",
      message: match.message ?? "Sugestão",
      offset: match.offset,
      length: match.length,
      replacements: match.replacements.map((r) => r.value),
    }));

    const responseBody: CorrectionResponse = {
      original: text,
      corrected,
      matches: normalized,
    };

    return NextResponse.json(responseBody);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "internal_server_error",
        message: e instanceof Error ? e.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  }
}

