const database = require("../../configs/database");
const invoiceService = require("../services/fatura.service");
const transacoesCreditoRepository = require("../repositories/transacoesCredito.repository");

const getTransacoesFatura = async (accountId, mesReferencia = "2021-04") => {
  const getOpenInvoice = await invoiceService.findInvoiceSpecific(
    accountId,
    mesReferencia
  );

  const getTransacoes = await transacoesCreditoRepository.getTransacoesByInvoiceId(
    getOpenInvoice.id
  );

  return {
    "Mes Referencia": getOpenInvoice.mesReferencia,
    "Valor Atual da fatura": getOpenInvoice.valorConsolidado,
    transacoes: getTransacoes,
  };
};

module.exports = { getTransacoesFatura };
