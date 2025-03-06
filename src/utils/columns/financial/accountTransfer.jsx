import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import TooltipParagraph from '@components/TooltipParagraph'
import { getLocaleCurrency, getLocaleDateFormat } from '@utils'
import { tableCellRender } from '@utils/components'
import { Badge } from 'antd'
import moment from 'moment'
import { formatNumber } from 'umi-plugin-react/locale'

export const accountTransferColumns = findStatus =>
  Object.freeze([
    {
      title: 'Data',
      nomeColuna: 'Data',
      dataIndex: 'data',
      width: 130,
      sorter: true,
      obrigatorio: true,
      padrao: true,
      type: 'date',
      render: d => d && moment(d).format(getLocaleDateFormat()),
    },
    {
      title: 'Conta de origem',
      nomeColuna: 'Conta de origem',
      dataIndex: 'contaCorrenteOrigemDescricao',
      width: 180,
      sorter: true,
      obrigatorio: true,
      padrao: true,
      render: (text, d) => (
        <div>
          <TooltipParagraph>{text}</TooltipParagraph>
          <div className="ml-auto">
            <SmallTableFieldDescription
              label={`${d.contaCorrenteOrigemAgencia}  -  ${d.contaCorrenteOrigemNumero}`}
              fontStyle="italic"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Conta de destino',
      nomeColuna: 'Conta de destino',
      dataIndex: 'contaCorrenteDestinoDescricao',
      width: 180,
      sorter: true,
      obrigatorio: true,
      padrao: true,
      render: (text, d) => (
        <div>
          <TooltipParagraph>{text}</TooltipParagraph>
          <div className="ml-auto">
            <SmallTableFieldDescription
              label={`${d.contaCorrenteDestinoAgencia} - ${d.contaCorrenteDestinoNumero}`}
              fontStyle="italic"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Valor',
      nomeColuna: 'Valor',
      dataIndex: 'valor',
      sorter: true,
      width: 130,
      obrigatorio: true,
      padrao: true,
      type: 'value',
      render: value => (
        <TooltipParagraph>
          {formatNumber(value, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </TooltipParagraph>
      ),
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      dataIndex: 'statusTransferencia',
      key: 'statusDescricao',
      width: 170,
      obrigatorio: true,
      padrao: true,
      type: 'status',
      render: d => (
        <Badge
          color={findStatus(d)?.color}
          text={tableCellRender(findStatus(d)?.name, 'status')}
        />
      ),
    },
    {
      title: 'Documento',
      nomeColuna: 'Documento',
      dataIndex: 'documento',
      width: 150,
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Justificativa',
      nomeColuna: 'Justificativa',
      dataIndex: 'justificativa',
      width: 200,
      ellipsis: {
        showTitle: false,
      },
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
  ])
