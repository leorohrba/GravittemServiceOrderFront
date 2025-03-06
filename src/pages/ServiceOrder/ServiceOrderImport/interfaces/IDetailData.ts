export interface IDetailData {
    logDetalheId:     string;
    tipoLog:          number;
    tipoLogDescricao: string;
    dataInicial:      string;
    mensagem:         string;
    tempo:            string;
    nrDocumento:      number | null;
    entidadeId:       string | null;
}