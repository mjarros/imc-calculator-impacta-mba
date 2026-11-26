"use client";

import { useId, useState, type FormEvent } from "react";

type Classificacao = "Magreza" | "Normal" | "Sobrepeso" | "Obesidade";

interface Resultado {
  imc: number;
  classificacao: Classificacao;
  descricao: string;
}

type Erros = Partial<Record<"peso" | "altura" | "geral", string>>;

const ESCALA = { min: 15, max: 40 };

const FAIXAS: { nome: Classificacao; de: number; ate: number; rotulo: string }[] = [
  { nome: "Magreza", de: 15, ate: 18.5, rotulo: "abaixo de 18,5" },
  { nome: "Normal", de: 18.5, ate: 24.9, rotulo: "18,5 a 24,9" },
  { nome: "Sobrepeso", de: 24.9, ate: 30, rotulo: "24,9 a 30" },
  { nome: "Obesidade", de: 30, ate: 40, rotulo: "acima de 30" },
];

function posicao(valor: number) {
  const v = Math.min(Math.max(valor, ESCALA.min), ESCALA.max);
  return ((v - ESCALA.min) / (ESCALA.max - ESCALA.min)) * 100;
}

const formatar = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function Calculadora() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [erros, setErros] = useState<Erros>({});
  const [carregando, setCarregando] = useState(false);
  const id = useId();

  async function calcular(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setCarregando(true);
    setErros({});
    try {
      const resposta = await fetch("/api/imc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peso, altura }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        setResultado(null);
        setErros({ ...(dados.campos ?? {}), geral: dados.campos ? undefined : dados.erro });
        return;
      }
      setResultado(dados as Resultado);
    } catch {
      setResultado(null);
      setErros({ geral: "Não foi possível falar com o servidor. Verifique a conexão e tente de novo." });
    } finally {
      setCarregando(false);
    }
  }

  const faixaAtiva = resultado?.classificacao;

  return (
    <section className="calculadora" aria-labelledby={`${id}-titulo`}>
      <h2 id={`${id}-titulo`} className="sr-only">
        Calcular IMC
      </h2>

      <form className="formulario" onSubmit={calcular} noValidate>
        <div className="campo">
          <label htmlFor={`${id}-peso`}>Peso</label>
          <div className={`entrada ${erros.peso ? "com-erro" : ""}`}>
            <input
              id={`${id}-peso`}
              name="peso"
              inputMode="decimal"
              autoComplete="off"
              placeholder="72,5"
              value={peso}
              onChange={(e) => {
                setPeso(e.target.value);
                setResultado(null);
              }}
              aria-invalid={Boolean(erros.peso)}
              aria-describedby={erros.peso ? `${id}-peso-erro` : undefined}
            />
            <span className="unidade">kg</span>
          </div>
          {erros.peso && (
            <p id={`${id}-peso-erro`} className="erro">
              {erros.peso}
            </p>
          )}
        </div>

        <div className="campo">
          <label htmlFor={`${id}-altura`}>Altura</label>
          <div className={`entrada ${erros.altura ? "com-erro" : ""}`}>
            <input
              id={`${id}-altura`}
              name="altura"
              inputMode="decimal"
              autoComplete="off"
              placeholder="1,75"
              value={altura}
              onChange={(e) => {
                setAltura(e.target.value);
                setResultado(null);
              }}
              aria-invalid={Boolean(erros.altura)}
              aria-describedby={erros.altura ? `${id}-altura-erro` : undefined}
            />
            <span className="unidade">m</span>
          </div>
          {erros.altura && (
            <p id={`${id}-altura-erro`} className="erro">
              {erros.altura}
            </p>
          )}
        </div>

        <button type="submit" className="botao" disabled={carregando}>
          {carregando ? "Calculando…" : "Calcular IMC"}
        </button>
      </form>

      {erros.geral && (
        <p className="erro erro-geral" role="alert">
          {erros.geral}
        </p>
      )}

      <div className="resultado" aria-live="polite" data-faixa={faixaAtiva ?? "vazio"}>
        {resultado ? (
          <>
            <p className="valor">
              <span className="numero">{formatar(resultado.imc)}</span>
              <span className="kgm2">kg/m²</span>
            </p>
            <div className="veredito">
              <p className="classe">{resultado.classificacao}</p>
              <p className="descricao">{resultado.descricao}</p>
            </div>
          </>
        ) : (
          <p className="vazio">Preencha peso e altura para ver seu IMC na escala abaixo.</p>
        )}
      </div>

      <div className="escala" aria-hidden={!resultado}>
        <div className="trilho">
          {FAIXAS.map((f) => (
            <div
              key={f.nome}
              className={`faixa faixa-${f.nome.toLowerCase()} ${faixaAtiva === f.nome ? "ativa" : ""}`}
              style={{ flexGrow: f.ate - f.de }}
            >
              <span className="faixa-nome">{f.nome}</span>
              <span className="faixa-rotulo">{f.rotulo}</span>
            </div>
          ))}
          <div
            className={`agulha ${resultado ? "visivel" : ""}`}
            style={{ left: `${resultado ? posicao(resultado.imc) : 0}%` }}
          />
        </div>
      </div>
    </section>
  );
}
