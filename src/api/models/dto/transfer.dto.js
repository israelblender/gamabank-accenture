const Joi = require("joi");

const TransferRequestDTO = Joi.object({
    email: Joi.string(),
    valor: Joi.string().required(),
    cpf: Joi.string(),
    codigoBanco: Joi.string()

}).label("TransferRequestDTO");

const TransferResponseDTO = Joi.string().label("TransferResponseDTO");

module.exports = {
    TransferRequestDTO,
    TransferResponseDTO,
}