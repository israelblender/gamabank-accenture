const Joi = require('joi')

const AppController = require('../controllers/app.controller')
const AuthController = require('../controllers/auth.controller')

const { LoginRequestDTO, LoginResponseSuccessDTO, LoginResponseErrorUnauthorizedDTO } = require('../models/dto/auth.dto')
const { ExtratoRequestDTO, ExtratoResponseSuccessDTO, ExtratoResponseErrorDTO } = require('../models/dto/extrato.dto')

const rootRoute = {
  method: "GET",
  path: "/",
  handler: AppController.rootHandler,
  options: {
    tags: ["api"],
    description: "Rota Principal",
    notes: "Pode ser utilizado sempre que outra aplicação estiver monitorando",
  },
};
const statusRoute = {
  method: "GET",
  path: "/status",
  handler: AppController.statusHandler,
  options: {
    tags: ["api"],
    description: "Verificação do status da aplicação",
    notes: "Pode ser utilizado sempre que outra aplicação estiver monitorando",
  },
};
const loginRoute = {
    method: 'POST',
    path: '/login',
    handler: AuthController.login,
    options: {
        tags: ['api', 'login'],
        description: 'Realizar Login',
        notes: 'Retornado atributo AUTH e atributo TOKEN para utilizar nas próximas consultas internas',
        validate: {
            payload: LoginRequestDTO,
        },
        response: {
          status: {
            //200: LoginResponseSuccessDTO,
            //401: LoginResponseErrorUnauthorizedDTO,
            500: Joi.any()
          }
        }
    }
}

const extratoRoute = {
  method: 'POST',
  path: '/extrato',
  handler: contaController,
  options: {
      tags: ['api', 'extrato'],
      description: 'Exibir saldo/extrato da conta',
      notes: 'Retorna objeto json contendo lançamentos da conta conforme critérios',
      validate: {
          payload: ExtratoRequestDTO,
      },
      response: {
        status: {
          200: ExtratoResponseSuccessDTO,
          400: ExtratoResponseErrorDTO,
          500: Joi.any()
        }
      }
  }
}

module.exports = [ rootRoute, statusRoute, loginRoute, extratoRoute ]