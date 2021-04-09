const lancamentoRepository = require("../repositories/lancamento.repository");
const contaRepository = require("../repositories/conta.repository");
const validarCPF = require("../../helpers/cpf.helper");
const Boom = require("@hapi/boom");
const { sendMessage } = require("../../helpers/nodemailer");

const payWithDebit = async (userId, cpf, value) => {
    
  const findAccount = await contaRepository.findContaByUserId(userId);
  const valueAdd = parseFloat(value);
  
  if(findAccount === undefined){
    return Boom.badRequest('Id inválido, correntista não encontrado');
  };

  if(valuAdd < 0) {
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

  await lancamentoRepository.createNewLaunchPay(cpf, value);
    
  let restValue = parseFloat(findAccount.saldo) - valueAdd;
  
  await contaRepository.updateBalanceAccount(userId, restValue);

  const findEmailByUser = findAccount.email;

  await sendMessage(findEmailByUser, `Pagamento realizado pelo ${cpf}, R$ ${value}`);

  // retorno mensagem c
  return {
      
    message: "Pagamento realizado com sucesso",

};
    
};

module.exports = {
  payWithDebit
}
