const database = require("../../configs/database");
const Boom = require("@hapi/boom");
const invoiceService = require("../services/fatura.service");
const transacoesCreditoRepository = require("../repositories/transacoesCredito.repository");

const getTransacoesFatura = async (accountId, mesReferencia = "2021-04") => {
  try {
    const getOpenInvoice = await invoiceService.findInvoiceSpecific(
      accountId,
      mesReferencia
    );

    console.log(getOpenInvoice);

    if (!getOpenInvoice) {
      return Boom.notFound("Cliente não possuí fatura em aberto");
    }

    const getTransacoes = await transacoesCreditoRepository.getTransacoesByInvoiceId(
      getOpenInvoice.id
    );

    return {
      mesReferencia: getOpenInvoice.mesReferencia,
      valorFatura: getOpenInvoice.valorConsolidado,
      Transações: getTransacoes,
    };
  } catch (error) {
    console.log(error);
    return Boom.notFound("Erro desconhecido");
  }
};

module.exports = { getTransacoesFatura };
