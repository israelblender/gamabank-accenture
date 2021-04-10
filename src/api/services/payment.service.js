const { findOpenedInvoiceByAccountId, paymentFatura } = require('../repositories/fatura.repository');
const { register } = require('../repositories/lancamento.repository');
const { findContaByUserId, updateBalanceAccount } = require('../repositories/conta.repository');
const { sendMessage } = require('../../helpers/nodemailer');
const Boom = require('@hapi/boom');

const paymentService = async (id, accountId) => {

    try {
        const fatura = await findOpenedInvoiceByAccountId(accountId);

        if(fatura.valorConsolidado === fatura.valorPago){
            return Boom.unauthorized('Cliente não possuí fatura em aberto');
        }
    
        const user = await findContaByUserId(id);
    
        if(user.saldo < fatura.valorConsolidado){
            return Boom.unauthorized('Saldo insuficiente');
        }
    
        await register(accountId, 'FATURA', 'Pagamento efetuado com sucesso', fatura.valorConsolidado);
    
        const valorDebit = user.saldo - fatura.valorConsolidado;
    
        await updateBalanceAccount(id, valorDebit);
    
        await paymentFatura(accountId, fatura.valorConsolidado);
    
        await sendMessage(user.email, `Pagamento da fatura efetuada R$ ${fatura.valorConsolidado}`);

        return 'Pagamento efetuado com sucesso';

    } catch (error) {
        console.log(error);
        if(error.responseCode == 554 || error.responseCode == 535){
            return 'Pagamento efetuado com sucesso';
        }
        return Boom.serverUnavailable('Serviço indisponível');
    };
};

module.exports = {
    paymentService
};