export const d = new Date()
export const signatureSection = {
  margin: [0, 20, 0, 0],
  // pageBreak: 'before',
  lineHeight: 1.5,
  text: [
    `Joinville, ${d.getDate()} de ${d.toLocaleString('pt-BR', {
      month: 'long',
    })} de ${d.getFullYear()}\n\n`,
    'De acordo\n\n',
    {
      text: '_____________________________________\n',
    },
    {
      text: 'CLIENTE:\n',
      bold: true,
    },
    'Nome:\n',
    'CPF:\n\n\n',
    {
      text: '_____________________________________\n',
    },
    {
      text: 'FRANQUEADO(A) CONTRATADO(A):\n',
      bold: true,
    },
    'Nome:\n',
    'CPF:\n\n\n',
    {
      text: '_____________________________________\n',
    },
    {
      text: 'ATENDE PORTARIA:\n',
      bold: true,
    },
    'Nome:\n',
    'CPF:',
  ],
}
