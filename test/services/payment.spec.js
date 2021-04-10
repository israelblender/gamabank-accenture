const chai = require('chai');
const assert = chai.assert;
const { paymentService } = require('../../src/api/services/payment.service');

describe('Validar o service de pagamento de fatura', async() => {

    it('Deve retornar pagamento realizada com sucesso', async () => {
        const payment = await paymentService(1);
        assert.equal(payment, 'Pagamento efetuado com sucesso');
    });

    it('Deve retornar cliente não possuí fatura em aberto', async () => {
        const payment = await paymentService(1);
        assert.equal(payment, 'Error: Cliente não possuí fatura em aberto');
    });

  
    it('Deve retornar que o cliente não tem saldo para efetuar o pagamento', async () => {
        const payment = await paymentService(2);
        assert.equal(payment, 'Error: Saldo insuficiente');
    }); 
});