const Joi = require("joi");

const { rootHandler } = require("../api/controllers/app.controller");
const authController = require("../api/controllers/auth.controller");
const userController = require("../api/controllers/user.controller");
const transferController = require("../api/controllers/transfer.controller");
const payController = require("../api/controllers/pay.controller");
const paymentController = require("../api/controllers/payment.controller");
const transacoesCreditoController = require("../api/controllers/transacoesCredito.controller");

const {
  LoginRequestDTO,
  LoginResponseSuccessDTO,
} = require("../api/models/dto/auth.dto");

const { TransferRequestDTO } = require("../api/models/dto/transfer.dto");

const {
  BuyDebitRequestDTO,
  BuyDebitResponseDTO,
  BuyCreditRequestDTO,
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

const getInvoiceTransactions = {
  method: "POST",
  path: "/invoice",
  handler: transacoesCreditoController.findTransactions,
  options: {
    auth: "jwt",
    tags: ["api", "Invoices"],
    description: "Verificação do status da aplicação",
    notes: "Pode ser utilizado sempre que outra aplicação estiver monitorando",
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

module.exports = [
  root,
  login,
  createUser,
  transfer,
  payDebit,
  payCredit,
  getInvoiceTransactions,
];
