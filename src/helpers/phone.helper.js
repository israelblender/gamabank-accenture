const validator = require("validar-telefone");

const validatePhone = async (phone) =>
  await validator.default(phone, {
    mostrarLogs: true,
  });

module.exports = validatePhone;
