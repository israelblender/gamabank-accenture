const AppController = require('../controllers/app.controller')
const AuthController = require('../controllers/login.controller')

const { LoginRequestDTO, LoginResponseSuccessDTO, LoginResponseErrorUnauthorizedDTO } = require('../models/dto/auth.dto')
const Joi = require('joi')


const rootRoute = {

  method: "GET",
  path: "/",
  handler: AppController.rootHandler,
  options: {
      tags: ['api'],
      description: 'Rota Principal',
      notes: 'Pode ser utilizado sempre que outra aplicação estiver monitorando'
  }
};
const statusRoute = {
  method: "GET",
  path: "/status",
  handler: AppController.statusHandler,
  options: {
      tags: ['api'],
      description: 'Verificação do status da aplicação',
      notes: 'Pode ser utilizado sempre que outra aplicação estiver monitorando'
  }
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
            200: LoginResponseSuccessDTO,
            400: Joi.any(),
            401: LoginResponseErrorUnauthorizedDTO
          }
        }
    }
}

// const validate = {
//   method: 'GET',
//   path: '/login/verify',
//   handler: AuthController.validate,
//   options: {
//     tags: ["api", "login"],
//     description: 'Rota para verificaçào do token',
//     notes: 'blablabla blablabla',
//     validate: {
//         headers: Joi.object({'x-access-token': Joi.string().required()}).unknown()
//     },
//   }
// }


module.exports = [ rootRoute, statusRoute, loginRoute ]