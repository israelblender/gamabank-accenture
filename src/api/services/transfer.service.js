const lancamentoRepository = require("../repositories/lancamento.repository");
const contaRepository = require("../repositories/conta.repository");
const userRepository = require("../repositories/user.repository");
const { validateCpf } = require("../../helpers/cpf.helper");
const { validCodBank } = require("../../helpers/codBanco");
const { sendMessage } = require("../../helpers/nodemailer");
const Boom = require("@hapi/boom");

const transferIntern = async (id, email, valor) => {
  try {
    
    const findContaDestiny = await contaRepository.findContaByUserEmail(email);
    const valorC = parseFloat(valor);
    
    if(findContaDestiny === undefined){
      return Boom.badRequest('E-mail inválido, correntista não encontrado');
    };
      
    if(id === findContaDestiny.id){
      return Boom.badRequest('Transferência inválida'); 
    };
    
    const verifySaldo = await contaRepository.findContaByUserId(id);
    
    const userAccount = await userRepository.findUserById(id);
    
    if(verifySaldo.saldo < valorC){
      return Boom.unauthorized('Saldo insuficiente');
    };
  
    await lancamentoRepository.register(id, 'transferência',`Transferência para o ${email}`,valorC);
    
    const saldoContaDestiny = await contaRepository.findContaByUserId(findContaDestiny.id);
    
    let valorDebit = parseFloat(verifySaldo.saldo) - valorC;
    let valorCredit = parseFloat(saldoContaDestiny.saldo) + valorC;
    
    await contaRepository.alterSaldoConta(id, valorDebit);
    
    await lancamentoRepository.register(findContaDestiny.id, 'transferência', `Transferência recebida do ${userAccount.email}`, valorC);
    
    await contaRepository.alterSaldoConta(saldoContaDestiny.id, valorCredit);
    
    await sendMessage(userAccount.email, `Transferência para ${email}, R$ ${valor}`);
    
    await sendMessage(email, `Transferência recebida do ${userAccount.email}, R$ ${valor}`);
    
    return 'Transferência realizada com sucesso';

  } catch (error) {
    console.log(error);
    return Boom.serverUnavailable('Serviço indisponível');
  };
};
  
const transferExtern = async (id, codigoBanco, cpf, valor) => {

  try {
    const cpfV = await validateCpf(cpf);
    
    if(cpfV == false){
      return Boom.badRequest('CPF inválido');
    };
  
    
    const verifyCodBanco = await validCodBank(codigoBanco);
    
    if(verifyCodBanco == false){
      return Boom.badRequest('Código do banco inválido');
    };
    
    const verifySaldo = await contaRepository.findContaByUserId(id);
    
    let valorC = parseFloat(valor);
  
    if(verifySaldo.saldo < valorC){
      return Boom.unauthorized('Saldo insuficiente');
    };
  
    await lancamentoRepository.register(id, `Transferência para ${verifyCodBanco.label} CPF ${cpf}`, valorC);
  
    const userAccount = await userRepository.findUserById(id);
  
    let valorDebit = verifySaldo.saldo - valorC;
  
    await contaRepository.alterSaldoConta(id, valorDebit);
    
    await sendMessage(userAccount.email, 'transferência',`Transferência para o CPF ${cpf} no valor de R$ ${valor}`);
  
    return 'Transferência realizada com sucesso';
    
  } catch (error) {
    console.log(error);
    return Boom.serverUnavailable('Serviço indisponível');
  };
};
  
module.exports = { transferIntern, transferExtern };
  