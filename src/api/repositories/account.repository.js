const database = require("../../configs/database");

const findAccountByUserId = async (idUsuario) => {
  const account = await database.execute(
    `SELECT * FROM conta WHERE idUsuario='${idUsuario}'`
  );

  // retorna o primeiro usuario encontrado
  return account[0];
};

const findAccountByEmail = async (email) => {
  const user = await database.execute(
    `SELECT u.id, c.id as idConta FROM usuario as u INNER join conta as c ON u.id = c.idUsuario WHERE email='${email}'; `
  );

  return user[0];
};

const createAccount = async (idUsuario) => {
  const saldo = 0;
  const dateAbertura = new Date();
  const dateAberturaFormated = dateAbertura.toISOString().split("T")[0];
  const create = await database.execute(
    `INSERT INTO conta ( idUsuario, saldo, dateAbertura) VALUES ('${idUsuario}', ${saldo},'${dateAberturaFormated}');`
  );

  return { id: create.insertId };
};

const extratoByContaId = async (userId, dt_inicial, dt_final) => {
  const conta = await findAccountByUserId(userId);

  const sqlStatement = `SELECT data, descricao, tipo, valor FROM transacoes WHERE idConta = ${conta.id} AND data BETWEEN ${dt_inicial} AND ${dt_final} ORDER BY data DESC`;

  const result = await database.execute(sqlStatement);

  return result;
};

const updateBalanceAccount = async (id, value) => {
  const balance = await database.execute(
    `UPDATE conta SET saldo = ${value} WHERE id=${id}`
  );
  return balance;
};

module.exports = {
  createAccount,
  findAccountByUserId,
  extratoByContaId,
  findAccountByEmail,
  updateBalanceAccount,
};
// atualiza o saldo da conta
