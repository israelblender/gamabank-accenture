const assert = require("chai").assert;
const faker = require("faker");

const checkPassword = require("../../src/helpers/checkPassword");

describe("Check Password helper Tool", async () => {
  it("should be return true when receive a password with ontaining at least 8 characters, 1 number, 1 upper, 1 lowercase and a special character", async () => {
    const password = "Matheus1$";

    const check = await checkPassword(password);

    assert.equal(check, true);
  });

  it("should be return false when receive a password not contain 8 characters, 1 number, 1 upper, 1 lowercase and a special character", async () => {
    const password = "Matheus1semcaracterespecial";

    const check = await checkPassword(password);

    assert.equal(check, false);
  });
});
