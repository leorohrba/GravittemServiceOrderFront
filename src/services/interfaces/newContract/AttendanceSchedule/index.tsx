// api/ProgramacaoAtendimento

import { IServiceLocation } from "../ServiceLocation"

interface IContract {
  numero: string
}

interface IAddressPerson {
  nome: string
}

interface IAddress {
  cidade: string
  uf: string
  cep: string
}


export interface IAttendaceSchedule {
  contrato: IContract
  localAtendimento: IServiceLocation
  dataEmissao: string
  dataProgramacao: string
}
