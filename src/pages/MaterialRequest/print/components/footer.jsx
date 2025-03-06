export const footer = (logo) => {
  return {  
    margin: [30, 0, 0, 0],
    columns: [
      {
        image: logo,
        width: 90,
        absolutePosition: {
          x: 30,
          y: -5,
        },
      },
      {
        text: 'A mais ampla solução colaborativa de serviços',
        color: 'grey',
        fontSize: 10,
      },
      {
        text: 'www.gravittem.com | (47) 3437-3312',
        color: 'grey',
        fontSize: 10,
      },
    ],
    columnGap: 10,
  }
}
