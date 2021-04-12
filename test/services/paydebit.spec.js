const chai = require("chai");
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
const { payWithDebit } = require("../../src/api/services/pay.service");
const {
  updateBalanceAccount,
} = require("../../src/api/repositories/account.repository");
const { createUser } = require("../../src/api/services/user.service");
const database = require("../../src/configs/database");

chai.use(chaiAsPromised);

describe("Validar o service de pagamento por debito", async () => {
  let user;
  before(async () => {
    // criar usuario
    user = await createUser(
      "ana carolina",
      "607.128.880-04",
      "carolteste@teste.com",
      "Anacarolina123!",
      "11989257759"
    );

    // atualiza saldo da conta
    await updateBalanceAccount(user.idConta, 20000);
  });

  after(async () => {
    await database.rollback();
  });

  it("Deve retornar pagamento realizado com sucesso", async () => {
    const pay = await payWithDebit(user.idConta, "Pagamento com CD", 80);
    assert.isObject(pay, {
      message: "Pagamento realizado com sucesso",
      value: 80,
    });
  });

  it("Deve retornar um erro ao passa um id de conta invalida", async () => {
    const transfer = await payWithDebit(112574, "Pagamento com CD", 60);
    assert.equal(transfer, "Error: Correntista não encontrado");
  });

  it("Deve retornar valor invalido caso o valor do pagamento seja negativo", async () => {
    const transfer = await payWithDebit(user.idConta, "Pagamento com CD", -200);
    assert.equal(transfer, "Error: Valor para pagamento inválido");
  });

  it("Deve retornar saldo insuficiente", async () => {
    const transfer = await payWithDebit(
      user.idConta,
      "Pagamento com CD",
      100000000000000
    );
    assert.equal(transfer, "Error: Saldo insuficiente");
  });
});
