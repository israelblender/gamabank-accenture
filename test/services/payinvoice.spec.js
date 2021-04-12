const chai = require("chai");
const assert = chai.assert;

const { createUser } = require("../../src/api/services/user.service");
const database = require("../../src/configs/database");
const {
  updateBalanceAccount,
} = require("../../src/api/repositories/account.repository");

const {
  payInvoice,
  payWithCredit,
} = require("../../src/api/services/pay.service");

describe("Validar o service de pagamento de fatura", async () => {
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

    await payWithCredit(user.idConta, "compra teste", 50, 1);

    // cria um transacao de credito
  });

  after(async () => {
    await database.rollback();
  });

  it("Deve retornar que o cliente não tem saldo para efetuar o pagamento", async () => {
    const payment = await payInvoice(user.id, user.idConta);
    assert.equal(payment, "Error: Saldo insuficiente");
  });

  it("Deve retornar pagamento realizada com sucesso", async () => {
    // atualiza saldo da conta para efetuar pagamento
    await updateBalanceAccount(user.idConta, 50);

    const payment = await payInvoice(user.id, user.idConta);
    assert.isObject(payment, {
      message: "Pagamento efetuado com sucesso",
    });
  });

  it("Deve retornar cliente erro caso o cliente tente pagar a fatura paga", async () => {
    const payment = await payInvoice(user.id, user.idConta);
    assert.equal(
      payment,
      "Error: Fatura em aberto não possui valor para pagamento"
    );
  });
});
