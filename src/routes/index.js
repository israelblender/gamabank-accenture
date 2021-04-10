const authController = require('../api/controllers/auth.controller')
const depositController = require('../api/controllers/deposit.controller')
const { rootHandler, statusHandler } = require("../api/controllers/app.controller");
const Joi = require("joi");
const userController = require("../api/controllers/user.controller");
const transferController = require("../api/controllers/transfer.controller");
const faturaService = require("../api/services/fatura.service");
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
    DepositNotHolderRequestDTO,
    DepositHolderRequestDTO,
    DepositResponseDTO,
    DepositHeaderDTO
} = require("../api/models/dto/deposit.dto");

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

const makeDepositAsHolder = {
    method: 'POST',
    path: '/deposit/holder',
    handler: depositController.depositAsHolder,
    options: {
      auth: "jwt",
      tags: ['api', 'depósito'],
      description: 'Rota para o dono da conta realizar depósito em conta debito',
      notes: "Obs: So a pessoa dono da conta pode depositar",
      validate: {
        headers: DepositHeaderDTO,
        payload: DepositHolderRequestDTO

      },
      response: {
        status: {
          200: DepositResponseDTO,
          404: Joi.any(),
          401: Joi.any(),
          503: Joi.any(),

        }
      },
    },
  };

  const makeDepositAsNotHolder = {
    method: 'POST',
    path: '/deposit',
    handler: depositController.depositAsNotHolder,
    options: {
      tags: ['api', 'depósito'],
      description: 'Rota para qualquer pessoa realizar depósito em conta debito',
      notes: "Obs: Qualquer pessoa com o email do dono da conta pode depositar",
      validate: {
        
        payload: DepositNotHolderRequestDTO

      },
      response: {
        status: {
          200: DepositResponseDTO,
          404: Joi.any(),
          401: Joi.any(),
          503: Joi.any()

        }
      },
    },
  };
  
const getOpenInvoices = {
  method: "GET",
  path: "/invoice",
  handler: invoiceController.openInvoices,
  options: {
    tags: ["api", "batata"],
    description: "Verificação do status da aplicação",
    notes: "Pode ser utilizado sempre que outra aplicação estiver monitorando",
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
    auth: "jwt",
    tags: ["api", "debito", "pagamento"],
    description: "Pagamento com débito",
    notes: "Obs: So precisa do valor para executar com sucesso",
    validate: {
      headers: BuyDebitHeaderDTO,
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

module.exports = [
  root,
  login,
  createUser,
  getOpenInvoices,
  payDebit,
  makeDepositAsHolder,
  makeDepositAsNotHolder,
  transfer,
  payCredit
];
