const creditRepository = require("../repositories/credit.repository");

const store = async (idAccount) => {
  // verifico se a conta já possui credito
  const findCredit = await creditRepository.findCreditByAccountId(idAccount);

  // caso exista retorno o credito
  if (findCredit) {
    return findCredit;
  }

  // chamo repositorio para criação do credito
  const credit = await creditRepository.createAccountCredit(idAccount);

  // retorno mensagem com id da conta
  return {
    message: "Credito da conta Criada com sucesso",
    id: credit.id,
  };
};

const updateAvaliableLimit = async (idAccount, value) => {
  const findCredit = await creditRepository.findCreditByAccountId(idAccount);

  const newAvailableCredit = findCredit.limiteDisponivel + value;

  await creditRepository.updateAvaliableCredit(idAccount, newAvailableCredit);

  return;
};

module.exports = { store, updateAvaliableLimit };
