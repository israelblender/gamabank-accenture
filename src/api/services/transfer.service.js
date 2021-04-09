const lancamentoRepository = require("../repositories/lancamento.repository");
const contaRepository = require("../repositories/conta.repository");
const userRepository = require("../repositories/user.repository");
const validarCPF = require("validar-cpf");
const { validCodBank } = require("../../helpers/codBanco");
const { sendMessage } = require("../../helpers/nodemailer");
const Boom = require("@hapi/boom");


const transferIntern = async (id, email, valor) => {
    
  const findContaDestiny = await contaRepository.findAccountByEmail(email);
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

  await lancamentoRepository.register(id, `Transferência para o ${email}`,valorC);
  
  const saldoContaDestiny = await contaRepository.findContaByUserId(findContaDestiny.id);
  
  let valorDebit = parseFloat(verifySaldo.saldo) - valorC;
  let valorCredit = parseFloat(saldoContaDestiny.saldo) + valorC;
  
  await contaRepository.updateBalanceAccount(id, valorDebit);
  
  await contaRepository.updateBalanceAccount(saldoContaDestiny.id, valorCredit);

  await sendMessage(userAccount.email, `Transferência para ${email}, R$ ${valor}`);
  
  return 'Transferência realizada com sucesso';
    
};
  
const transferExtern = async (id, codigoBanco, cpf, valor) => {
    
  
  const cpfV = await validarCPF(cpf);
  
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

  await contaRepository.updateBalanceAccount(id, valorDebit);
  
  await sendMessage(userAccount.email, `Transferência para o CPF ${cpf} no valor de R$ ${valor}`);

  return 'Transferência realizada com sucesso';

};
  
module.exports = { transferIntern, transferExtern };
  