const Joi = require("joi");

const InvoiceTransactionRequestDto = Joi.object({
  mesReferencia: Joi.string(),
}).label("CreateUserDTO");

const InvoiceTransactionResponseDto = Joi.object({
  "Mes de referencia": Joi.string().required(),
  "Valor da fatura": Joi.number().required(),
  Transações: Joi.array(),
}).label("CreateUserResponseDTO");

module.exports = {
  InvoiceTransactionRequestDto,
  InvoiceTransactionResponseDto,
};
