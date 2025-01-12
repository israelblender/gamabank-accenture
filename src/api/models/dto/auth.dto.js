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

module.exports = {
  LoginRequestDTO,
  LoginResponseSuccessDTO,
};
