const Joi = require("joi");

const DepositNotHolderRequestDTO = Joi.object({
  cpf: Joi.string().required(),
  value: Joi.number().required(),
  email: Joi.string().required(),
}).label("DepositNotHolderResponseDTO");

const DepositHolderRequestDTO = Joi.object({
  value: Joi.number().required(),
}).label("DepositHolderResponseDTO");

const DepositHeaderDTO = Joi.object()
  .keys({
    Authorization: Joi.string().required(),
  })
  .options({ allowUnknown: true });

const DepositResponseDTO = Joi.object({
  message: Joi.string(),
  value: Joi.number(),
  date: Joi.date(),
}).label("DepositResponseDTO");

module.exports = {
  DepositNotHolderRequestDTO,
  DepositHolderRequestDTO,
  DepositResponseDTO,
  DepositHeaderDTO,
};
