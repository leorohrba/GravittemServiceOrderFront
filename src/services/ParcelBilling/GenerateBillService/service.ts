// import { apiFinancial } from '@services/api'

// export async function bankTransaction(
//   row,
//   errorInconsistence,
//   nextOk,
//   counter,
// ) {
//   const { perfilTransacaoBancariaId } = row?.cobranca
//   const serviceName = 'Perfil Trasação Banncária'
//   const unableToFind = 'Não encontrado Perfil da Nota'
//   try {
//     const response = await apiFinancial({
//       method: 'GET',
//       url: `api/PerfilTransacaoBancaria/${perfilTransacaoBancariaId}`,
//     })
//     const { data } = response
//     const { configuracaoGeralTransacaoId, contaCorrenteId } = data

//     generalConfiguration(
//       configuracaoGeralTransacaoId,
//       contaCorrenteId,
//       errorInconsistence,
//       row,
//       nextOk,
//       counter,
//     )
//   } catch (error) {
//     const serviceErrorMessage =
//       error?.response?.status === 400
//         ? `${serviceName}: ${unableToFind}`
//         : `${serviceName}: ${connectionError}`
//     errorInconsistence(serviceErrorMessage)
//   }
// }
