const lancamentoRepository = require("../repositories/lancamento.repository");
const contaRepository = require("../repositories/conta.repository");
const validarCPF = require("../../helpers/cpf.helper");
const Boom = require("@hapi/boom");
const { sendMessage } = require("../../helpers/nodemailer");
const userRepository = require("../repositories/user.repository");

const payWithDebit = async (userId, value) => {
    
  const findAccount = await contaRepository.findContaByUserId(userId);
  const valueAdd = parseFloat(value);
  
  if(findAccount === undefined){
    return Boom.badRequest('Id inválido, correntista não encontrado');
  };

  if(valuAdd <= 0) {

      return Boom.conflict('Valor para pagamento inválido')
  }
    
  if(parseFloat(findAccount.saldo) < valueAdd) {
      return Boom.conflit('Saldo insuficiente')
  }

  if(!(validarCPF(cpf))) {
      return Boom.badRequest('CPF inválido');
  }

  if((parseFloat(findAccount.saldo) - valueAdd) < 0) {
    return Boom.conflit('Pagamento nao pode ser efetuado')
  }

  const idAccount = findAccount.id;
  const findCpfById = await userRepository.findUserById(userId).cpf;

  if(!(validarCPF(findCpfById))) {

    return Boom.badRequest('CPF inválido');
  }

  await lancamentoRepository.createNewLaunchPay(idAccount, findCpfById, valueAdd);
    
  let restValue = parseFloat(findAccount.saldo) - valueAdd;
  
  await contaRepository.updateBalanceAccount(idAccount, restValue);

  const findEmailByUser = findAccount.email;

  await sendMessage(findEmailByUser, `Pagamento realizado pelo ${findCpfById}, R$ ${value}`);

  // retorno mensagem c
  return {
      
    message: "Pagamento realizado com sucesso",

  };
    
};

module.exports = {
  payWithDebit
}
