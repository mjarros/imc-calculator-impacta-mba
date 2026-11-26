import { describe, expect, it } from "vitest";
import { avaliar, calcularImc, classificarImc, validar } from "@/lib/imc";

describe("calcularImc", () => {
  it("aplica peso / altura²", () => {
    expect(calcularImc(70, 1.75)).toBeCloseTo(22.857, 3);
  });
});

describe("classificarImc", () => {
  it.each([
    [16, "Magreza"],
    [18.4, "Magreza"],
    [18.5, "Normal"],
    [24.9, "Normal"],
    [24.91, "Normal"], // arredonda para 24,9
    [25, "Sobrepeso"],
    [30, "Sobrepeso"],
    [30.1, "Obesidade"],
    [42, "Obesidade"],
  ] as const)("%d → %s", (imc, esperado) => {
    expect(classificarImc(imc)).toBe(esperado);
  });
});

describe("avaliar", () => {
  it("retorna IMC com 1 casa e a classificação", () => {
    expect(avaliar(70, 1.75)).toMatchObject({ imc: 22.9, classificacao: "Normal" });
    expect(avaliar(95, 1.7)).toMatchObject({ imc: 32.9, classificacao: "Obesidade" });
  });
});

describe("validar", () => {
  it("aceita vírgula decimal", () => {
    expect(validar("72,5", "1,75")).toEqual({ ok: true, peso: 72.5, altura: 1.75 });
  });
  it("rejeita campos vazios", () => {
    const r = validar("", undefined);
    expect(r.ok).toBe(false);
  });
  it("detecta altura em centímetros", () => {
    const r = validar(70, 175);
    expect(r.ok === false && r.erros.altura).toMatch(/centímetros/);
  });
  it("rejeita valores negativos e texto", () => {
    expect(validar(-5, 1.7).ok).toBe(false);
    expect(validar("abc", 1.7).ok).toBe(false);
  });
});
