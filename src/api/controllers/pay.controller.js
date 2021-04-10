const payService = require("../services/pay.service");

const payWithDebit = async (request, h) => {
  const { userId } = await request.auth.credentials;
  const { value } = request.payload;

  const pay = await payService.payWithDebit(userId, value);

  return pay;
};

const payWithCredit = async (request, h) => {
  const { userId } = await request.auth.credentials;
  const { value, installment } = request.payload;

  const pay = await payService.payWithCredit(
    userId,
    "Pizza Família Big Bom Preço",
    value,
    installment
  );

  return pay;
};

module.exports = { payWithDebit, payWithCredit };
