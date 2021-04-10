const invoiceService = require("../services/fatura.service");
const transacoesCreditoService = require("../services/transacoesCredito.service");

const openInvoices = async (request, h) => {
  const { userId } = await request.auth.credentials;
  const { cpf, value } = request.payload;

  invoiceService.findOpenInvoice(userId);
};

const getInvoice = async (request, h) => {
  const { accountId } = await request.auth.credentials;

  let mesReferencia;

  if (request.payload.mesReferencia !== null) {
    mesReferencia = request.payload.mesReferencia;
  }

  const getOpenInvoice = await transacoesCreditoService.getTransacoesFatura(
    accountId,
    mesReferencia
  );

  return getOpenInvoice;
};

module.exports = { openInvoices, getInvoice };
