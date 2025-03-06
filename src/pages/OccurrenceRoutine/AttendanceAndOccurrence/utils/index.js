import moment from 'moment'
import { minuteToHourMinute } from '@utils'

export const messages = {
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  allDay: 'Dia inteiro',
  week: 'Semanal',
  work_week: 'Dias úteis',
  day: 'Diário',
  month: 'Mensal',
  previous: 'Voltar',
  next: 'Próximo',
  yesterday: 'Ontem',
  tomorrow: 'Amanhã',
  today: 'Hoje',
  agenda: 'Agenda',

  noEventsInRange: 'Não há eventos nesse intervalo',

  showMore: total => `mostrar +${total}`,
}

export const navigate = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE',
}

export function prepareAttendanceDataExport(data) {

    const source = [
      {
        columns: [
          'Número',
          'Solicitante',
          'CPF/CNPJ',
          'Telefone',
          'E-mail',
          'Classificação de atendimento',
          'Categoria de atendimento',
          'Descrição',
          'Local de atendimento',
          'Responsável atendimento',
          'Data de agendamento',
          'Horário',
          'Duração',
          'Prioridade',
          'Status',
          'Motivo',
          'Canal de atendimento',
          'Providencia',
          'Data inclusão',
          'Usuário inclusão',
          'Data alteração',
          'Usuário alteração',
        ],
        data: [],
      },
    ]

    data.map(d =>
      source[0].data.push([
        d.numero,
        d.nomeSolicitante,
        d.cpfCnpjFormatado,
        d.telefone,
        d.email,
        d.descricaoClassificacaoAtendimento,
        d.descricaoCategoriaAtendimento,
        d.descricao,
        d.localAtendimento,
        d.nomeResponsavelAtendimento,
        d.dataAgendamento
          ? moment(d.dataAgendamento).format(
              d.horarioAgendamento ? 'DD/MM/YYYY HH:mm' : 'DD/MM/YYYY',
            )
          : '',
        d.horarioAgendamento
          ? moment(d.horarioAgendamento).format('HH:mm')
          : '',
        d.duracao ? minuteToHourMinute(d.duracao) : '',
        d.descricaoPrioridade,
        d.descricaoStatus,
        d.descricaoMotivo,
        d.descricaoCanalAtendimento,
        d.providencia,
        d.dataInclusao
          ? moment(d.dataInclusao).format('DD/MM/YYYY HH:mm:ss')
          : '',
        d.nomeUsuarioInclusao,
        d.dataAlteracao
          ? moment(d.dataAlteracao).format('DD/MM/YYYY HH:mm:ss')
          : '',
        d.nomeUsuarioAlteracao,
      ]),
    )
    
   return source
}