import { ITechnical } from "./interfaces/TechnicalInterface"
import { IPersonCRM } from "./interfaces/PersonCRMInterface"
import { Moment } from "moment"
import moment from "moment"

export function generateScheduleBody(
    values: any,
    estimatedTime: number,
    selectedService: {value: number, label: string},
    selectedClient: IPersonCRM,
    technicalGuid: string,
    generatedOSId: number,
    serviceOrderClassificationId: number,
    serviceOrderClassificationDescription: string,
    assistants: ITechnical[]
  ) {
    const date = getDateTime(values.date, values.scheduleTime)
    const duration = getDuration(date, estimatedTime)
    return {
        assunto: selectedService?.label,
        dataHora: date.format("YYYY-MM-DD HH:mm:ss"),
        periodoDia: 0,
        duracao: duration.format("YYYY-MM-DD HH:mm:ss"),
        diaInteiro: false,
        status: 1,
        organizacaoId: selectedClient.personGuid,
        razaoSocial: selectedClient.name,
        tipoDocumento: selectedClient?.documentCPF ? 'CPF' : 'CNPJ',
        documento: selectedClient?.documentCPF || selectedClient?.documentCNPJ,
        tipoPessoa: selectedClient.personType,
        observacao: '',
        responsavelId: technicalGuid,
        taskId: 0,
        serviceOrderId: generatedOSId,
        serviceId: selectedService.value,
        descricaoServico: selectedService.label,
        classificacaoOSId: serviceOrderClassificationId,
        descricaoClassificacaoOS: serviceOrderClassificationDescription,
        auxiliares: assistants.map(assistant => assistant.personGuid),
        reagendamentoOS: true,
        tipoAgendamento: 1
      }
  }

export const getValidadeScheduluBody = (value: any,
    estimatedTime: number,
    responsible: string,
    helpers: ITechnical[]) => {
    const date = getDateTime(value.date, value.scheduleTime)
    const duration = getDuration(date, estimatedTime)
    return {
      dataInicial: date.format("YYYY-MM-DD HH:mm:ss"),
      dataFinal: duration.format("YYYY-MM-DD HH:mm:ss"),
      responsavelId: responsible,
      auxiliaresId: helpers.map(helper => helper.personGuid).join('|'),
    }
}

export const getDateTime = (date: Moment, time: Moment) => {
    return moment(moment(date).format("YYYY-MM-DD") + ' ' + moment(time).format("HH:mm:ss"))
}

const getDuration = (date: Moment, duration: number) => {
    const hourValue = Number((duration / 60).toFixed(0))
    const minuteValue = Number((duration % 60).toFixed(0))

    const time = moment().set({
        hour: date.get('hour') + hourValue,
        minute: date.get('minute') + minuteValue,
    })
    return moment(moment(date).format("YYYY-MM-DD") + ' ' + moment(time).format("HH:mm:ss"))
}