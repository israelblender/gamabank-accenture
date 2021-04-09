const assert = require("chai").assert;

const checkPhone = require("../../src/helpers/phone.helper");

describe("Check Phone helper Tool", async () => {
  it("should be return false when receive a invalid phone number", async () => {
    const phone = "(11) 265458";

    const check = await checkPhone(phone);

    assert.equal(check, false);
  });

  it("should be return true when receive a valid phone number", async () => {
    const phone = "(11) 25684675";

    const check = await checkPhone(phone);

    assert.equal(check, true);
  });
});
