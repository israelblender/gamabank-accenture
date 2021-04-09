const database = require("../../configs/database");

const findOpenedInvoiceByAccountId = async (accountId) => {
  const fatura = await database.execute(
    `SELECT * FROM fatura WHERE idConta='${accountId}' AND status='Aberta'`
  );

  // retorna primeiro registro encontrado
  return fatura[0];
};

const createFatura = async (idConta) => {
  const status = "Aberta";
  const diaFechamento = 20;
  const diaVencimento = diaFechamento + 10;
  const mesReferencia = "2021-04";
  const valorConsolidado = 0;
  const valorPago = 0;

  const fatura = database.execute(
    `INSERT INTO fatura ( idConta, status, diaFechamento, diaVencimento, mesReferencia, valorConsolidado, valorPago) VALUES ('${idConta}', '${status}','${diaFechamento}', '${diaVencimento}', '${mesReferencia}','${valorConsolidado}', '${valorPago}');`
  );

  // retorna id do registro criado

  return { id: fatura.insertId };
};

module.exports = { createFatura, findOpenedInvoiceByAccountId };
