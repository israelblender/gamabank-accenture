const chai = require("chai");
const assert = chai.assert;
const database = require("../../src/configs/database");
const { createUser } = require("../../src/api/services/user.service");
const {
  updateBalanceAccount,
} = require("../../src/api/repositories/account.repository");
const {
  transferIntern,
  transferExtern,
} = require("../../src/api/services/transfer.service");

describe("Validar o service de transferencia", async () => {
  let user;
  let user2;
  before(async () => {
    // criar usuario
    user = await createUser(
      "Matheus Santos",
      "23640996844",
      "caroltest@teste.com",
      "Anacarolina123!",
      "11989257759"
    );

    user2 = await createUser(
      "Matheus Santos 2",
      "607.128.880-04",
      "carolteste2@teste.com",
      "Anacarolina1232!",
      "11989257259"
    );

    // atualiza saldo da conta
    await updateBalanceAccount(user.idConta, 2000);
  });

  after(async () => {
    await database.rollback();
  });

  describe("Transferencia interna", async () => {
    it("Deve retornar transferencia realizada com sucesso", async () => {
      const transfer = await transferIntern(
        user.id,
        user.idConta,
        "carolteste2@teste.com",
        50
      );
      assert.isObject(transfer, {
        message: "Transferência realizada com sucesso",
        destinyAccount: "carolteste2@teste.com",
        value: 50,
      });
    });

    it("Deve retornar um erro caso o correntista tente transferir para ele mesmo", async () => {
      const transfer = await transferIntern(
        user.id,
        user.idConta,
        "caroltest@teste.com",
        50
      );
      assert.equal(
        transfer,
        "Error: Correntista não pode fazer uma transferencia para ele mesmo"
      );
    });

    it("Deve retornar e-mail invalido", async () => {
      const transfer = await transferIntern(
        user.id,
        user.idConta,
        "brno_agst@hotmail.com",
        200
      );
      assert.equal(
        transfer,
        "Error: E-mail inválido, correntista não encontrado"
      );
    });

    it("Deve retornar saldo insuficiente", async () => {
      const transfer = await transferIntern(
        user.id,
        user.idConta,
        "carolteste2@teste.com",
        100000000000000
      );
      assert.equal(transfer, "Error: Saldo insuficiente");
    });
  });

  describe("Transferencia externa", async () => {
    it("Transferencia realizada com sucesso", async () => {
      const transfer = await transferExtern(user.id, "104", "73761560036", 200);
      assert.isObject(transfer, {
        message: "Transferência realizada com sucesso",
        value: 200,
      });
    });

    it("Deve retornar CPF inválido", async () => {
      const transfer = await transferExtern(user.id, "104", "7376156006", 200);
      assert.equal(transfer, "Error: CPF inválido");
    });

    it("Deve retornar código do banco inválido", async () => {
      const transfer = await transferExtern(
        user.id,
        "123123",
        "73761560036",
        200
      );
      assert.equal(transfer, "Error: Código do banco inválido");
    });

    it("Deve retornar saldo insuficiente", async () => {
      const transfer = await transferExtern(
        user.id,
        "104",
        "73761560036",
        2000000000
      );
      assert.equal(transfer, "Error: Saldo insuficiente");
    });
  });
});
