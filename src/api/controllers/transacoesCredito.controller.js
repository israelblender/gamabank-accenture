const transacoesCreditoService = require("../services/transacoesCredito.service");

const findTransactions = async (request, h) => {
  const { accountId } = await request.auth.credentials;

  let mesReferencia;

  if (request.payload) {
    mesReferencia = request.payload.mesReferencia;
  }

  const getOpenInvoice = await transacoesCreditoService.getTransacoesFatura(
    accountId,
    mesReferencia
  );

  return getOpenInvoice;
};

module.exports = { findTransactions };
