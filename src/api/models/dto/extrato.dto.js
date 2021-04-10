const joi = require('joi')

const ExtratoRequestDTO = joi.object({
    data_inicial: joi.string().max(10),
    data_final: joi.string().max(10)
}).label('ExtratoRequestDTO')

const ExtratoResponseSuccessDTO = joi.object({
    data_ocorrencia: joi.date(),
    descricao_ocorrencia: joi.string(),
    tipo_ocorrencia: joi.string(),
    valor_ocorrencia: joi.number()
}).label('ExtratoResponseSuccessDTO')

const ExtratoResponseErrorDTO = joi.object({
    message: joi.string().allow('Falha na consulta', 'Informe as datas no formato AAAA-mm-dd'),
}).label('ExtratoResponseErrorDTO')


module.exports = {
    ExtratoRequestDTO,
    ExtratoResponseSuccessDTO,
    ExtratoResponseErrorDTO
}