const invoiceService = require("../services/fatura.service");

const getOpenedInvoice = async (request, h) => {
  // const { dt_start, dt_end } = request.payload;

  const { userId, accountId } = await request.auth.credentials;

  const getOpenInvoice = await invoiceService.getOpenInvoice(accountId);

  return getOpenInvoice;
};

module.exports = { getOpenedInvoice };
