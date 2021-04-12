const payService = require("../services/pay.service");

const payWithDebit = async (request, h) => {
  const { userId } = await request.auth.credentials;
  const { value, description } = request.payload;

  const pay = await payService.payWithDebit(userId, description, value);

  return pay;
};

const payWithCredit = async (request, h) => {
  const { accountId } = await request.auth.credentials;
  const { value, installment, description } = request.payload;

  const pay = await payService.payWithCredit(
    accountId,
    description,
    value,
    installment
  );

  return pay;
};

const payInvoice = async (request, h) => {
  const { userId, accountId } = request.auth.credentials;

  const fatura = await payService.payInvoice(userId, accountId);

  return fatura;
};

module.exports = { payWithDebit, payWithCredit, payInvoice };
