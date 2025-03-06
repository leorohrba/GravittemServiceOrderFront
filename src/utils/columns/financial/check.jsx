import { hasLogo } from '@assets/fonts/banks/logos'
import TooltipParagraph from '@components/TooltipParagraph'
import { getLocaleCurrency } from '@utils'
import { tableCellRender, tableTitleRender } from '@utils/components'
import { Badge } from 'antd'
import moment from 'moment'
import { formatNumber } from 'umi-plugin-react/locale'

export const checkColumns = (findType, findStatus) =>
  Object.freeze([
    {
      title: 'Cheque',
      nomeColuna: 'Cheque',
      dataIndex: 'numero',
      sorter: true,
      width: 130,
      obrigatorio: true,
      padrao: true,
      render: (text, d) => (
        <div className="flex items-center">
          <i
            className={`ibb-${
              hasLogo(d.codigoBanco) ? d.codigoBanco : 'default'
            } fa-3x`}
          />
          <p className="ml-3 mb-0">{tableCellRender(d.numero, 'number')}</p>
        </div>
      ),
    },
    {
      title: 'Agência',
      nomeColuna: 'Agência',
      dataIndex: 'agencia',
      width: 80,
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Conta',
      nomeColuna: 'Conta',
      dataIndex: 'conta',
      width: 80,
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Proprietário',
      nomeColuna: 'Proprietário',
      dataIndex: 'nomeProprietario',
      sorter: true,
      width: 230,
      obrigatorio: true,
      padrao: true,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Documento',
      nomeColuna: 'Documento',
      dataIndex: 'documentoUnico',
      width: 150,
      obrigatorio: false,
      padrao: false,
      render: d => <TooltipParagraph>{d}</TooltipParagraph>,
    },
    {
      title: 'Tipo',
      nomeColuna: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipoDescricao',
      sorter: true,
      width: 100,
      obrigatorio: true,
      padrao: true,
      type: 'enum',
      render: d => <div>{findType(d)?.name}</div>,
    },
    {
      title: tableTitleRender('Data de emissão'),
      nomeColuna: 'Data de emissão',
      dataIndex: 'dataEmissao',
      sorter: true,
      showSorterTooltip: false,
      width: 140,
      obrigatorio: true,
      padrao: true,
      type: 'date',
      render: (text, d) => moment(d.dataEmissao).format('DD/MM/YYYY'),
    },
    {
      title: 'Bom para',
      nomeColuna: 'Bom para',
      dataIndex: 'dataBomPara',
      sorter: true,
      width: 120,
      obrigatorio: false,
      padrao: true,
      type: 'date',
      render: (text, d) => moment(d.dataBomPara).format('DD/MM/YYYY'),
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
      render: d => (
        <TooltipParagraph>
          {formatNumber(d, {
            style: 'currency',
            currency: getLocaleCurrency(),
          })}
        </TooltipParagraph>
      ),
    },
    {
      title: 'Status',
      nomeColuna: 'Status',
      dataIndex: 'status',
      key: 'statusDescricao',
      width: 110,
      obrigatorio: true,
      padrao: true,
      type: 'status',
      render: (text, d) => (
        <Badge
          color={findStatus(d.status, d.tipo)?.color}
          text={findStatus(d.status, d.tipo)?.name}
        />
      ),
    },
  ])
