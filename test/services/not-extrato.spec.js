const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const assert = chai.assert;
chai.use(chaiAsPromised);

const expect = chai.expect;

const database = require("../../src/configs/database");
const userService = require("../../src/api/services/user.service");
const accountRepository = require("../../src/api/repositories/account.repository");
const depositService = require("../../src/api/services/deposit.service");
const { getExtract } = require("../../src/api/services/lancamento.service");

describe("Validar Serviço de extrato", async () => {
  let user;
  before(async () => {
    user = await userService.createUser(
      "Alessandro Oliveira",
      "12312312387",
      "user.sample@gmail.com",
      "Alessandro2!",
      "11963334870"
    );

    await depositService.updateBalanceAsHolder(user.idConta, 15000);
  });

  after(async () => {
    await database.rollback();
  });

  it("Retorna o saldo e o extrato por faixa de datas", async () => {
    const extrato = await getExtract(user.idConta, "2021-04-01", "2021-04-12");

    expect(extrato);
  });

  it("Mensagem de erro: data inicial > data final", async () => {
    const extrato = await getExtract(user.idConta, new Date(), "2021-03-01");

    assert.equal(
      extrato,
      "Error: Data inicial não pode ser maior que a data final"
    );
  });

  it("Mensagem de erro: Data excede limite para extrato", async () => {
    const extrato = await getExtract(user.idConta, "2021-01-01", new Date());

    assert.equal(extrato, "Error: Data limite para extrato é de 90 dias");
  });

  it("Mensagem de erro: Data inválida", async () => {
    const extrato = await getExtract(user.idConta, "2021-01-01", "2021-13-01");

    assert.equal(extrato, "Error: Data inválida");
  });
});
