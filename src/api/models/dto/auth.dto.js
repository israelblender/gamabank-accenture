const joi = require("joi");

const LoginRequestDTO = joi
  .object({
    email: joi.string().required(),
    senha: joi.string().required(),
  })
  .label("LoginRequestDTO");

const LoginResponseSuccessDTO = joi
  .object({
    message: "Login efetuado com sucesso",
    token: joi.string(),
  })
  .label("LoginResponseSuccessDTO");

//Tentativa de login não autorizada com username ou pass incorreto

module.exports = {
  LoginRequestDTO,
  LoginResponseSuccessDTO,
};
