const lancamentoRepository = require("../repositories/lancamento.repository");
const accountRepository = require("../repositories/account.repository");
const invoiceService = require("../repositories/invoice.repository");
const { validateCpf } = require("../../helpers/cpf.helper");
const Boom = require("@hapi/boom");
const { sendMessage } = require("../../helpers/nodemailer");
const userRepository = require("../repositories/user.repository");
const creditRepository = require("../repositories/credit.repository");
const credityService = require("../services/credit.service");

const {
  calcMonthReference,
  dateCurrent,
} = require("../../helpers/date.helper");

const payWithDebit = async (userId, description, value) => {
  try {
    const findAccount = await accountRepository.findAccountByUserId(userId);
    const valueAdd = parseFloat(value);

    if (!findAccount) {
      return Boom.badRequest("Correntista não encontrado");
    }

    if (valueAdd <= 0) {
      return Boom.unauthorized("Valor para pagamento inválido");
    }

    if (findAccount.saldo < valueAdd) {
      return Boom.unauthorized("Saldo insuficiente");
    }

    await lancamentoRepository.createNewLaunchPay(findAccount.id, valueAdd);

    let restValue = parseFloat(findAccount.saldo) - valueAdd;

    await accountRepository.updateBalanceAccount(findAccount.id, restValue);

    const findEmailByUser = await userRepository.findUserById(userId).email;

    await sendMessage(
      findEmailByUser,
      `Pagamento debitado em conta realizado pelo correntista, R$ ${value}`
    );

    // retorno mensagem c
    return {
      message: "Pagamento realizado com sucesso",
      date: new Date(),
      value,
    };
  } catch (error) {
    console.log(error);
    if (error.responseCode == 554 || error.responseCode == 535) {
      return {
        message: "Pagamento realizado com sucesso",
      };
    }
    return Boom.serverUnavailable("Serviço indisponível");
  }
};

//Pagamento com crédito
const payWithCredit = async (accountId, description, value, installments) => {
  const valuePay = parseFloat(value);

  if (valuePay < 0) {
    return Boom.badRequest("Valor inválido para pagamento");
  }

  const creditUser = await creditRepository.getAvaliableCredit(accountId);

  if (parseFloat(creditUser.limiteDisponivel) < valuePay) {
    return Boom.badRequest("Credito Insuficiente");
  }

  //Se a data atual for maior que a data de fechamento, o mes de referencia será o proximo mes
  let indexMonthReference = 0; // Index inicial do mesReferencia atual
  let indexInstallment = 1; //Index inicial da Parcela

  if (installments > 1) {
    let infoNewInvoice = { status: "Aberta" };
    while (indexInstallment <= installments) {
      await createInstallment(
        accountId,
        indexMonthReference,
        indexInstallment,
        description,
        valuePay / installments,
        infoNewInvoice
      );
      indexMonthReference++;
      indexInstallment++;
    }
  } else {
    const referenceMonth = calcMonthReference(indexMonthReference);
    const invoice = await invoiceService.findInvoiceByReferenceMonth(
      accountId,
      referenceMonth
    );

    await invoiceService.updateInvoiceValueConsolidation(
      invoice.id,
      invoice.valorConsolidado + valuePay
    );

    await creditRepository.addTransaction(
      invoice.id,
      dateCurrent(),
      `${description}`,
      valuePay
    );
  }

  //Calculo credito restante
  let creditLeft = parseFloat(creditUser.limiteDisponivel) - valuePay;

  //Atualiza credito restante no db
  await creditRepository.updateAvaliableCredit(accountId, creditLeft);

  return {
    message: "Compra realizada com sucesso",
    date: new Date(),
    value,
  };
};

//Cria Fatura se não existir e lança despesa referenciada a fatura
const createInstallment = async (
  accountId,
  indexMonthReference,
  indexInstallment,
  description,
  valuePay,
  infoNewInvoice
) => {
  //Calcula o mesReferencia
  const referenceMonth = calcMonthReference(indexMonthReference);
  //Procura fatura especifica e retorna o id
  let invoice = await invoiceService.findInvoiceByReferenceMonth(
    accountId,
    referenceMonth
  );

  //Se fatura não existir, cria fatura e retorna o id
  if (!invoice) {
    invoice = await invoiceService.createInvoice(
      accountId,
      referenceMonth,
      infoNewInvoice.status
    );
  }
  infoNewInvoice.status = "futuro";

  await invoiceService.updateInvoiceValueConsolidation(
    invoice.id,
    invoice.valorConsolidado + valuePay
  );

  //Adiciona despesa referenciando a fatura aberta
  await creditRepository.addTransaction(
    invoice.id,
    dateCurrent(),
    `${indexInstallment}ª Parcela de: ${description}`,
    valuePay
  );
};

const payInvoice = async (userId, accountId) => {
  try {
    const fatura = await invoiceService.findOpenedInvoiceByAccountId(accountId);

    if (fatura.valorConsolidado === fatura.valorPago) {
      return Boom.unauthorized(
        "Fatura em aberto não possui valor para pagamento"
      );
    }

    const account = await accountRepository.findAccountByUserId(userId);

    if (account.saldo < fatura.valorConsolidado) {
      return Boom.unauthorized("Saldo insuficiente");
    }

    await lancamentoRepository.register(
      accountId,
      "FATURA",
      "Pagamento efetuado com sucesso",
      fatura.valorConsolidado
    );

    const valorDebit = account.saldo - fatura.valorConsolidado;

    const valorPago = fatura.valorConsolidado - fatura.valorPago;

    await invoiceService.payInvoice(fatura.id, fatura.valorConsolidado);

    await accountRepository.updateBalanceAccount(accountId, valorDebit);

    await credityService.updateAvaliableLimit(accountId, valorPago);

    const findEmailByUser = await userRepository.findUserById(userId).email;

    await sendMessage(
      findEmailByUser,
      `Pagamento da fatura efetuada R$ ${fatura.valorConsolidado}`
    );

    return {
      message: "Pagamento efetuado com sucesso",
      invoiceValue: valorPago,
    };
  } catch (error) {
    console.log(error);
    return Boom.serverUnavailable("Serviço indisponível");
  }
};

module.exports = {
  payWithDebit,
  payWithCredit,
  payInvoice,
};
