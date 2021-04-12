const chai = require("chai");
const database = require("../../src/configs/database");
const { createUser } = require("../../src/api/services/user.service");
const assert = chai.assert;
const chaiAsPromised = require("chai-as-promised");
const {
  updateBalanceAsHolder,
  updateBalanceAsNotHolder,
} = require("../../src/api/services/deposit.service");

chai.use(chaiAsPromised);

describe("Validar service de deposito", async () => {
  let user;
  before(async () => {
    user = await createUser(
      "Ana Carolina",
      "607.128.880-04",
      "carol-teste@teste.com",
      "Ana12346#",
      "11989257834"
    );
  });

  after(async () => {
    await database.rollback();
  });

  describe("Validar o service de deposito", async () => {
    describe("Deposito sendo dono da conta", async () => {
      it("Deve retornar deposito realizada com sucesso", async () => {
        const deposit = await updateBalanceAsHolder(user.idConta, 60);
        assert.isObject(deposit, {
          message: "Depósito realizado com sucesso",
          value: 60,
        });
      });

      it("Deve retornar que o valor nao pode ser debitado", async () => {
        const deposit = await updateBalanceAsHolder(user.idConta, -455);
        assert.equal(deposit, "Error: Valor não pode ser depositado");
      });
    });

    describe("Deposito nao sendo o dono da conta", async () => {
      it("Deve retornar deposito realizada com sucesso", async () => {
        const debit = await updateBalanceAsNotHolder(
          "40783825099",
          "carol-teste@teste.com",
          60
        );
        assert.isObject(debit, {
          message: "Transferência realizada com sucesso",
        });
      });

      it("Deve retornar EMAIL inválido caso o deposito seja enviado para uma conta inexistente", async () => {
        const debit = await updateBalanceAsNotHolder(
          "40783825099",
          "carogmail.com",
          60
        );
        assert.equal(debit, "Error: EMAIL inválido");
      });

      it("Deve retornar CPF inválido caso o cpf informado seja invalido", async () => {
        const debit = await updateBalanceAsNotHolder(
          "425099",
          "carol-teste@teste.com",
          60
        );

        assert.equal(debit, "Error: CPF inválido");
      });

      it("Deve retornar que o valor nao pode ser depositado caso o valor seja negativo", async () => {
        const debit = await updateBalanceAsNotHolder(
          "40783825099",
          "carol-teste@teste.com",
          -2
        );
        assert.equal(debit, "Error: Valor não pode ser depositado");
      });
    });
  });
});
