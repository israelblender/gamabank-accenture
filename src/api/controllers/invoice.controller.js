const transacoesCreditoService = require("../services/transacoesCredito.service");

const getInvoices = async (request, h) => {
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

module.exports = { getInvoices };
