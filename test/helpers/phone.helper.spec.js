const assert = require("chai").assert;

const checkPhone = require("../../src/helpers/phone.helper");

describe("Check Phone helper Tool", async () => {
  it("Deve retornar false quando receber um número de telefone inválido", async () => {
    const phone = "(11) 265458";

    const check = await checkPhone(phone);

    assert.equal(check, false);
  });

  it("Deve retornar true quando receber um número de telefone válido", async () => {
    const phone = "(11) 25684675";

    const check = await checkPhone(phone);

    assert.equal(check, true);
  });
});
