const Joi = require("joi");

const BuyDebitRequestDTO = Joi.object({
  cpf: Joi.string().required(),
  value: Joi.string().required(),
}).label("BuyDebitRequestDTO");

const BuyDebitHeaderDTO = Joi.object()
  .keys({
    Authorization: Joi.string().required(),
  })
  .options({ allowUnknown: true });

const BuyDebitResponseDTO = Joi.object({
  message: Joi.string(),
}).label("BuyDebitResponseDTO");

const BuyCreditRequestDTO = Joi.object({
  value: Joi.string().required(),
  installment: Joi.number().required(),
}).label("BuyCreditRequestDTO");

const BuyCreditHeaderDTO = Joi.object()
  .keys({
    Authorization: Joi.string().required(),
  })
  .options({ allowUnknown: true });

const BuyCreditResponseDTO = Joi.object({
  message: Joi.string(),
}).label("BuyCreditResponseDTO");

module.exports = {
  BuyDebitRequestDTO,
  BuyDebitHeaderDTO,
  BuyDebitResponseDTO,
  BuyCreditRequestDTO,
  BuyCreditHeaderDTO,
  BuyCreditResponseDTO,
};
