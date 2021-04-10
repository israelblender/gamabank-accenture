const database = require("../../configs/database");

const findFaturaAbertaByIdConta = async (idConta) => {
  const fatura = await database.execute(
    `SELECT * FROM fatura WHERE idConta='${idConta}' AND status='Aberta' order by mesReferencia desc limit 1`
  );

  // retorna primeiro registro encontrado
  return fatura[0];
};

const paymentFatura = async (id, valor) => {
  const fatura = await database.execute(
    `UPDATE fatura SET valorPago = ${valor} WHERE idConta = '${id}'`
  );
  return fatura;
};

//Procura fatura por mes de referencia
const findInvoiceSpecific = async (accountId, referenceMonth) => {
  const invoice = await database.execute(
    `SELECT * FROM fatura WHERE idConta=${accountId} and mesReferencia='${referenceMonth}'`
  );
  return invoice[0];
};

//Cria fatura para um mes especifico
const createInvoiceSpecific = async (accountId, referenceMonth, status) => {
  const diaFechamento = 20;
  const diaVencimento = 5;
  const valorConsolidado = 0;
  const valorPago = 0;

  const fatura = await database.execute(
    `INSERT INTO fatura ( idConta, status, diaFechamento, diaVencimento, mesReferencia, valorConsolidado, valorPago) 
    VALUES ('${accountId}', '${status}','${diaFechamento}', '${diaVencimento}', '${referenceMonth}','${valorConsolidado}', '${valorPago}');`
  );
  return { id: fatura.insertId, valorConsolidado };
};

const updateInvoiceValueConsolidation = async (
  invoiceId,
  valueConsolidation
) => {
  console.log(
    `UPDATE fatura SET valorConsolidado=${valueConsolidation} WHERE id=${invoiceId}`
  );
  const updateInvoice = await database.execute(
    `UPDATE fatura SET valorConsolidado=${valueConsolidation} WHERE id=${invoiceId}`
  );
  return updateInvoice;
};

module.exports = {
  findFaturaAbertaByIdConta,
  findInvoiceSpecific,
  createInvoiceSpecific,
  updateInvoiceValueConsolidation,
};
