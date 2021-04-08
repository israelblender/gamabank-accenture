const launchRepository = require("../repositories/launch.repository");
const contaRepository = require("../repositories/conta.repository");
const validarCPF = require("../../helpers/cpf.helper");
const Boom = require("@hapi/boom");


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
      return Boom.badRequest('Cpf inválido');
  }

  if((parseFloat(findAccount.saldo) - valueAdd) < 0) {
    return Boom.conflit('Pagamento nao pode ser efetuado')
  }

  await launchRepository.createNewLaunchPay(cpf, value);
    
  let restValue = parseFloat(findAccount.saldo) - valueAdd;
  
  await contaRepository.updateBalanceAccount(userId, restValue);
  
  // retorno mensagem c
  return {
      
    message: "Pagamento realizado com sucesso",

};
    
};