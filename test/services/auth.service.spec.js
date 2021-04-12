const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const database = require("../../src/configs/database");
const { createUser } = require("../../src/api/services/user.service");
const authService = require("../../src/api/services/auth.service");

chai.use(chaiAsPromised);

const expect = chai.expect;
const assert = chai.assert;

describe("User service", async () => {
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
  });

  after(async () => {
    await database.rollback();
  });

  it("É possivel se autenticar com um login e senha validos", async () => {
    const login = await authService.signIn({
      email: "carolteste@teste.com",
      senha: "Anacarolina123!",
    });

    expect(login).to.haveOwnProperty("token");
    assert.isObject(login, {
      message: "Login efetuado com sucesso",
    });
  });

  it("Não é possivel se autenticar com um login invalido", async () => {
    const login = await authService.signIn({
      email: "caroltes@teste.com",
      senha: "Anacarolina123!",
    });

    assert.equal(login, "Error: Usuario não encontrado");
  });

  it("Não é possivel se autenticar com uma senha invalida", async () => {
    const login = await authService.signIn({
      email: "carolteste@teste.com",
      senha: "Anacarolina!",
    });

    assert.equal(login, "Error: Senha incorreta");
  });
});
