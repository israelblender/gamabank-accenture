const contaRepository = require("../repositories/conta.repository");
const lancamentoRepository = require("../repositories/lancamento.repository");
const userRepository = require("../repositories/user.repository");
const validarCPF = require("../../helpers/cpf.helper");
const validarEmail = require("email-validator");
const { sendMessage } = require("../../helpers/nodemailer");
const Boom = require("@hapi/boom");

const updateBalanceAsHolder = async (userId, value) => {
<<<<<<< HEAD
  const findAccount = await contaRepository.findContaByUserId(userId);

  if (findAccount === undefined) {
    return Boom.notFound("Não existe conta para o correntista relacionado");
  }

  const valueAdd = parseFloat(value);

  if (valueAdd <= 0) {
    return Boom.conflict("Valor não pode ser depositado");
  }

  const cpfUser = await userRepository.findUserById(userId).cpf;
  const idAccount = await findAccount.id;

  if (!validarCPF(cpf)) {
    return Boom.conflict("CPF inválido");
  }

  await lancamentoRepository.createNewLaunchDebit(idAccount, cpfUser, valueAdd);

  const atualBalance = findAccount.saldo;

  let valueAfterDepit = parseFloat(atualBalance) + valueAdd;

  await contaRepository.updateBalanceAccount(userId, valueAfterDepit);

  const findEmailByUser = await userRepository.findUserById(userId).email;

  await sendMessage(
    findEmailByUser,
    `Depósito realizado com sucesso com valor de R$ ${value}`
  );

  return {
    message: "Depósito realizado com sucesso",
  };
=======
  try {
    
    const findAccount = await contaRepository.findContaByUserId(userId);
  
    if(findAccount === undefined){
  
      return Boom.notFound('Não existe conta para o correntista relacionado');
  
    }
  
    const valueAdd = parseFloat(value);
  
    if(valueAdd <= 0) {
      return Boom.conflict('Valor não pode ser depositado');
    }
  
    const cpfUser = await userRepository.findUserById(userId).cpf;
    const idAccount = await findAccount.id;
  
    if(!(validarCPF(cpf))) {
  
      return Boom.conflict('CPF inválido');
    }
  
    await lancamentoRepository.createNewLaunchDebit(idAccount, cpfUser, valueAdd);
  
    const atualBalance = findAccount.saldo;
  
    let valueAfterDepit = parseFloat(atualBalance) + valueAdd;
    
    await contaRepository.updateBalanceAccount(userId, valueAfterDepit);
  
    const findEmailByUser = await userRepository.findUserById(userId).email;
  
    await sendMessage(findEmailByUser, `Depósito realizado com sucesso com valor de R$ ${value}`);
    
    return {
  
      message: "Depósito realizado com sucesso"
    
    };
  } catch (error) {
      console.log(error);
      if(error.responseCode == 554){
        return {
  
          message: "Depósito realizado com sucesso"
        
        };
      };
  
      return Boom.serverUnavailable('Serviço indisponível');
  };

>>>>>>> 9e80c722dcde124949cdd3977a580d8a962ade78
};

const updateBalanceAsNotHolder = async (cpf, email, value) => {
  console.log(email);
  const checkEmail = await validarEmail.validate(email);

<<<<<<< HEAD
  if (!checkEmail) {
    return Boom.conflict("EMAIL inválido");
  }

  const findUser = await userRepository.findUserByEmail(email);
  const userId = findUser.id;

  if (findUser === undefined) {
    return Boom.notFound("Não existe usuário com esse email cadastrado");
  }
=======
  try{
    if(!(validarEmail.validate(email))) {

      return Boom.conflict('EMAIL inválido');
    }

    const findUser = await userRepository.findUserByEmail(email)
    const userId = findUser.id

    if(findUser === undefined) {
      return Boom.notFound('Não existe usuário com esse email cadastrado')
    }
>>>>>>> 9e80c722dcde124949cdd3977a580d8a962ade78

    const findAccount = await contaRepository.findContaByUserId(userId);
    const idAccount = findAccount.id;

    const valueAdd = parseFloat(value);

<<<<<<< HEAD
  if (valueAdd <= 0) {
    return Boom.conflict("Valor não pode ser depositado");
  }

  if (!validarCPF(cpf)) {
    return Boom.conflict("CPF inválido");
  }
=======
    if(valueAdd <= 0) {
      return Boom.conflict('Valor não pode ser depositado');
    }
    
    if(!(validarCPF(cpf))) {

      return Boom.conflict('CPF inválido');
    }
>>>>>>> 9e80c722dcde124949cdd3977a580d8a962ade78

    await lancamentoRepository.createNewLaunchDebit(idAccount, cpf, valueAdd);

    const atualBalance = findAccount.saldo;

    let valueAfterDepit = parseFloat(atualBalance) + valueAdd;

    await contaRepository.updateBalanceAccount(userId, valueAfterDepit);

<<<<<<< HEAD
  // enviar email p avisar q deposito chegou
  await sendMessage(
    email,
    `Depósito realizado com sucesso pelo cpf:${cpf} com valor de R$ ${value}`
  );

  return {
    message: "Depósito realizado com sucesso",
=======
    // enviar email p avisar q deposito chegou
    await sendMessage(email, `Depósito realizado com sucesso pelo cpf:${cpf} com valor de R$ ${value}`);

    return {

      message: "Depósito realizado com sucesso"
    
    };
  } catch (error) {
    console.log(error);
    if(error.responseCode == 554){
      return {

        message: "Depósito realizado com sucesso"
      
      };
    };

    return Boom.serverUnavailable('Serviço indisponível');
>>>>>>> 9e80c722dcde124949cdd3977a580d8a962ade78
  };
};

module.exports = { updateBalanceAsHolder, updateBalanceAsNotHolder };
