const assert = require("chai").assert;

const checkEmail = require("../../src/helpers/email.helper");

describe("Check Email helper Tool", async () => {
  it("should be return false when receive a invalid email", async () => {
    const email = "matheus@.com";

    const check = await checkEmail(email);

    assert.equal(check, false);
  });

  it("should be return true when receive a valid email", async () => {
    const email = "mgsantos199@gmail.com";

    const check = await checkEmail(email);

    assert.equal(check, true);
  });
});
