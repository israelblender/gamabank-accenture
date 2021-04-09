const chai = require('chai');
const assert = chai.assert;
const { validCodBank } = require('../../src/helpers/codBanco');

describe('Validar a função que recebe o código do banco', async () => {
    it('Deve retornar código do banco válido', async () => {
        const codBanco = await validCodBank("104");
        assert.isObject(codBanco, { value: '104', label: 'Caixa Econômica Federal' });
    });

    it('Deve retornar erro se o código do banco for inválido', async () => {
        const codBanco = await validCodBank("12321");
        assert.equal(codBanco, false);
    });
});