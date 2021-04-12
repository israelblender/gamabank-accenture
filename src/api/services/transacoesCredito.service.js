const Boom = require("@hapi/boom");
const invoiceService = require("../services/invoice.service");
const transacoesCreditoRepository = require("../repositories/transacoesCredito.repository");

const getTransacoesFatura = async (accountId, mesReferencia = "2021-04") => {
  try {
    const getInvoice = await invoiceService.findInvoiceByReferenceMonth(
      accountId,
      mesReferencia
    );

    if (!getInvoice) {
      return Boom.notFound("Cliente não possuí fatura em aberto");
    }

    const getTransacoes = await transacoesCreditoRepository.getTransacoesByInvoiceId(
      getInvoice.id
    );

    return {
      mesReferencia: getInvoice.mesReferencia,
      valorFatura: getInvoice.valorConsolidado,
      valorPago: getInvoice.valorPago,
      transacoes: getTransacoes,
    };
  } catch (error) {
    console.log(error);
    return Boom.serverUnavailable("Serviço indisponível");
  }
};

module.exports = { getTransacoesFatura };
