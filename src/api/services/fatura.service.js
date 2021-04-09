const faturaRepository = require("../repositories/fatura.repository");

const createFatura = async (idConta) => {
  // verifico se a conta já possui fatura aberta
  const findFatura = await faturaRepository.findOpenedInvoiceByAccountId(
    idConta
  );

  // caso exista retorno a fatura e retorno
  if (findFatura) {
    return findFatura;
  }

  // chamo repositorio para criação da fatura
  const fatura = await faturaRepository.createFatura(idConta);

  // retorno mensagem com id da fatura
  return {
    message: "Credito da conta Criada com sucesso",
    id: fatura.id,
  };
};

const getOpenInvoice = async (accountId) => {
  const findFatura = await faturaRepository.findOpenedInvoiceByAccountId(
    accountId
  );
  // caso exista retorno a fatura e retorno
  console.log(findFatura);
  return findFatura;
};

module.exports = { createFatura, getOpenInvoice };
