export type Classificacao = "Magreza" | "Normal" | "Sobrepeso" | "Obesidade";

export const LIMITES = {
  peso: { min: 1, max: 500 },
  altura: { min: 0.5, max: 2.6 },
} as const;

export interface ResultadoImc {
  imc: number;
  classificacao: Classificacao;
  descricao: string;
}

const DESCRICOES: Record<Classificacao, string> = {
  Magreza: "IMC abaixo de 18,5 kg/m².",
  Normal: "IMC entre 18,5 e 24,9 kg/m².",
  Sobrepeso: "IMC acima de 24,9 e até 30 kg/m².",
  Obesidade: "IMC acima de 30 kg/m².",
};

/** IMC = peso / altura² */
export function calcularImc(peso: number, altura: number): number {
  return peso / (altura * altura);
}

/**
 * Faixas da disciplina:
 *  - Magreza:   IMC < 18,5
 *  - Normal:    18,5 ≤ IMC ≤ 24,9
 *  - Sobrepeso: 24,9 < IMC ≤ 30
 *  - Obesidade: IMC > 30
 * A classificação usa o IMC arredondado para 1 casa decimal, o mesmo valor exibido ao usuário.
 */
export function classificarImc(imc: number): Classificacao {
  const valor = arredondar(imc);
  if (valor < 18.5) return "Magreza";
  if (valor <= 24.9) return "Normal";
  if (valor <= 30) return "Sobrepeso";
  return "Obesidade";
}

export function avaliar(peso: number, altura: number): ResultadoImc {
  const imc = arredondar(calcularImc(peso, altura));
  const classificacao = classificarImc(imc);
  return { imc, classificacao, descricao: DESCRICOES[classificacao] };
}

function arredondar(valor: number): number {
  return Math.round(valor * 10) / 10;
}

/** Aceita número ou texto com vírgula ou ponto decimal ("1,75"). */
export function lerNumero(entrada: unknown): number | null {
  if (typeof entrada === "number") return Number.isFinite(entrada) ? entrada : null;
  if (typeof entrada !== "string") return null;
  const texto = entrada.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(texto)) return null;
  const n = Number(texto);
  return Number.isFinite(n) ? n : null;
}

export type ErrosValidacao = Partial<Record<"peso" | "altura", string>>;

export function validar(
  pesoBruto: unknown,
  alturaBruta: unknown,
): { ok: true; peso: number; altura: number } | { ok: false; erros: ErrosValidacao } {
  const erros: ErrosValidacao = {};
  const peso = lerNumero(pesoBruto);
  const altura = lerNumero(alturaBruta);

  if (pesoBruto === undefined || pesoBruto === null || pesoBruto === "") {
    erros.peso = "Informe o peso em quilos.";
  } else if (peso === null) {
    erros.peso = "Use apenas números no peso, como 72,5.";
  } else if (peso < LIMITES.peso.min || peso > LIMITES.peso.max) {
    erros.peso = `O peso deve estar entre ${LIMITES.peso.min} e ${LIMITES.peso.max} kg.`;
  }

  if (alturaBruta === undefined || alturaBruta === null || alturaBruta === "") {
    erros.altura = "Informe a altura em metros.";
  } else if (altura === null) {
    erros.altura = "Use apenas números na altura, como 1,75.";
  } else if (altura > 3 && altura <= 260) {
    erros.altura = "Informe a altura em metros, como 1,75 (não em centímetros).";
  } else if (altura < LIMITES.altura.min || altura > LIMITES.altura.max) {
    erros.altura = "A altura deve estar entre 0,50 e 2,60 m.";
  }

  if (Object.keys(erros).length > 0 || peso === null || altura === null) {
    return { ok: false, erros };
  }
  return { ok: true, peso, altura };
}
