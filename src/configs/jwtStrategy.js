const { validate } = require("../api/services/auth.service");
const secret = process.env.SECRET;
const authName = "jwt";
const authSchema = "jwt";
const authOptions = { key: secret, validate };

module.exports = {
  authOptions,
  authSchema,
  authName,
};
