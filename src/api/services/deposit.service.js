const contaRepository = require("../repositories/conta.repository");
const lancamentoRepository = require("../repositories/lancamento.repository");
const userRepository = require("../repositories/user.repository");
const validarCPF = require("../../helpers/cpf.helper");
const validarEmail = require("email-validator");
const { sendMessage } = require("../../helpers/nodemailer");
const Boom = require("@hapi/boom");


const updateBalanceAsHolder = async (userId, value) => {
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

};

const updateBalanceAsNotHolder = async (cpf, email, value) => {

  try{
    if(!(validarEmail.validate(email))) {

      return Boom.conflict('EMAIL inválido');
    }

    const findUser = await userRepository.findUserByEmail(email)
    const userId = findUser.id

    if(findUser === undefined) {
      return Boom.notFound('Não existe usuário com esse email cadastrado')
    }

    const findAccount = await contaRepository.findContaByUserId(userId);
    const idAccount = findAccount.id;

    const valueAdd = parseFloat(value);

    if(valueAdd <= 0) {
      return Boom.conflict('Valor não pode ser depositado');
    }
    
    if(!(validarCPF(cpf))) {

      return Boom.conflict('CPF inválido');
    }

    await lancamentoRepository.createNewLaunchDebit(idAccount, cpf, valueAdd);

    const atualBalance = findAccount.saldo;

    let valueAfterDepit = parseFloat(atualBalance) + valueAdd;

    await contaRepository.updateBalanceAccount(userId, valueAfterDepit);

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
  };

}

module.exports = { updateBalanceAsHolder, updateBalanceAsNotHolder};
