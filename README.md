# Recibo Livre

Gere recibos de pagamento em PDF a partir de um comprovante ou preenchendo os dados na mão. Tudo roda no navegador: comprovante, documentos e valores não sobem para servidor.

## O que faz

1. Você envia um comprovante em PDF.
2. O app extrai o que for possível (valor, data, pagador e referências).
3. Você confere o preview A4, completa itens e beneficiário.
4. Baixa um PDF com espaço para a assinatura digital do Gov.br.

O formulário manual cobre qualquer pagamento, com um ou mais serviços/produtos. O total é a soma dos itens.

## Stack

Next.js 16, React 19, Tailwind 4, shadcn/ui, Magic UI, pdf.js, SnapDOM e jsPDF.

Um projeto de [Natã Santos](https://nsantos.dev). Código no [GitHub](https://github.com/dollyzn).

## Desenvolvimento

Requer Node.js 20+ e [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000). O gerador fica em `/gerar`.

```bash
pnpm test
pnpm build
```

O worker do pdf.js é copiado para `public/` no `pnpm install`.

## Privacidade

A leitura do comprovante e a montagem do PDF acontecem no cliente. O rascunho do formulário fica no `localStorage` deste navegador.

## Licença

[MIT](./LICENSE)
