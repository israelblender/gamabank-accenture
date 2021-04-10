const creditoRepository = require("../repositories/credito.repository");

const createCredito = async (idConta) => {

  // verifico se a conta já possui credito
  const findCredito = await creditoRepository.findCreditoByIdConta(idConta);

  // caso exista retorno o credito
  if (findCredito) {
    return findCredito;
  }

  // chamo repositorio para criação do credito
  const credito = await creditoRepository.createCredito(idConta);

  // retorno mensagem com id da conta
  return {
    message: "Credito da conta Criada com sucesso",
    id: credito.id,
  };
};

module.exports = { createCredito };
