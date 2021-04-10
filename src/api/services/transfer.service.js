const lancamentoRepository = require("../repositories/lancamento.repository");
const contaRepository = require("../repositories/conta.repository");
const userRepository = require("../repositories/user.repository");
const { validateCpf } = require("../../helpers/cpf.helper");
const { validCodBank } = require("../../helpers/codBanco");
const { sendMessage } = require("../../helpers/nodemailer");
const Boom = require("@hapi/boom");
const transferIntern = async (id, accountId, email, valor) => {
  try {
    const buscandoUsuarioDestino = await contaRepository.findAccountByEmail(
      email
    );
    const valorC = parseFloat(valor);
    if (buscandoUsuarioDestino === undefined) {
      return Boom.badRequest("E-mail inválido, correntista não encontrado");
    }
    if (id === buscandoUsuarioDestino.id) {
      return Boom.badRequest("Transferência inválida");
    }
    const conta = await contaRepository.findContaByUserId(id);
    const userAccount = await userRepository.findUserById(id);
    if (conta.saldo < valorC) {
      return Boom.unauthorized("Saldo insuficiente");
    }
    await lancamentoRepository.register(
      accountId,
      "DÉBITO",
      `Transferência para o ${email}`,
      valorC
    );
    const saldoContaDestiny = await contaRepository.findContaByUserId(
      buscandoUsuarioDestino.id
    );
    let valorDebit = parseFloat(conta.saldo) - valorC;
    let valorCredit = parseFloat(saldoContaDestiny.saldo) + valorC;
    await contaRepository.updateBalanceAccount(id, valorDebit);
    await lancamentoRepository.register(
      buscandoUsuarioDestino.idConta,
      "CRÉDITO",
      `Transferência recebida do ${userAccount.email}`,
      valorC
    );
    await contaRepository.updateBalanceAccount(
      saldoContaDestiny.id,
      valorCredit
    );
    await sendMessage(
      userAccount.email,
      `Transferência para ${email}, R$ ${valor}`
    );
    await sendMessage(
      email,
      `Transferência recebida do ${userAccount.email}, R$ ${valor}`
    );
    return "Transferência realizada com sucesso";
  } catch (error) {
    console.log(error);
    if (error.responseCode == 554) {
      return "Transferência realizada com sucesso";
    }
    return Boom.serverUnavailable("Serviço indisponível");
  }
};
const transferExtern = async (id, codigoBanco, cpf, valor) => {
  try {
    const cpfV = await validateCpf(cpf);
    if (cpfV == false) {
      return Boom.badRequest("CPF inválido");
    }
    const verifyCodBanco = await validCodBank(codigoBanco);
    if (verifyCodBanco == false) {
      return Boom.badRequest("Código do banco inválido");
    }
    const conta = await contaRepository.findContaByUserId(id);
    let valorC = parseFloat(valor);
    if (conta.saldo < valorC) {
      return Boom.unauthorized("Saldo insuficiente");
    }
    await lancamentoRepository.register(
      conta.id,
      "DÉBITO",
      `Transferência para ${verifyCodBanco.label} CPF ${cpf}`,
      valorC
    );
    const userAccount = await userRepository.findUserById(id);
    let valorDebit = conta.saldo - valorC;
    await contaRepository.updateBalanceAccount(conta.id, valorDebit);
    await sendMessage(
      userAccount.email,
      "transferência",
      `Transferência para o CPF ${cpf} no valor de R$ ${valor}`
    );
    return "Transferência realizada com sucesso";
  } catch (error) {
    console.log(error);
    return Boom.serverUnavailable("Serviço indisponível");
  }
};
module.exports = { transferIntern, transferExtern };
