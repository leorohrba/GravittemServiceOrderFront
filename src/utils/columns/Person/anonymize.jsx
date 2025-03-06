import { customSort } from '@utils'
import moment from 'moment'

export const anonymizeColumns = () => [
  {
    title: 'Nome',
    nomeColuna: 'Nome',
    obrigatorio: true,
    sorter: (a, b) => customSort(a.nome, b.nome),
    render: d => (
      <span className="flex">
        <div className="table-icon mr-3">
          <i
            className={`fa fa-${
              d.tipoPessoa === 1 ? 'user' : 'industry'
            } fa-lg fa-fw`}
            aria-hidden="true"
          />
        </div>
        <p className="my-auto">{d.nome}</p>
      </span>
    ),
  },
  {
    title: 'Data do cadastro',
    nomeColuna: 'Data do cadastro',
    obrigatorio: true,
    sorter: (a, b) => customSort(a.dataCadastro, b.dataCadastro),
    render: d => d && moment(d.dataCadastro).format('DD/MM/YYYY'),
  },
  {
    title: 'Situação',
    nomeColuna: 'Situação',
    obrigatorio: true,
    align: 'center',
    sorter: (a, b) => customSort(a.situacao, b.situacao),
    render: d => (
      <i
        className={`fa fa-${
          d.situacao === true ? 'check-circle' : 'exclamation-circle'
        } fa-lg`}
        style={{
          color: `${d.situacao === true ? '#4CAF50' : 'rgb(237, 54, 54)'}`,
        }}
      />
    ),
  },
  {
    title: 'Observação',
    nomeColuna: 'Observação',
    obrigatorio: true,
    width: '40%',
    render: d => (
      <i>
        {d.observacoes.map(d => (
          <p className="mb-0">{d.observacao}</p>
        ))}
      </i>
    ),
  },
]
