const joi = require('joi')

const LoginRequestDTO = joi.object({
    email: joi.string().max(50).required(),
    senha: joi.string().max(30).required()
}).label('LoginRequestDTO')


const LoginResponseSuccessDTO = joi.object({
    token: joi.string(),
    auth: joi.bool()
}).label('LoginResponseSuccessDTO')

//Tentativa de login não autorizada com username ou pass incorreto
const LoginResponseErrorDTO = joi.object({
    message: joi.string().allow('Failed to autentication username or password', 'Failed to autentication'),
    auth: joi.boolean().default(false)
}).label('LoginResponseErrorDTO')

module.exports = {
    LoginRequestDTO,
    LoginResponseSuccessDTO,
    LoginResponseErrorDTO
}