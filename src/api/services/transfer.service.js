const lancamentoRepository = require("../repositories/lancamento.repository");
const accountRepository = require("../repositories/account.repository");
const userRepository = require("../repositories/user.repository");
const { validateCpf } = require("../../helpers/cpf.helper");
const { validCodBank } = require("../../helpers/codBanco");
const { sendMessage } = require("../../helpers/nodemailer");
const Boom = require("@hapi/boom");

const transferIntern = async (id, accountId, email, value) => {
  try {
    const buscandoUsuarioDestino = await accountRepository.findAccountByEmail(
      email
    );

    if (!buscandoUsuarioDestino) {
      return Boom.badRequest("E-mail inválido, correntista não encontrado");
    }

    if (id === buscandoUsuarioDestino.id) {
      return Boom.badRequest(
        "Correntista não pode fazer uma transferencia para ele mesmo"
      );
    }

    const valorC = parseFloat(value);

    const conta = await accountRepository.findAccountByUserId(id);
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

    await lancamentoRepository.register(
      buscandoUsuarioDestino.idConta,
      "CRÉDITO",
      `Transferência recebida do ${userAccount.email}`,
      valorC
    );

    const saldoContaDestiny = await accountRepository.findAccountByUserId(
      buscandoUsuarioDestino.id
    );

    let valorDebit = parseFloat(conta.saldo) - valorC;

    let valorCredit = parseFloat(saldoContaDestiny.saldo) + valorC;

    // atualizar saldo da conta origiem
    await accountRepository.updateBalanceAccount(accountId, valorDebit);

    // atualizar saldo da conta destino
    await accountRepository.updateBalanceAccount(
      saldoContaDestiny.id,
      valorCredit
    );

    // Envio de email para conta que realizou a transferencia
    await sendMessage(
      userAccount.email,
      `Transferência para ${email}, R$ ${value}`
    );

    // Envio de email para conta que recebeu a transferencia
    await sendMessage(
      email,
      `Transferência recebida do ${userAccount.email}, R$ ${value}`
    );
    return {
      message: "Transferência realizada com sucesso",
      originAccount: userAccount.email,
      destinyAccount: email,
      value: valorC,
    };
  } catch (error) {
    console.log(error);
    if (error.responseCode == 554 || error.responseCode == 535) {
      return "Transferência realizada com sucesso";
    }
    return Boom.serverUnavailable("Serviço indisponível");
  }
};

const transferExtern = async (id, codigoBanco, cpf, value) => {
  try {
    const cpfV = await validateCpf(cpf);
    if (cpfV == false) {
      return Boom.badRequest("CPF inválido");
    }

    const verifyCodBanco = await validCodBank(codigoBanco);
    if (verifyCodBanco == false) {
      return Boom.badRequest("Código do banco inválido");
    }

    const conta = await accountRepository.findAccountByUserId(id);

    let valorC = parseFloat(value);
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

    await accountRepository.updateBalanceAccount(conta.id, valorDebit);

    await sendMessage(
      userAccount.email,
      "transferência",
      `Transferência para ${verifyCodBanco.label} CPF ${cpf} no valor de R$ ${value}`
    );

    return {
      message: "Transferência realizada com sucesso",
      originAccount: userAccount.email,
      destinyAccount: `${verifyCodBanco.label} CPF: ${cpf}`,
      value: valorC,
    };
  } catch (error) {
    console.log(error);
    if (error.responseCode == 554 || error.responseCode == 535) {
      return "Transferência realizada com sucesso";
    }
    return Boom.serverUnavailable("Serviço indisponível");
  }
};
module.exports = { transferIntern, transferExtern };
