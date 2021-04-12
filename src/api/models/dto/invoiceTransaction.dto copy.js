const Joi = require("joi");

const InvoiceTransactionRequestDto = Joi.object({
  mesReferencia: Joi.string(),
}).label("CreateUserDTO");

const InvoiceTransactionResponseDto = Joi.object({
  mesReferencia: Joi.string().required(),
  valorFatura: Joi.number().required(),
  valorPago: Joi.number().required(),
  transacoes: Joi.array(),
}).label("CreateUserResponseDTO");

module.exports = {
  InvoiceTransactionRequestDto,
  InvoiceTransactionResponseDto,
};
