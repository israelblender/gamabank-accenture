const launchRepository = require("../repositories/launch.repository");
const accountRepository = require("../repositories/conta.repository");
const creditRepository = require("../repositories/credito.repository");
const userRepository = require("../repositories/user.repository");

const invoiceService = require("../services/fatura.service");

const { validateCpf } = require("../../helpers/cpf.helper");
const {
  calcMonthReference,
  dateCurrent,
} = require("../../helpers/date.helper");

const Boom = require("@hapi/boom");

//Pagamento com Debito
const payWithDebit = async (userId, value) => {
  const user = await userRepository.findUserById(userId);
  if (!validateCpf(user.cpf)) {
    return Boom.badRequest("Cpf inválido");
  }

  const findAccount = await accountRepository.findContaByUserId(userId);
  const valuePay = parseFloat(value);

  if (findAccount === undefined) {
    return Boom.badRequest("Id inválido, correntista não encontrado");
  }

  if (valuePay < 0) {
    return Boom.conflict("Valor inválido para pagamento");
  }

  if (parseFloat(findAccount.saldo) < valuePay) {
    return Boom.conflit("Saldo insuficiente");
  }

  await launchRepository.createNewLaunchPay(user.cpf, value);

  let restValue = parseFloat(findAccount.saldo) - valuePay;

  await accountRepository.updateBalanceAccount(userId, restValue);

  return {
    message: "Pagamento realizado com sucesso",
  };
};

//Pagamento com crédito
const payWithCredit = async (userId, description, value, installments = 1) => {
  const findAccount = await accountRepository.findContaByUserId(userId);
  const valuePay = parseFloat(value);

  if (findAccount === undefined) {
    return Boom.badRequest("Id inválido, correntista não encontrado");
  }
  if (valuePay < 0) {
    return Boom.badRequest("Valor inválido para pagamento");
  }

  const creditUser = await creditRepository.getAvaliableCredit(findAccount.id);

  if (parseFloat(creditUser.limiteDisponivel) < valuePay) {
    return Boom.badRequest("Credito Insuficiente");
  }

  //Se a data atual for maior que a data de fechamento, o mes de referencia será o proximo mes
  let indexMonthReference = 0; // Index inicial do mesReferencia atual
  let indexInstallment = 1; //Index inicial da Parcela

  //Se dia atual for maior que data de fechamento
  // if (indexMonthReference == 0) {
  //   indexMonthReference = 1; //Index inicial do mesReferencia seguinte
  // }
  let infoNewInvoice = { status: "Aberta" };
  while (indexInstallment <= installments) {
    await createInstallment(
      findAccount.id,
      indexMonthReference,
      indexInstallment,
      description,
      valuePay / installments,
      infoNewInvoice
    );
    indexMonthReference++;
    indexInstallment++;
  }

  //Calculo credito restante
  let creditLeft = parseFloat(creditUser.limiteDisponivel) - valuePay;

  //Atualiza credito restante no db
  await creditRepository.updateAvaliableCredit(findAccount.id, creditLeft);

  return { message: "Pagamento realizado com sucesso" };
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
  let invoice = await invoiceService.findInvoiceSpecific(
    accountId,
    referenceMonth
  );

  //Se fatura não existir, cria fatura e retorna o id
  if (!invoice) {
    invoice = await invoiceService.createInvoiceSpecific(
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

module.exports = {
  payWithDebit,
  payWithCredit,
};
