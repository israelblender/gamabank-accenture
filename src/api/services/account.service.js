const accountRepository = require("../repositories/account.repository");
const creditService = require("../services/credit.service");
const invoiceService = require("../services/invoice.service");
const { calcMonthReference } = require("../../helpers/date.helper");

const store = async (idUsuario) => {
  // verifico se usuario já possui uma conta
  const findConta = await accountRepository.findAccountByUserId(idUsuario);

  // caso exista retorno a conta
  if (findConta) {
    return findConta;
  }

  // chamo repositorio para criação da conta
  const account = await accountRepository.createAccount(idUsuario);

  // chamo service credito passando id da conta
  await creditService.store(account.id);

  // chamo service de fatura passando id da conta

  await invoiceService.createInvoice(
    account.id,
    calcMonthReference(0),
    "Aberta"
  );

  // retorno mensagem com id da conta
  return {
    message: "Conta Criada com sucesso",
    id: account.id,
  };
};

module.exports = { store };
