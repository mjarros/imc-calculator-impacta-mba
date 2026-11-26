# Calculadora de IMC

Aplicação web em Next.js que calcula o Índice de Massa Corporal (IMC) no backend, por uma rota de API.
Trabalho da disciplina Intelligent Web Development, MBA em Engenharia de Software da Impacta.

**Fórmula:** `IMC = peso / altura²` (peso em kg, altura em metros)

| Classificação | Faixa de IMC (kg/m²)        |
| ------------- | --------------------------- |
| Magreza       | menor que 18,5              |
| Normal        | de 18,5 até 24,9            |
| Sobrepeso     | maior que 24,9 e até 30     |
| Obesidade     | maior que 30                |

O IMC é arredondado para uma casa decimal, e a classificação usa esse mesmo valor exibido na tela.

## Como rodar localmente

Requer Node.js 20.9 ou mais recente.

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # testes da lógica de cálculo e validação
npm run build    # build de produção
```

## API

`POST /api/imc`

```bash
curl -X POST http://localhost:3000/api/imc \
  -H "Content-Type: application/json" \
  -d '{"peso": 72.5, "altura": 1.75}'
```

Resposta `200`:

```json
{ "imc": 23.7, "classificacao": "Normal", "descricao": "IMC entre 18,5 e 24,9 kg/m²." }
```

Valores também podem ser enviados como texto com vírgula (`"72,5"`, `"1,75"`).
Para testar pelo navegador há um atalho em `GET /api/imc?peso=72.5&altura=1.75`.

Entradas inválidas retornam `400` com a mensagem de cada campo:

```json
{ "erro": "Revise os dados informados.", "campos": { "altura": "Informe a altura em metros, como 1,75 (não em centímetros)." } }
```

Limites aceitos: peso de 1 a 500 kg, altura de 0,50 a 2,60 m.

## Estrutura

```
app/
  api/imc/route.ts   rota da API (backend) que valida e calcula
  Calculadora.tsx    formulário e resultado (cliente)
  page.tsx           página inicial
  globals.css        estilos
lib/imc.ts           fórmula, classificação e validação
tests/imc.test.ts    testes (Vitest)
```

## Publicar na Vercel

O projeto não precisa de configuração extra nem de variáveis de ambiente.

1. Acesse [vercel.com/new](https://vercel.com/new) e entre com sua conta do GitHub.
2. Importe o repositório `imc-calculator-impacta-mba`.
3. A Vercel detecta o Next.js automaticamente. Clique em **Deploy**.

Cada push na branch `main` publica uma nova versão em produção, e cada pull request gera uma URL de pré-visualização.

Pela linha de comando, como alternativa:

```bash
npm i -g vercel
vercel          # pré-visualização
vercel --prod   # produção
```
