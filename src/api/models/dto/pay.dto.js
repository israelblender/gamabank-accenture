const Joi = require("joi");

const BuyDebitRequestDTO = Joi.object({

    value: Joi.string().required(),

}).label("BuyDebitRequestDTO");

const BuyDebitHeaderDTO = Joi.object().keys({

    'token': Joi.string().required()
    
}).options({ allowUnknown: true })


const BuyDebitResponseDTO = Joi.object({
    message: Joi.string()
}).label("BuyDebitResponseDTO");


  module.exports = (
    BuyDebitRequestDTO,
    BuyDebitHeaderDTO,
    BuyDebitResponseDTO
  )
