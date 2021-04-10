const assert = require("chai").assert;
const faker = require("faker");

const cpfHelper = require("../../src/helpers/cpf.helper");

describe("CPF helper Tool", async () => {
  it("should be return true when receive a valid CPF", async () => {
    const cpf = "76286455000";

    const validaCpf = await cpfHelper.validateCpf(cpf);

    assert.equal(validaCpf, true);
  });

  it("should be return false when receive a invalide CPF", async () => {
    const cpf = "762864550";

    const validaCpf = await cpfHelper.validateCpf(cpf);

    assert.equal(validaCpf, false);
  });

  it("should be return a formated cpf when receive a valid CPF", async () => {
    const cpf = "76286455000";
    const cpfFormatedExpected = "762.864.550-00";

    const cpfFormated = await cpfHelper.formatCPf(cpf);

    assert.equal(cpfFormated, cpfFormatedExpected);
  });

  it("should be return false cpf when try to format a invalid CPF", async () => {
    const cpf = "762864550";

    const cpfFormated = await cpfHelper.formatCPf(cpf);

    assert.equal(cpfFormated, false);
  });
});
