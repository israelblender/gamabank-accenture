const Joi = require("joi");

const {
  rootHandler,
  statusHandler,
} = require("../api/controllers/app.controller");
const authController = require("../api/controllers/auth.controller");
const userController = require("../api/controllers/user.controller");
const transferController = require("../api/controllers/transfer.controller");
const faturaService = require("../api/services/fatura.service");
const payController = require("../api/controllers/pay.controller");

const {
  LoginRequestDTO,
  LoginResponseSuccessDTO,
  LoginResponseErrorDTO,
} = require("../api/models/dto/auth.dto");

const {
  BuyDebitRequestDTO,
  BuyDebitHeaderDTO,
  BuyDebitResponseDTO
} = require("../api/models/dto/pay.dto");

const {
  TransferRequestDTO,
  TransferResponseDTO,
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
        200: LoginResponseSuccessDTO,
        400: Joi.any(),
        401: Joi.any(),
        503: Joi.any(),
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
    description: "Rota criar usuario/conta",
    notes: "Rota principal da nossa aplicação para criação do usuario e conta",
    validate: {
      payload: CreateUserDTO,
    },
    response: {
      status: {
        200: CreateUserResponseDTO,
        400: Joi.any(),
        401: Joi.any(),
        503: Joi.any(),
      },
    },
  },
};

const getOpenInvoices = {
  method: "GET",
  path: "/invoice",
  handler: faturaService.getOpenInvoice,
  options: {
    tags: ["api", "Invoices"],
    description: "Verificação do status da aplicação",
    notes: "Pode ser utilizado sempre que outra aplicação estiver monitorando",
  },
};

const Transfer = {
  method: "POST",
  path: "/transfer",
  handler: transferController.transfer,
  options: {
    auth: "jwt",
    tags: ["api", "transfer"],
    description: "Rota para realizar transferência",
    notes:
      "É possível fazer transferência para correntistas do Gamabank ou correntistas de outro banco, para correntistas do mesmo banco basta informar o e-mail e valor, correntistas de outro banco basta informar um CPF válido, código do banco e valor.",
    validate: {
      headers: Joi.object({ authorization: Joi.string().required() }).unknown(),
      payload: TransferRequestDTO,
    },
    response: {
      status: {
        200: TransferResponseDTO,
        400: Joi.any(),
        401: Joi.any(),
        503: Joi.any(),
      },
    },
  },
};

const payDebit = {
  method: "POST",
  path: "/pay/deposit",
  handler: payController.payWithDebit,
  options: {
    auth: "jwt",
    tags: ["api", "debito", "pagamento"],
    description: "Rota para realizar pagamento com débito",
    notes: "Obs: CPF é obrigatorio para executar com sucesso",
    validate: {
      headers: BuyDebitHeaderDTO,
      payload: BuyDebitRequestDTO
    },
    response: {
      status: {
        200: BuyDebitResponseDTO,
        400: Joi.any(),
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
  Transfer,
  getOpenInvoices,
  payDebit

];
