const Joi = require("joi");

const TransferRequestDTO = Joi.object({
    email: Joi.string(),
    valor: Joi.string().required(),
    cpf: Joi.string(),
    codigoBanco: Joi.string()

}).label("TransferRequestDTO");


module.exports = {
    TransferRequestDTO,
}