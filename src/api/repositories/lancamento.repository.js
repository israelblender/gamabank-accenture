const database = require("../../configs/database");

const register = async (id, tipo, descricao, valor) => {
  const data = new Date();

  const register = await database.execute(
    `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${id}', '${data.toLocaleDateString(
      "en-US"
    )}', '${tipo}','${descricao}','${valor}')`
  );

  return register;
};

const extractByAccountId = async (accountId, dt_inicial, dt_final) => {
  const sqlStatement = `SELECT data, tipo, descricao, valor FROM lancamentos WHERE idConta = ${accountId} AND data BETWEEN '${dt_inicial}' AND '${dt_final}' ORDER BY data DESC`;
  const result = await database.execute(sqlStatement);

  return result;
};

const createNewLaunchPay = async (idAccount, value) => {
  const data = new Date();
  const tipo = "DÉBITO";
  const descricao = `Pagamento débito em conta`;

  const newLaunch = await database.execute(
    `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${idAccount}', '${data.toLocaleDateString(
      "en-US"
    )}', '${tipo}','${descricao}','${value}')`
  );
  return newLaunch;
};

const createNewLauchDeposit = async (idAccount, description, value) => {
  const data = new Date();
  const tipo = "CRÉDITO";

  const newLaunch = await database.execute(
    `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${idAccount}', '${data.toLocaleDateString(
      "en-US"
    )}', '${tipo}','${description}','${value}')`
  );

  return newLaunch;
};

module.exports = {
  register,
  createNewLaunchPay,
  createNewLauchDeposit,
  extractByAccountId,
};
