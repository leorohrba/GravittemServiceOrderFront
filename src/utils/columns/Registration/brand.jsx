import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { Badge } from 'antd'

export const brandColumns = (findStatus, handleClick, serverColumns) => [
  {
    title: 'Descrição',
    nomeColuna: 'Descrição',
    sorter: true,
    obrigatorio: false,
    padrao: true,
    render: d => (
      <span>
        <p className="mb-0">{d.descricao}</p>
      </span>
    ),
  },
  {
    title: 'Fornecedor de dados',
    nomeColuna: 'Fornecedor de dados',
    dataIndex: 'fornecedorDadosDescricao',
    sorter: true,
    obrigatorio: false,
    padrao: true,
  },
  {
    title: 'Status',
    nomeColuna: 'Status',
    dataIndex: 'status',
    sorter: true,
    obrigatorio: true,
    padrao: true,
    render: d => (
      <Badge color={findStatus(d)?.color} text={findStatus(d)?.name} />
    ),
  },
]
