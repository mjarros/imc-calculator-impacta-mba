import { NextResponse } from "next/server";
import { avaliar, validar } from "@/lib/imc";

/**
 * POST /api/imc
 * Corpo: { "peso": 72.5, "altura": 1.75 }  (também aceita "72,5" e "1,75")
 * Resposta 200: { "imc": 23.7, "classificacao": "Normal", "descricao": "..." }
 * Resposta 400: { "erro": "...", "campos": { "peso"?: "...", "altura"?: "..." } }
 */
export async function POST(request: Request) {
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json(
      { erro: "Envie um JSON com os campos peso e altura." },
      { status: 400 },
    );
  }

  if (typeof corpo !== "object" || corpo === null || Array.isArray(corpo)) {
    return NextResponse.json(
      { erro: "Envie um JSON com os campos peso e altura." },
      { status: 400 },
    );
  }

  const { peso, altura } = corpo as Record<string, unknown>;
  const validacao = validar(peso, altura);
  if (!validacao.ok) {
    return NextResponse.json(
      { erro: "Revise os dados informados.", campos: validacao.erros },
      { status: 400 },
    );
  }

  return NextResponse.json(avaliar(validacao.peso, validacao.altura));
}

/** GET /api/imc?peso=72.5&altura=1.75 — atalho para testar pelo navegador. */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const validacao = validar(params.get("peso") ?? undefined, params.get("altura") ?? undefined);
  if (!validacao.ok) {
    return NextResponse.json(
      { erro: "Revise os dados informados.", campos: validacao.erros },
      { status: 400 },
    );
  }
  return NextResponse.json(avaliar(validacao.peso, validacao.altura));
}
