const invoiceRepository = require("../repositories/invoice.repository");

const getOpenInvoice = async (accountId) => {
  const findFatura = await invoiceRepository.findOpenedInvoiceByAccountId(
    accountId
  );
  // caso exista retorno a fatura e retorno

  return findFatura;
};

//Obtem fatura em aberto se existir
const findInvoiceByReferenceMonth = async (accountId, referenceMonth) => {
  //Obtem fatura
  const invoice = await invoiceRepository.findInvoiceByReferenceMonth(
    accountId,
    referenceMonth
  );

  return invoice;
};

const createInvoice = async (accountId, referenceMonth, status) => {
  const invoice = await invoiceRepository.createInvoice(
    accountId,
    referenceMonth,
    status
  );
  return invoice;
};

const updateInvoiceValue = async (invoiceId, valueConsolidation) => {
  const invoice = await invoiceRepository.updateInvoiceValueConsolidation(
    invoiceId,
    valueConsolidation
  );
  return invoice;
};

module.exports = {
  getOpenInvoice,
  findInvoiceByReferenceMonth,
  createInvoice,
  updateInvoiceValue,
};
