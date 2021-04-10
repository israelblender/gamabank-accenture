const chai = require('chai');
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
const { payWithDebit} = require('../../src/api/services/pay.service')
const { updateBalanceAccount } = require('../../src/api/repositories/conta.repository');
const { createUser } = require('../../src/api/services/user.service');
const database = require("../../src/configs/database");

chai.use(chaiAsPromised);

describe('Validar o service de pagamento por debito', async() => {

    before(async () => {
        const user = await createUser("ana carolina", "607.128.880-04", "carolteste@teste.com", "Ana123!", "98925-7759");
        await createUser("carol", "108.789.256-60", "ana.teste@teste.com", "Ana123!", "57925-9959");
        await updateBalanceAccount(user.id, 20000);

    });

    after(async () => {
        await database.rollback();
    });

    describe('Pagamento', async () => {

        it('Deve retornar pagamento realizado com sucesso', async () => {
            const pay = await payWithDebit(2, 15512872001, 80);
            assert.isObject(pay, {message: 'Pagamento realizado com sucesso'});
        });

        it('Deve retornar valor invalido', async () => {
            const transfer = await payWithDebit(32, 15512872001, 60);
            assert.equal(transfer, 'Error: Id inválido, correntista não encontrado');
        });

        it('Deve retornar valor invalido', async () => {
            const transfer = await payWithDebit(2, 15512872001, -1);
            assert.equal(transfer, 'Error: Valor para pagamento inválido');
        });

        it('Deve retornar e-mail invalido', async () => {
            const debit = await payWithDebit(2, 76, 200);
            assert.equal(transfer, 'Error: CPF inválido');
        });

        it('Deve retornar saldo insuficiente', async () => {
            const transfer = await payWithDebit(2, 15512872001, 100000000000000);
            assert.equal(transfer, 'Error: Saldo insuficiente');
        });
    });
});