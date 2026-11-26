import Calculadora from "./Calculadora";

export default function Home() {
  return (
    <main className="pagina">
      <header className="cabecalho">
        <h1>Calculadora de IMC</h1>
        <p className="lead">
          Informe seu peso e sua altura. O servidor calcula o Índice de Massa Corporal pela
          fórmula <span className="formula">peso ÷ altura²</span> e mostra em que faixa você está.
        </p>
      </header>

      <Calculadora />

      <footer className="rodape">
        <p>
          O IMC é uma referência geral e não substitui a avaliação de um profissional de saúde.
        </p>
        <p>
          Trabalho da disciplina Intelligent Web Development, MBA em Engenharia de Software da
          Impacta.
        </p>
      </footer>
    </main>
  );
}
