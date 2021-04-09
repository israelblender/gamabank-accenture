const contaRepository = require("../repositories/conta.repository");
const lancamentoRepository = require("../repositories/lancamento.repository");
const userRepository = require("../repositories/user.repository");
const validarCPF = require("../../helpers/cpf.helper");
const validarEmail = require("email-validator");
const { sendMessage } = require("../../helpers/nodemailer");
const Boom = require("@hapi/boom");


const updateBalanceAsHolder = async (userId, value) => {

  const findAccount = await contaRepository.findContaByUserId(userId);

  if(findAccount === undefined){

    return Boom.notFound('Não existe conta para o correntista relacionado');

  }

  if(!(validarCPF(cpf))) {

    return Boom.conflict('CPF inválido');
 }

  const valueAdd = parseFloat(value);

  if(valueAdd <= 0) {
    return Boom.conflict('Valor não pode ser depositado');
  }

  const cpfUser = await userRepository.findUserById(userId).cpf;
  const idAccount = await findAccount.id;

  await lancamentoRepository.createNewLaunchDebit(idAccount, cpfUser, valueAdd);

  const atualBalance = findAccount.saldo;

  let valueAfterDepit = parseFloat(atualBalance) + valueAdd;
  
  await contaRepository.updateBalance(idAccount, valueAfterDepit);

  const findEmailByUser = await userRepository.findUserById(userId).email;

  await sendMessage(findEmailByUser, `Depósito realizado com sucesso com valor de R$ ${value}`);
  
  return {

    message: "Depósito realizado com sucesso"
  
  };

}

const updateBalanceAsNotHolder = async (cpf, email, value) => {

  if(!(validarEmail.validate(email))) {

    return Boom.conflict('EMAIL inválido');
  }

  const findUser = await userRepository.findUserByEmail(email)

  if(findUser === undefined) {
    return Boom.notFound('Não existe usuário com esse email cadastrado')
  }

  const findAccount = await contaRepository.findContaByUserId(findUser.userId);
  const findId = findAccount.id;

  const valueAdd = parseFloat(value);

  if(valueAdd <= 0) {
    return Boom.conflict('Valor não pode ser depositado');
  }
  
  if(!(validarCPF(cpf))) {

     return Boom.conflict('CPF inválido');
  }

  await lancamentoRepository.createNewLaunchDebit(findId, cpf, valueAdd);

  const atualBalance = findAccount.saldo;

  let valueAfterDepit = parseFloat(atualBalance) + valueAdd;
  
  await contaRepository.updateBalance(findId, valueAfterDepit);

  const findEmailByUser = findUser.email;
  
  await sendMessage(findEmailByUser, `Depósito realizado com sucesso pelo cpf:${cpf} com valor de R$ ${value}`);
  
  return {

    message: "Depósito realizado com sucesso"
  
  };

}

module.exports = { updateBalanceAsHolder, updateBalanceAsNotHolder};
