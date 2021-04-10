const database = require("../../configs/database");

const getTransacoesByInvoiceId = async (invoiceId) => {
  const transacoes = await database.execute(
    `SELECT data, descricao, valor FROM transacoescredito WHERE idFatura='${invoiceId}' ORDER BY data DESC`
  );

  // retorna primeiro registro encontrado
  return transacoes;
};

module.exports = { getTransacoesByInvoiceId };
