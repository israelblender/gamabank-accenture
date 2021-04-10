const payService = require("../services/pay.service");

const payWithDebit = async (request, h) => {

    const { userId } = await request.auth.credentials;
    const { value } = request.payload;

 
    const pay = await payService.payDebit(userId, value);


    return pay
   
}

module.exports = { payWithDebit }