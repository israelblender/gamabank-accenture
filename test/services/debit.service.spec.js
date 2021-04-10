const chai = require('chai');
const { depositAsNotHolder } = require('../../src/api/controllers/deposit.controller');
const { getInformationLogin } = require('../../src/api/repositories/login.repository');
const assert = chai.assert;
const { updateBalanceAsHolder, updateBalanceAsNotHolder } = require('../../src/api/services/deposit.service')


describe('Validar service de debito', async() => {

    before(async () => {
        await createUser("Ana Carolina", "607.128.880-04", "ana1234", "98925-7834");
    });

    describe('Validar o service de deposito', async() => {
        describe('Deposito sendo dono da conta', async () => {
    
            it('Deve retornar deposito realizada com sucesso', async () => {
                const deposit = await updateBalanceAsHolder(2, 09857604576, 60);
                assert.isObject(deposit, {message: 'Depósito realizado com sucesso'});
            });
    
            it('Deve retornar cpf invalido', async () => {
                const deposit = await updateBalanceAsHolder(2, 55, 50);
                assert.equal(deposit, 'Error: CPF inválido');
            });
    
            it('Deve retornar que o valor nao pode ser debitado', async () => {
                const deposit = await updateBalanceAsHolder(2, 09857604576, 0);
                assert.equal(deposit, 'Error: Valor não pode ser depositado');
            });
        });
    
        describe('Deposito nao sendo o dono da conta', async () => {
    
            it('Deve retornar deposito realizada com sucesso', async () => {
                const debit = await updateBalanceAsNotHolder(40783825099, "carolinavasconcelos90@gmail.com", 60 )
                assert.isObject(debit, {message: 'Transferência realizada com sucesso'});
            });
    
            it('Deve retornar EMAIL inválido', async () => {
                const debit = await updateBalanceAsNotHolder(425099, "carogmail.com", 60);
                assert.equal(debit, 'Error: EMAIL inválido');
            });
    
            it('Deve retornar CPF inválido', async () => {
                const debit = await updateBalanceAsNotHolder(425099, "carolina@gmail.com", 60);
                assert.equal(debit, 'Error: CPF inválido');
            });
    
            it('Deve retornar que o valor nao pode ser debitado', async () => {
                const debit = await updateBalanceAsNotHolder(40783825099, "carolinavasconcelos90@gmail.com", -2)
                assert.equal(debit, 'Error: Valor não pode ser depositado');
            });
    
        });

    });

});