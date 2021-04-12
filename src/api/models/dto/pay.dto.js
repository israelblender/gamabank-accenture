const Joi = require("joi");

const BuyDebitRequestDTO = Joi.object({
  value: Joi.number().required(),
  description: Joi.string().optional(),
}).label("BuyDebitRequestDTO");

const BuyDebitHeaderDTO = Joi.object()
  .keys({
    token: Joi.string().required(),
  })
  .options({ allowUnknown: true });

const BuyDebitResponseDTO = Joi.object({
  message: Joi.string(),
}).label("BuyDebitResponseDTO");

const BuyCreditRequestDTO = Joi.object({
  value: Joi.number().required(),
  installment: Joi.number().required().default(1),
  description: Joi.string().required(),
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
