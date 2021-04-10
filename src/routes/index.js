const Joi = require("joi");

const { rootHandler } = require("../api/controllers/app.controller");
const authController = require("../api/controllers/auth.controller");
const userController = require("../api/controllers/user.controller");
const transferController = require("../api/controllers/transfer.controller");
const faturaService = require("../api/services/fatura.service");
const lancamentoController = require("../api/controllers/lancamento.controller")
const payController = require("../api/controllers/pay.controller");
const invoiceController = require("../api/controllers/fatura.controller");
const paymentController = require("../api/controllers/payment.controller");

const {
  LoginRequestDTO,
  LoginResponseSuccessDTO,
  LoginResponseErrorDTO,
} = require("../api/models/dto/auth.dto");

const {
  TransferRequestDTO,
  TransferResponseDTO,
} = require("../api/models/dto/transfer.dto");

const {
  BuyDebitRequestDTO,
  BuyDebitHeaderDTO,
  BuyDebitResponseDTO,
  BuyCreditRequestDTO,
  BuyCreditHeaderDTO,
  BuyCreditResponseDTO,
} = require("../api/models/dto/pay.dto");

const {
  CreateUserDTO,
  CreateUserResponseDTO,
} = require("../api/models/dto/user.dto");

const { 
  ExtratoRequestDTO, 
  ExtratoResponseSuccessDTO, 
  ExtratoResponseErrorDTO 
} = require('../api/models/dto/extrato.dto')

const root = {
  method: "GET",
  path: "/",
  handler: rootHandler,
  options: {
    tags: ["api"],
    description: "Informações da Api",
    notes: "Alguma nota aqui",
  },
};

const login = {
  method: "POST",
  path: "/login",
  handler: authController.login,
  options: {
    tags: ["api", "login"],
    description: "Autenticação de usuário",
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

const transfer = {
  method: "POST",
  path: "/transfer",
  handler: transferController.transfer,
  options: {
    auth: "jwt",
    tags: ["api", "transfer"],
    description: "Realização de transferência entre contas",
    notes:
      "É possível fazer transferência para correntistas do Gamabank ou correntistas de outro banco, para correntistas do mesmo banco basta informar o e-mail e valor, correntistas de outro banco basta informar um CPF válido, código do banco e valor.",
    validate: {
      headers: Joi.object({ authorization: Joi.string().required() }).unknown(),
      payload: TransferRequestDTO,
    },
    response: {
      status: {
        200: Joi.string(),
        400: Joi.any(),
        401: Joi.any(),
        503: Joi.any(),
      },
    },
  },
};

const payment = {
  method: "POST",
  path: "/pay/invoice",
  handler: paymentController.payment,
  options: {
    tags: ["api", "payment"],
    auth: "jwt",
    description: "Rota para pagamento da fatura.",
    notes:
      "Para o pagamento ser concluído com sucesso, o correntista precisa ter o saldo em conta.",
    validate: {
      headers: Joi.object({ authorization: Joi.string().required() }).unknown(),
    },
    response: {
      status: {
        200: Joi.string(),
        401: Joi.any(),
        503: Joi.any(),
      },
    },
  },
};

const payDebit = {
  method: "POST",
  path: "/pay/debit",
  handler: payController.payWithDebit,
  options: {
    tags: ["api", "debito", "pagamento"],
    description: "Pagamento com débito",
    notes: "Obs: CPF é obrigatorio para executar com sucesso",
    validate: {
      // headers: BuyDebitHeaderDTO,
      payload: BuyDebitRequestDTO,
    },
    response: {
      status: {
        200: BuyDebitResponseDTO,
        400: Joi.any(),
        401: Joi.any(),
        503: Joi.any(),
      },
    },
  },
};

const payCredit = {
  method: "POST",
  path: "/pay/credit",
  handler: payController.payWithCredit,
  options: {
    auth: "jwt",
    tags: ["api", "crédito", "pagamento"],
    description: "Pagamento com crédito",
    notes: "Obs: CPF é obrigatorio para executar com sucesso",
    validate: {
      //headers: BuyCreditHeaderDTO,
      payload: BuyCreditRequestDTO,
    },
    response: {
      status: {
        // 200: BuyCreditResponseDTO,
        // 400: Joi.any(),
        // 401: Joi.any(),
        // 503: Joi.any()
      },
    },
  },
};

const getOpenInvoices = {
  method: "GET",
  path: "/invoice",
  handler: invoiceController.openInvoices,
  options: {
    tags: ["api"],
    description: "Verificação de faturas em aberto",
    notes: "...",
  },
};

const extrato = {
  method: 'POST',
  path: '/extrato',
  handler: lancamentoController.extrato,
  options: {
      tags: ['api', 'extrato'],
      auth: 'jwt',
      description: 'Exibir saldo/extrato da conta',
      notes: 'Retorna objeto json contendo lançamentos da conta conforme critérios',
      validate: {
          payload: ExtratoRequestDTO,
      },
      response: {
        status: {
          200: Joi.any(),
          //400: ExtratoResponseErrorDTO,
          500: Joi.any()
        }
      }
  }
};

module.exports = [
  root,
  login,
  createUser,
  transfer,
  payDebit,
  payCredit,
  getOpenInvoices,
  extrato
];
