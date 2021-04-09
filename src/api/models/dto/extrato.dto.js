const joi = require('joi')

const ExtratoRequestDTO = joi.object({
    conta: joi.number().required(),
    data_inicial: joi.string().max(10).required().default(new Date()),
    data_final: joi.string().max(10).required().default(new Date())
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