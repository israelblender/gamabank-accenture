const database = require("../../configs/database");

const findContaByUserId = async (idUsuario) => {
  const account = await database.execute(
    `SELECT * FROM conta WHERE idUsuario='${idUsuario}'`
  );

  // retorna o primeiro usuario encontrado
  return account[0];
};

const findContaByUserEmail = async (emailUsuario) => {
  const user = await database.execute(
    `SELECT * FROM usuario WHERE email='${emailUsuario}'`
  );

  return user[0];
};

const createConta = async (idUsuario) => {
  const saldo = 0;
  const dateAbertura = new Date();
  const dateAberturaFormated = dateAbertura.toISOString().split("T")[0];
  const create = await database.execute(
    `INSERT INTO conta ( idUsuario, saldo, dateAbertura) VALUES ('${idUsuario}', ${saldo},'${dateAberturaFormated}');`
  );

  return { id: create.insertId };
};

const extratoByContaId = async (userId, dt_inicial, dt_final) => {
  const conta = await findContaByUserId(userId);

  console.log(conta);

  const sqlStatement = `SELECT data, descricao, tipo, valor FROM transacoes WHERE idConta = ${conta.id} AND data BETWEEN ${dt_inicial} AND ${dt_final} ORDER BY data DESC`;

  const result = await database.execute(sqlStatement);

  return result;
};

const updateBalanceAccount = async (id, value) => {
  const balance = await database.execute(
    `UPDATE conta SET saldo = ${value} WHERE idUsuario = '${id}'`
  );
  return balance;
};

module.exports = {
  createConta,
  findContaByUserId,
  extratoByContaId,
  findContaByUserEmail,
  updateBalanceAccount,
};
// atualiza o saldo da conta
