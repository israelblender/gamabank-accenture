const invoice = require('../services/payment.service');

const payment = async (request, h) => {
    const {userId, accountId} = request.auth.credentials;
    
    const fatura = await invoice.paymentService(userId, accountId);

    return fatura;
};

module.exports = {
    payment
};