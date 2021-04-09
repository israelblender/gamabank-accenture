const Joi = require("joi");

const {
  rootHandler,
} = require("../api/controllers/app.controller");
const authController = require("../api/controllers/auth.controller");
const userController = require("../api/controllers/user.controller");
const transferController = require("../api/controllers/transfer.controller");
const paymentController = require("../api/controllers/payment.controller");

const {
  LoginRequestDTO,
  LoginResponseSuccessDTO,
  LoginResponseErrorDTO
} = require("../api/models/dto/auth.dto");

const {
  TransferRequestDTO,
  TransferResponseDTO
} = require("../api/models/dto/transfer.dto");

const {
  CreateUserDTO,
  CreateUserResponseDTO,
} = require("../api/models/dto/user.dto");

const root = {
  method: "GET",
  path: "/",
  handler: rootHandler,
  options: {
    tags: ["api"],
    description: "Rota principal da aplicação",
    notes: "Alguma nota aqui",
  },
};

const login = {
  method: "POST",
  path: "/login",
  handler: authController.login,
  options: {
    tags: ["api", "login"],
    description: "Rota de autenticação",
    notes: "Anotações da rota...",
    validate: {
      payload: LoginRequestDTO,
    },
    response: {
      status: {
        //200: LoginResponseSuccessDTO,
        //401: LoginResponseErrorDTO,
        400: Joi.any(),
      },
    },
  },
};

const createUser = {
  method: "POST",
  path: "/user",
  handler: userController.store,
  options: {
    tags: ["api", "usuario"],
    description: "Rota criar usuario",
    validate: {
      payload: CreateUserDTO,
    },
    response: {
      status: {
        200: CreateUserResponseDTO,
        400: Joi.any(),
      },
    },
  },
};

const transfer = {
  method: "POST",
  path: "/transfer",
  handler: transferController.transfer,
  options: {
    auth: "jwt",
    tags: ["api", "transfer"],
    description: "Rota para realizar transferência",
    notes: "É possível fazer transferência para correntistas do Gamabank ou correntistas de outro banco, para correntistas do mesmo banco basta informar o e-mail e valor, correntistas de outro banco basta informar um CPF válido, código do banco e valor.",
    validate: {
      headers: Joi.object({'authorization': Joi.string().required()}).unknown(),    
      payload: TransferRequestDTO
    },
    response: {
      status: {
        200: TransferResponseDTO,
        400: Joi.any(),
        401: Joi.any(),
        503: Joi.any()
      }
    }
  }
};

const payment = {
  method: "POST",
  path: "/payment",
  handler: paymentController.payment,
  options: {
    tags: ["api", "payment"],
    description: "Rota para pagamento da fatura",
    validate: {
      //headers: Joi.object({'authorization': Joi.string().required()}).unknown(),
    },
    response: {
      status: {
        200: Joi.any(),
        401: Joi.any(),
        503: Joi.any()
      }
    }
  }
};

module.exports = [
  root,
  login,
  createUser,
  transfer,
  payment
];
