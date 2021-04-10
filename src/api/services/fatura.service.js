const faturaRepository = require("../repositories/fatura.repository");

const createFatura = async (idConta) => {
  // verifico se a conta já possui fatura aberta
  const findFatura = await faturaRepository.findOpenedInvoiceByAccountId(
    idConta
  );

  // caso exista retorno a fatura e retorno
  if (findFatura) {
    return findFatura;
  }

  // chamo repositorio para criação da fatura
  const fatura = await faturaRepository.createFatura(idConta);

  // retorno mensagem com id da fatura
  return {
    message: "Credito da conta Criada com sucesso",
    id: fatura.id,
  };
};

const getOpenInvoice = async (accountId) => {
  const findFatura = await faturaRepository.findOpenedInvoiceByAccountId(
    accountId
  );
  // caso exista retorno a fatura e retorno

  return findFatura;
};

//Obtem fatura em aberto se existir
const findInvoiceSpecific = async (accountId, referenceMonth) => {
  //Obtem fatura
  const invoice = await faturaRepository.findInvoiceSpecific(
    accountId,
    referenceMonth
  );

  return invoice;
};

const createInvoiceSpecific = async (accountId, referenceMonth, status) => {
  const invoice = await faturaRepository.createInvoiceSpecific(
    accountId,
    referenceMonth,
    status
  );
  return invoice;
};

const updateInvoiceValueConsolidation = async (
  invoiceId,
  valueConsolidation
) => {
  const invoice = await faturaRepository.updateInvoiceValueConsolidation(
    invoiceId,
    valueConsolidation
  );
  return invoice;
};

module.exports = {
  createFatura,
  getOpenInvoice,
  findInvoiceSpecific,
  createInvoiceSpecific,
  updateInvoiceValueConsolidation,
};
