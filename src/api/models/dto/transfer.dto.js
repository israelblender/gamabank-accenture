const Joi = require("joi");

const TransferRequestDTO = Joi.object({
  email: Joi.string(),
  value: Joi.number().required(),
  cpf: Joi.string(),
  codigoBanco: Joi.string(),
}).label("TransferRequestDTO");

const TransferResponseDTO = Joi.object({
  message: Joi.string(),
  originAccount: Joi.string(),
  destinyAccount: Joi.string(),
  value: Joi.number(),
}).label("TransferRequestDTO");

module.exports = {
  TransferRequestDTO,
  TransferResponseDTO,
};
