const lancamentoRepository = require("../repositories/lancamento.repository");
const Boom = require("@hapi/boom");

const getExtract = async (userId, dt_inicial, dt_final) => {
  const dt_i = new Date(dt_inicial);
  const dt_f = new Date(dt_final);

  if (
    !(dt_i instanceof Date && !isNaN(dt_i.getTime())) ||
    !(dt_f instanceof Date && !isNaN(dt_f.getTime()))
  ) {
    return Boom.badRequest("Data inválida");
  }

  if (dt_i > dt_f) {
    return Boom.badRequest("Data inicial não pode ser maior que a data final");
  }

  const extrato = await lancamentoRepository.extractByAccountId(
    userId,
    dt_inicial,
    dt_final
  );

  return extrato.reverse();
};

module.exports = { getExtract };
