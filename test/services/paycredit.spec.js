const chai = require("chai");
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
const { payWithCredit } = require("../../src/api/services/pay.service");
const {
  updateBalanceAccount,
} = require("../../src/api/repositories/account.repository");
const { createUser } = require("../../src/api/services/user.service");
const database = require("../../src/configs/database");

chai.use(chaiAsPromised);

describe("Validar o service de pagamento por credito", async () => {
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

    // // atualiza saldo da conta
    // await updateBalanceAccount(user.idConta, 20000);
  });

  after(async () => {
    await database.rollback();
  });

  it("Deve ser possivel efetuar uma compra com credito", async () => {
    const pay = await payWithCredit(user.idConta, "Compra de CD", 80, 1);
    assert.isObject(pay, {
      message: "Pagamento realizado com sucesso",
      value: 80,
    });
  });

  it("Não deve ser possivel efetuar uma compra de valor negativo", async () => {
    const transfer = await payWithCredit(user.idConta, "Compra de CD", -80, 1);
    assert.equal(transfer, "Error: Valor inválido");
  });

  it("Não deve ser possivel efetuar uma compra com valor maior que o limite", async () => {
    const transfer = await payWithCredit(user.idConta, "Compra de CD", 800, 1);
    assert.equal(transfer, "Error: Credito Insuficiente");
  });
});
