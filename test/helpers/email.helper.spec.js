const assert = require("chai").assert;

const checkEmail = require("../../src/helpers/email.helper");

describe("Check Email helper Tool", async () => {
  it("Deve retornar false quando receber um e-mail inválido", async () => {
    const email = "matheus@.com";

    const check = await checkEmail(email);

    assert.equal(check, false);
  });

  it("Deve retornar true quando receber um e-mail válido", async () => {
    const email = "mgsantos199@gmail.com";

    const check = await checkEmail(email);

    assert.equal(check, true);
  });
});
