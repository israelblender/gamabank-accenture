const authController = require("../api/controllers/auth.controller");
const depositController = require("../api/controllers/deposit.controller");
const { rootHandler } = require("../api/controllers/app.controller");
const Joi = require("joi");
const userController = require("../api/controllers/user.controller");
const transferController = require("../api/controllers/transfer.controller");
const lancamentoController = require("../api/controllers/lancamento.controller");
const payController = require("../api/controllers/pay.controller");
const invoiceController = require("../api/controllers/invoice.controller");

const {
  LoginRequestDTO,
  LoginResponseSuccessDTO,
} = require("../api/models/dto/auth.dto");

const TransferDto = require("../api/models/dto/transfer.dto");

const {
  DepositNotHolderRequestDTO,
  DepositHolderRequestDTO,
  DepositResponseDTO,
  DepositHeaderDTO,
} = require("../api/models/dto/deposit.dto");

const {
  BuyDebitHeaderDTO,
  BuyDebitRequestDTO,
  BuyDebitResponseDTO,
  BuyCreditRequestDTO,
} = require("../api/models/dto/pay.dto");

const {
  CreateUserDTO,
  CreateUserResponseDTO,
} = require("../api/models/dto/user.dto");

const {
  InvoiceTransactionRequestDto,
  InvoiceTransactionResponseDto,
} = require("../api/models/dto/invoiceTransaction.dto copy");
const {
  ExtratoRequestDTO,
  ExtratoResponseSuccessDTO,
  ExtratoResponseErrorDTO,
} = require("../api/models/dto/extrato.dto");

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

const createUser = {
  method: "POST",
  path: "/createaccount",
  handler: userController.store,
  options: {
    tags: ["api", "Criação da Conta"],
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

const login = {
  method: "POST",
  path: "/login",
  handler: authController.login,
  options: {
    tags: ["api", "Login"],
    description: "Autenticação de usuário",
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
  method: "POST",
  path: "/deposit/holder",
  handler: depositController.depositAsHolder,
  options: {
    auth: "jwt",
    tags: ["api", "Depósito"],
    description: "Rota para o dono da conta realizar depósito em sua conta",
    notes: "Obs: So a pessoa dono da conta pode depositar",
    validate: {
      headers: Joi.object({ authorization: Joi.string().required() }).unknown(), //DepositHeaderDTO,
      payload: DepositHolderRequestDTO,
    },
    response: {
      status: {
        200: DepositResponseDTO,
        404: Joi.any(),
        401: Joi.any(),
        503: Joi.any(),
      },
    },
  },
};

const makeDepositAsNotHolder = {
  method: "POST",
  path: "/deposit",
  handler: depositController.depositAsNotHolder,
  options: {
    tags: ["api", "depósito"],
    description: "Rota para qualquer pessoa realizar depósito em conta debito",
    notes:
      "Obs: Qualquer pessoa com o email do dono da conta pode depositar, obrigatorio se identifcar (informar CPF)",
    validate: {
      payload: DepositNotHolderRequestDTO,
    },
    response: {
      status: {
        200: DepositResponseDTO,
        404: Joi.any(),
        401: Joi.any(),
        503: Joi.any(),
      },
    },
  },
};

const extract = {
  method: "POST",
  path: "/extract",
  handler: lancamentoController.extrato,
  options: {
    tags: ["api", "extrato"],
    auth: "jwt",
    description: "Exibir saldo/extrato da conta",
    notes:
      "Caso não for informado um range data, será retornado as transações de hoje e o período máximo para consulta é de 3 meses",
    validate: {
      headers: Joi.object({ authorization: Joi.string().required() }).unknown(),
      payload: ExtratoRequestDTO,
    },
    response: {
      status: {
        200: Joi.any(),
        //400: ExtratoResponseErrorDTO,
        500: Joi.any(),
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
      "É possível fazer transferência para correntistas do Gamabank ou correntistas de outro banco, para correntistas do Gamabank basta informar o e-mail e valor, correntistas de outro banco basta informar um CPF válido, código do banco e valor.",
    validate: {
      headers: Joi.object({ authorization: Joi.string().required() }).unknown(),
      payload: TransferDto.TransferRequestDTO,
    },
    response: {
      status: {
        200: TransferDto.TransferResponseDTO,
        400: Joi.any(),
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
    tags: ["api", "Débito", "pagamento"],
    description: "Lançamentos de Despesas de Débito",
    notes: "Informar valor e descrição (opcional)",
    validate: {
      headers: Joi.object({ authorization: Joi.string().required() }).unknown(),
      payload: BuyDebitRequestDTO,
    },
    response: {
      status: {
        200: Joi.any(),
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
      headers: Joi.object({ authorization: Joi.string().required() }).unknown(),
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

const payment = {
  method: "POST",
  path: "/invoice/pay",
  handler: payController.payInvoice,
  options: {
    tags: ["api", "Invoice"],
    auth: "jwt",
    description: "Rota para pagamento da fatura.",
    notes:
      "Para o pagamento ser concluído com sucesso, o correntista precisa ter o saldo em conta.",
    validate: {
      headers: Joi.object({ authorization: Joi.string().required() }).unknown(),
    },
    response: {
      status: {
        200: Joi.any(),
        401: Joi.any(),
        503: Joi.any(),
      },
    },
  },
};

const invoices = {
  method: "POST",
  path: "/invoice",
  handler: invoiceController.getInvoices,
  options: {
    auth: "jwt",
    tags: ["api", "Invoices"],
    description: "Rota Buscar faturas por mes de referencia",
    notes:
      "Rota para buscar transações do mes referente, caso não informar o mes de referencia, será retornado a fatura em aberto do mes atual",
    validate: {
      payload: InvoiceTransactionRequestDto,
      headers: Joi.object({ authorization: Joi.string().required() }).unknown(),
    },
    response: {
      status: {
        200: InvoiceTransactionResponseDto,
        400: Joi.any(),
        401: Joi.any(),
        503: Joi.any(),
      },
    },
  },
};

module.exports = [
  root,
  login,
  createUser,
  extract,
  payDebit,
  makeDepositAsHolder,
  makeDepositAsNotHolder,
  transfer,
  payCredit,
  invoices,
  payment,
];
