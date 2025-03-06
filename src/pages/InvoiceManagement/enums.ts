import { createEnums } from '@utils/generics'

export const defaultStatus = Object.freeze([
    { id: 1, name: 'Ativo', color: 'green' },
    { id: 2, name: 'Inativo', color: 'red' },
])

export const purchaseStatus = Object.freeze([
    { id: 1, name: 'Gerado', color: 'red' },
    { id: 2, name: 'Emitido', color: 'orange' },
    { id: 3, name: 'Depositado', color: 'blue' },
    { id: 4, name: 'Pago', color: 'green' },
    { id: 5, name: 'Cancelado', color: 'red' },
    { id: 6, name: 'Devolvido', color: 'black' },
])

export const dateType = Object.freeze([
    { id: 1, key: 'PeriodoVencimento', name: 'Data de vencimento' },
    { id: 2, key: 'PeriodoEmissao', name: 'Data de emissão' },
    { id: 3, key: 'PeriodoPagamento', name: 'Data de pagamento' },
    { id: 4, key: 'PeriodoDeposito', name: 'Data de depósito' },
])

export const operationTypes = createEnums(
    [
        'Safe2Pay',
        'Bradesco',
        'Sicoob',
        'Banco do Brasil',
        'CEF',
        'Santander S.A',
        'Itaú',
        'Safra',
        'Sicredi',
    ],
    'name',
)

export const ambient = Object.freeze([
    { id: 1, name: 'Homologação' },
    { id: 2, name: 'Produção' },
])
