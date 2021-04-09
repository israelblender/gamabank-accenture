const chai = require('chai');
const assert = chai.assert;
const { transferIntern, transferExtern } = require('../../src/api/services/transfer.service')

describe('Validar o service de transferencia', async() => {
    describe('Transferencia interna', async () => {

        it('Deve retornar transferencia realizada com sucesso', async () => {
            const transfer = await transferIntern(2, 'bruno_agst@hotmail.com', 50);
            assert.equal(transfer, 'Transferência realizada com sucesso');
        });

        it('Deve retornar transferencia invalida', async () => {
            const transfer = await transferIntern(1, 'bruno_agst@hotmail.com', 50);
            assert.equal(transfer, 'Error: Transferência inválida');
        });

        it('Deve retornar e-mail invalido', async () => {
            const transfer = await transferIntern(2, 'brno_agst@hotmail.com', 200);
            assert.equal(transfer, 'Error: E-mail inválido, correntista não encontrado');
        });

        it('Deve retornar saldo insuficiente', async () => {
            const transfer = await transferIntern(2, 'bruno_agst@hotmail.com', 100000000000000);
            assert.equal(transfer, 'Error: Saldo insuficiente');
        });
    });

    describe('Transferencia externa', async () => {

        it('Transferencia realizada com sucesso', async () => {
            const transfer = await transferExtern(1, "104", "73761560036", 200);
            assert.equal(transfer, 'Transferência realizada com sucesso');
        });

        it('Deve retornar CPF inválido', async () => {
            const transfer = await transferExtern(1, "104", "7376156006", 200);
            assert.equal(transfer, 'Error: CPF inválido');
        });

        it('Deve retornar código do banco inválido', async () => {
            const transfer = await transferExtern(1, "123123", "73761560036", 200);
            assert.equal(transfer, 'Error: Código do banco inválido');
        });

        
        it('Deve retornar saldo insuficiente', async () => {
            const transfer = await transferExtern(1, "104", "73761560036", 2000000000);
            assert.equal(transfer, 'Error: Saldo insuficiente');
        });

    });
});