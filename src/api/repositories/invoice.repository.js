const database = require("../../configs/database");

const findOpenedInvoiceByAccountId = async (accountId) => {
  const fatura = await database.execute(
    `SELECT * FROM fatura WHERE idConta='${accountId}' AND status='Aberta'`
  );

  // retorna primeiro registro encontrado
  return fatura[0];
};

const payInvoice = async (id, valor) => {
  const fatura = await database.execute(
    `UPDATE fatura SET valorPago = ${valor} WHERE id = '${id}'`
  );
  return fatura;
};

//Procura fatura por mes de referencia
const findInvoiceByReferenceMonth = async (accountId, referenceMonth) => {
  const invoice = await database.execute(
    `SELECT * FROM fatura WHERE idConta=${accountId} and mesReferencia='${referenceMonth}'`
  );
  return invoice[0];
};

//Cria fatura para um mes especifico
const createInvoice = async (accountId, referenceMonth, status) => {
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
  const updateInvoice = await database.execute(
    `UPDATE fatura SET valorConsolidado=${valueConsolidation} WHERE id=${invoiceId}`
  );
  return updateInvoice;
};

module.exports = {
  findOpenedInvoiceByAccountId,
  findInvoiceByReferenceMonth,
  createInvoice,
  updateInvoiceValueConsolidation,
  payInvoice,
};
