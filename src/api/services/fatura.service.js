const invoiceRepository = require("../repositories/fatura.repository");

const createFatura = async (idConta) => {
  // verifico se a conta já possui fatura aberta
  const findFatura = await faturaRepository.findFaturaAbertaByIdConta(idConta);

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

//Obtem fatura em aberto se existir
const findInvoiceSpecific = async (accountId, referenceMonth) => {
  //Obtem fatura
  const invoice = await invoiceRepository.findInvoiceSpecific(
    accountId,
    referenceMonth
  );

  return invoice;
};

const createInvoiceSpecific = async (accountId, referenceMonth, status) => {
  const invoice = await invoiceRepository.createInvoiceSpecific(
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
  const invoice = await invoiceRepository.updateInvoiceValueConsolidation(
    invoiceId,
    valueConsolidation
  );
  return invoice;
};

module.exports = {
  createFatura,
  findInvoiceSpecific,
  createInvoiceSpecific,
  updateInvoiceValueConsolidation,
};
