const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Boom = require("@hapi/boom");
const faker = require("faker");

const database = require("../../src/configs/database");
const userService = require("../../src/api/services/user.service");
const faturaRepository = require("../../src/api/repositories/fatura.repository");

chai.use(chaiAsPromised);

const expect = chai.expect;
const assert = chai.assert;

describe("User service", async () => {
  afterEach(async () => {
    await database.rollback();
  });

  it("É possivel criar um usuario", async () => {
    const newUser = await userService.createUser(
      "Matheus Gonçalves",
      "23640996844",
      "test2@gmail.com",
      "Matheus2!",
      "11990122568"
    );

    expect(newUser).to.haveOwnProperty("id");
  });
});

it("Não é possivel criar um usuario com um cpf invalido", async () => {
  const invalidCpf = "001001001-01";

  const newUser = async () =>
    await userService.createUser(
      "Matheus Gonçalves",
      invalidCpf,
      "test@gmail.com",
      "cinco",
      "11990122568"
    );

  expect(async () => await newUser()).to.throws;
});

it("Não é possivel criar 2 usuarios com o mesmo CPF", async () => {
  await userService.createUser(
    "Matheus Gonçalves",
    "76286455000",
    "test@gmail.com",
    "Matheus2!",
    "11990122568"
  );

  const newUser2 = async () => {
    await userService.createUser(
      "Douglas Gonçalves",
      "76286455000",
      "test2@gmail.com",
      "Matheus3!",
      "11990153645"
    );
  };

  expect(async () => await newUser2()).to.throws;
});

it("Não é possivel criar um usuario se a senha não conter 8 dígitos, sendo pelo menos um deles, um caractere maiúsculo, um minúsculo, um caractere especial e um numero", async () => {
  const newUser = async () =>
    await userService.createUser(
      "Matheus Gonçalves",
      "76286455000",
      "test@gmail.com",
      "cinco",
      "11990122568"
    );

  expect(async () => await newUser()).to.throws;
});
