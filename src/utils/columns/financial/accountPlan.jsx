import TooltipParagraph from '@components/TooltipParagraph'
import { Badge } from 'antd'

export const accountPlanManagerialColumns = (findPlan, findStatus) =>
  Object.freeze([
    {
      title: 'Descrição',
      nomeColuna: 'Descrição',
      dataIndex: 'descricao',
      width: 180,
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: true,
      padrao: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Tipo',
      nomeColuna: 'Tipo',
      dataIndex: 'tipo',
      width: 100,
      obrigatorio: true,
      padrao: true,
      render: d => (
        <div
          style={{
            color: findPlan(d)?.color,
          }}
        >
          {findPlan(d)?.name}
        </div>
      ),
    },
    {
      title: 'Código reduzido',
      nomeColuna: 'Código reduzido',
      dataIndex: 'codigo',
      sorter: true,
      width: 140,
      showSorterTooltip: false,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: false,
      padrao: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      dataIndex: 'status',
      width: 130,
      obrigatorio: true,
      padrao: true,
      render: d => (
        <Badge color={findStatus(d)?.color} text={findStatus(d)?.name} />
      ),
    },
    {
      title: 'Chave',
      nomeColuna: 'Chave',
      dataIndex: 'chave',
      width: 130,
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Conta contábil',
      nomeColuna: 'Conta contábil',
      dataIndex: 'contaContabil',
      width: 180,
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Categoria',
      nomeColuna: 'Categoria',
      dataIndex: 'categoria',
      width: 180,
      obrigatorio: false,
      padrao: false,
    },
    {
      title: 'Conta superior',
      nomeColuna: 'Conta superior',
      dataIndex: 'contaSuperior',
      width: 180,
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Permite lançamentos',
      nomeColuna: 'Permite lançamentos',
      dataIndex: 'permiteLancamento',
      align: 'center',
      width: 180,
      obrigatorio: false,
      padrao: false,
      render: d => (
        <i
          className="fa fa-check-circle fa-lg"
          style={{
            color: d ? '#2d73d0' : 'gray',
          }}
        />
      ),
    },
    {
      title: 'Relativo a funcionários',
      nomeColuna: 'Relativo a funcionários',
      dataIndex: 'relativoFuncionario',
      align: 'center',
      width: 180,
      obrigatorio: false,
      padrao: false,
      render: d => (
        <i
          className="fa fa-check-circle fa-lg"
          style={{
            color: d ? '#2d73d0' : 'gray',
          }}
        />
      ),
    },
  ])

export const accountPlanAccountingColumns = (findPlan, findStatus) =>
  Object.freeze([
    {
      title: 'Chave',
      nomeColuna: 'Chave',
      dataIndex: 'chave',
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: true,
      padrao: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Conta contábil',
      nomeColuna: 'Conta contábil',
      dataIndex: 'contaContabil',
      sorter: true,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: true,
      padrao: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Tipo',
      nomeColuna: 'Tipo',
      dataIndex: 'tipo',
      obrigatorio: true,
      padrao: true,
      render: d => (
        <div
          style={{
            color: findPlan(d)?.color,
          }}
        >
          {findPlan(d)?.name}
        </div>
      ),
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      dataIndex: 'status',
      obrigatorio: true,
      padrao: true,
      render: d => (
        <Badge color={findStatus(d)?.color} text={findStatus(d)?.name} />
      ),
    },
    {
      title: 'Conta superior',
      nomeColuna: 'Conta superior',
      dataIndex: 'contaSuperior',
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Permite lançamentos',
      nomeColuna: 'Permite lançamentos',
      dataIndex: 'permiteLancamento',
      obrigatorio: false,
      padrao: false,
      render: d => (
        <i
          className="fa fa-check fa-lg"
          style={{
            color: d ? '#2d73d0' : 'gray',
          }}
        />
      ),
    },
    {
      title: 'Relativo a funcionários',
      nomeColuna: 'Relativo a funcionários',
      dataIndex: 'relativoFuncionario',
      obrigatorio: false,
      padrao: false,
      render: d => (
        <i
          className="fa fa-check fa-lg"
          style={{
            color: d ? '#2d73d0' : 'gray',
          }}
        />
      ),
    },
  ])

export const accountPlanCategoryColumns = () =>
  Object.freeze([
    {
      title: 'Categoria',
      nomeColuna: 'Categoria',
      dataIndex: 'tag',
      obrigatorio: true,
      padrao: true,
    },
  ])
