const lancamentoRepository = require("../repositories/lancamento.repository");
const contaRepository = require("../repositories/conta.repository");
const { validateCpf } = require("../../helpers/cpf.helper");
const Boom = require("@hapi/boom");
const { sendMessage } = require("../../helpers/nodemailer");
const userRepository = require("../repositories/user.repository");
const creditRepository = require("../repositories/credito.repository");
const { calcMonthReference, dateCurrent } = require("../../helpers/date.helper");
const invoiceService = require("../repositories/fatura.repository");


const payWithDebit = async (userId, value) => {
  try{
    const findAccount = await contaRepository.findContaByUserId(userId);
    const valueAdd = parseFloat(value);
    
    if(findAccount === undefined){
      return Boom.badRequest('Id inválido, correntista não encontrado');
    };

    if(valueAdd <= 0) {

        return Boom.unauthorized('Valor para pagamento inválido')
    }

    if (findAccount === undefined) {
      return Boom.badRequest("Id inválido, correntista não encontrado");
    }

    if((parseFloat(findAccount.saldo) - valueAdd) < 0) {
      return Boom.unauthorized('Pagamento nao pode ser efetuado')
    }

    const idAccount = findAccount.id;
    const findCpfById = await userRepository.findUserById(userId).cpf;

    if(!(validateCpf(findCpfById))) {

      return Boom.badRequest('CPF inválido');
    }

    await lancamentoRepository.createNewLaunchPay(idAccount, findCpfById, valueAdd);
      
    let restValue = parseFloat(findAccount.saldo) - valueAdd;

    await contaRepository.updateBalanceAccount(userId, restValue);

    const findEmailByUser =  await userRepository.findUserById(userId).email;

    await sendMessage(findEmailByUser, `Pagamento realizado pelo ${findCpfById}, R$ ${value}`);

    // retorno mensagem c
    return {
      message: "Pagamento realizado com sucesso",
    };
  }catch(error){
    console.log(error);
    if (error.responseCode == 554 || error.responseCode == 535) {
      return {
        message: "Pagamento realizado com sucesso",
      };
    }
    return Boom.serverUnavailable("Serviço indisponível");
  }
    
};



//Pagamento com crédito
const payWithCredit = async (userId, description, value, installments = 1) => {
  const findAccount = await contaRepository.findContaByUserId(userId);
  const valuePay = parseFloat(value);

  if (findAccount === undefined) {
    return Boom.badRequest("Id inválido, correntista não encontrado");
  }
  if (valuePay < 0) {
    return Boom.badRequest("Valor inválido para pagamento");
  }

  const creditUser = await creditRepository.getAvaliableCredit(findAccount.id);

  if (parseFloat(creditUser.limiteDisponivel) < valuePay) {
    return Boom.badRequest("Credito Insuficiente");
  }

  //Se a data atual for maior que a data de fechamento, o mes de referencia será o proximo mes
  let indexMonthReference = 0; // Index inicial do mesReferencia atual
  let indexInstallment = 1; //Index inicial da Parcela

  //Se dia atual for maior que data de fechamento
  // if (indexMonthReference == 0) {
  //   indexMonthReference = 1; //Index inicial do mesReferencia seguinte
  // }
  let infoNewInvoice = { status: "Aberta" };
  while (indexInstallment <= installments) {
    await createInstallment(
      findAccount.id,
      indexMonthReference,
      indexInstallment,
      description,
      valuePay / installments,
      infoNewInvoice
    );
    indexMonthReference++;
    indexInstallment++;
  }

  //Calculo credito restante
  let creditLeft = parseFloat(creditUser.limiteDisponivel) - valuePay;

  //Atualiza credito restante no db
  await creditRepository.updateAvaliableCredit(findAccount.id, creditLeft);

  return { message: "Pagamento realizado com sucesso" };
};

//Cria Fatura se não existir e lança despesa referenciada a fatura
const createInstallment = async (
  accountId,
  indexMonthReference,
  indexInstallment,
  description,
  valuePay,
  infoNewInvoice
) => {
  //Calcula o mesReferencia
  const referenceMonth = calcMonthReference(indexMonthReference);
  //Procura fatura especifica e retorna o id
  let invoice = await invoiceService.findInvoiceSpecific(
    accountId,
    referenceMonth
  );

  //Se fatura não existir, cria fatura e retorna o id
  if (!invoice) {
    invoice = await invoiceService.createInvoiceSpecific(
      accountId,
      referenceMonth,
      infoNewInvoice.status
    );
  }
  infoNewInvoice.status = "futuro";

  await invoiceService.updateInvoiceValueConsolidation(
    invoice.id,
    invoice.valorConsolidado + valuePay
  );

  //Adiciona despesa referenciando a fatura aberta
  await creditRepository.addTransaction(
    invoice.id,
    dateCurrent(),
    `${indexInstallment}ª Parcela de: ${description}`,
    valuePay
  );
};

module.exports = {
  payWithDebit,
  payWithCredit,
};
