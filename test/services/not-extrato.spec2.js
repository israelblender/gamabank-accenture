const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const assert = chai.assert;
chai.use(chaiAsPromised);
const Boom = require("@hapi/boom");
const faker = require("faker");

const expect = chai.expect;

const database = require("../../src/configs/database");
const userService = require("../../src/api/services/user.service");
const contaService = require("../../src/api/repositories/conta.repository");
const { transferIntern } = require("../../src/api/services/transfer.service");
const { extratoService } = require("../../src/api/services/lancamento.service");

describe("Lancamento Service", async () => {
  before(async () => {
    const newUser = await userService.createUser(
      "Alessandro Oliveira",
      "12312312387",
      "user.sample@gmail.com",
      "Alessandro2!",
      "11963334870"
    );

    const newUser2 = await userService.createUser(
      "Pedro Henrique",
      "06400613897",
      "user2.sample@gmail.com",
      "PHenrique2!",
      "11999995555"
    );

    const deposito = await contaService.updateBalanceAccount(newUser.id, 15000);
    const transfer = await transferIntern(
      newUser.id,
      "user2.sample@gmail.com",
      1500.8
    );
  });

  after(async () => {
    await database.rollback();
  });

  it("Retorna o saldo e o extrato por faixa de datas", async () => {
    const conta = await contaService.findContaByUserEmail(
      "user.sample@gmail.com"
    );
    const extrato = await extratoService(conta.id, "2021-04-01", "2021-04-10");

    expect(extrato).to.haveOwnProperty("lancamentos");
    expect(extrato).to.haveOwnProperty("saldo");
  });

  it("Retorna o Saldo com os lançamentos do dia", async () => {
    const conta = await contaService.findContaByUserEmail(
      "user.sample@gmail.com"
    );
    const saldo = await extratoService(conta.id, null, null);

    expect(saldo).to.haveOwnProperty("lancamentos");
    expect(saldo).to.haveOwnProperty("saldo");
  });
});
