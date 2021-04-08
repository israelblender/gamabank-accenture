const joi = require('joi')

const LoginRequestDTO = joi.object({
    username: joi.string().max(50).required(),
    password: joi.string().max(30).required()
}).label('LoginRequestDTO')


const LoginResponseSuccessDTO = joi.object({
    token: joi.string(),
    auth: joi.bool()
}).label('LoginResponseSuccessDTO')

//Tentativa de login não autorizada com username ou pass incorreto
//Utilização de token inválido ou vencido
const LoginResponseErrorUnauthorizedDTO = joi.object({
    message: joi.string().allow('Failed to autentication username or password', 'Failed to autentication'),
    auth: joi.boolean().default(false)
}).label('LoginResponseErrorDTO')

const LoginResponseErrorBadDTO = joi.object({
    message: joi.string().default('Invalid request'),
    auth: joi.boolean().default(false)
}).label('LoginResponseErrorDTO')


module.exports = {
    LoginRequestDTO,
    LoginResponseSuccessDTO,
    LoginResponseErrorUnauthorizedDTO,
    LoginResponseErrorBadDTO
}