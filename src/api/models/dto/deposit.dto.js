const Joi = require("joi");

const DepositNotHolderRequestDTO = Joi.object({

    cpf: Joi.string().required(),
    value: Joi.string().required(),
    email: Joi.string().required()

}).label("DepositNotHolderResponseDTO");

const DepositHolderRequestDTO = Joi.object({

    value: Joi.string().required(),

}).label("DepositHolderResponseDTO");

const DepositHeaderDTO = Joi.object().keys({

    'Authorization': Joi.string().required()

}).options({ allowUnknown: true })

    
const DepositResponseDTO = Joi.string().label("DepositResponseDTO");


  module.exports = (
      DepositNotHolderRequestDTO,
      DepositHolderRequestDTO,
      DepositResponseDTO,
      DepositHeaderDTO
  )