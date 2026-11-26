import { describe, expect, it } from "vitest";
import { GET, POST } from "@/app/api/imc/route";

const URL_BASE = "http://localhost/api/imc";

function post(corpo: string) {
  return POST(
    new Request(URL_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: corpo,
    }),
  );
}

describe("POST /api/imc", () => {
  it("calcula e classifica com números", async () => {
    const r = await post(JSON.stringify({ peso: 70, altura: 1.75 }));
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ imc: 22.9, classificacao: "Normal" });
  });

  it("aceita vírgula decimal em texto", async () => {
    const r = await post(JSON.stringify({ peso: "95", altura: "1,70" }));
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ imc: 32.9, classificacao: "Obesidade" });
  });

  it("retorna 400 com erro por campo", async () => {
    const r = await post(JSON.stringify({ peso: "", altura: 175 }));
    expect(r.status).toBe(400);
    const dados = await r.json();
    expect(dados.campos.peso).toBeDefined();
    expect(dados.campos.altura).toMatch(/centímetros/);
  });

  it.each(["xx", "null", "[1,2]"])("retorna 400 para corpo inválido %s", async (corpo) => {
    const r = await post(corpo);
    expect(r.status).toBe(400);
    expect((await r.json()).erro).toMatch(/JSON/);
  });
});

describe("GET /api/imc", () => {
  it("calcula pela query string", async () => {
    const r = await GET(new Request(`${URL_BASE}?peso=82&altura=1.78`));
    expect(r.status).toBe(200);
    expect(await r.json()).toMatchObject({ imc: 25.9, classificacao: "Sobrepeso" });
  });

  it("retorna 400 sem parâmetros", async () => {
    const r = await GET(new Request(URL_BASE));
    expect(r.status).toBe(400);
  });
});
