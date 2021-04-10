const validarEmail = require("email-validator");

const validateEmail = async (email) => validarEmail.validate(email);

module.exports = validateEmail;
