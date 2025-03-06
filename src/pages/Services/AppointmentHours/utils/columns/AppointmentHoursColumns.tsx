import moment from "moment"

export const appointmentHoursColumns = [
    {
        title: 'Data apontamento horas',
        dataIndex: 'dataApontamento',
        width: 200,
        render: (d: string) => moment(d).isValid() ? moment(d).format("DD/MM/YYYY") : ""
    },
    {
        title: 'Número da OS',
        dataIndex: 'numeroOs',
        width: 140,
        render: (d: number) => d
    },
    {
        title: 'Cliente',
        dataIndex: 'cliente',
        width: 100,
        render: (d: string) => d
    },
    {
        title: 'Colaborador',
        dataIndex: 'colaborador',
        width: 100,
        render: (d: string) => d
    },
    {
        title: 'Hora inicial do apontamento',
        dataIndex: 'horaInicio',
        width: 220,
        render: (d: string) => d
    },
    {
        title: 'Hora final do apontamento',
        dataIndex: 'horaFinal',
        width: 200,
        render: (d: string) => d
    },
    {
        title: 'Intervalo',
        dataIndex: 'horaIntervalo',
        width: 100,
        render: (d: string) => d
    },
    {
        title: 'Total de horas apontadas',
        dataIndex: 'horasTrabalhadas',
        width: 200,
        render: (d: string) => d
    },
    {
        title: 'Hora de deslocamento',
        dataIndex: 'horasDeslocamento',
        width: 200,
        render: (d: string) => d
    },
    {
        title: 'Descrição da atividade',
        dataIndex: 'atividade',
        width: 200,
        render: (d: string) => d
    },
    {
        title: 'Item de serviço',
        dataIndex: 'servico',
        width: 200,
        render: (d: string) => d
    },
    {
        title: 'Status da ordem de serviço',
        dataIndex: 'statusOs',
        width: 200,
        render: (d: string) => d
    },
    {
        title: 'Status do item de serviço',
        dataIndex: 'statusServico',
        width: 200,
        render: (d: string) => d
    },
    {
        title: 'Data de criação da ordem de serviço',
        dataIndex: 'dataCriacaoOs',
        width: 200,
        render: (d: string) => moment(d).isValid() ? moment(d).format("DD/MM/YYYY") : ""
    },
    {
        title: 'Data de liquidação da ordem serviço',
        dataIndex: 'dataLiquidacaoOs',
        width: 200,
        render: (d: string) => moment(d).isValid() ? moment(d).format("DD/MM/YYYY") : ""
    },
    {
        title: 'Data de liquidação do item de serviço',
        dataIndex: 'dataLiquidacaoServico',
        width: 200,
        render: (d: string) => moment(d).isValid() ? moment(d).format("DD/MM/YYYY") : ""
    }
]