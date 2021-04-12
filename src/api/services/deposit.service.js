const contaRepository = require("../repositories/account.repository");
const lancamentoRepository = require("../repositories/lancamento.repository");
const userRepository = require("../repositories/user.repository");
const { validateCpf } = require("../../helpers/cpf.helper");
const validarEmail = require("email-validator");
const Boom = require("@hapi/boom");

const updateBalanceAsHolder = async (userId, value) => {
  const findAccount = await contaRepository.findAccountByUserId(userId);
  if (findAccount === undefined) {
    return Boom.notFound("Correntista não encontrado");
  }
  const valueAdd = parseFloat(value);
  if (valueAdd <= 0) {
    return Boom.conflict("Valor não pode ser depositado");
  }

  const description = `Deposito realizado na conta pelo correntista`;

  await lancamentoRepository.createNewLauchDeposit(
    findAccount.id,
    description,
    valueAdd
  );

  const atualBalance = findAccount.saldo;
  let valueAfterDebit = parseFloat(atualBalance) + valueAdd;

  await contaRepository.updateBalanceAccount(findAccount.id, valueAfterDebit);

  return {
    message: "Depósito realizado com sucesso",
    value: valueAdd,
    date: new Date(),
  };
};

const updateBalanceAsNotHolder = async (cpf, email, value) => {
  if (!validarEmail.validate(email)) {
    return Boom.conflict("EMAIL inválido");
  }

  const validaCpf = await validateCpf(cpf);

  if (!validaCpf) {
    return Boom.conflict("CPF inválido");
  }

  const findUser = await userRepository.findUserByEmail(email);

  if (findUser === undefined) {
    return Boom.notFound("Não existe usuário com esse email cadastrado");
  }
  const findAccount = await contaRepository.findAccountByUserId(findUser.id);
  const idAccount = findAccount.id;
  const valueAdd = parseFloat(value);
  if (valueAdd <= 0) {
    return Boom.conflict("Valor não pode ser depositado");
  }

  const description = `Deposito realizado na conta pelo CPF=${cpf}`;

  await lancamentoRepository.createNewLauchDeposit(
    idAccount,
    description,
    valueAdd
  );

  // update account balance
  const atualBalance = findAccount.saldo;
  let valueAfterDebit = parseFloat(atualBalance) + valueAdd;
  await contaRepository.updateBalanceAccount(findAccount.id, valueAfterDebit);
  // enviar email p avisar q deposito chegou
  //await sendMessage(email, `Depósito realizado com sucesso pelo cpf:${cpf} com valor de R$ ${value}`);
  return {
    message: "Depósito realizado com sucesso",
    value: valueAdd,
    date: new Date(),
  };
};

module.exports = { updateBalanceAsHolder, updateBalanceAsNotHolder };
