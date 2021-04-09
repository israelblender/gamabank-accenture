const database = require("../../configs/database");

const findContaByUserId = async (idUsuario) => {
  const account = await database.execute(
    `SELECT * FROM conta WHERE idUsuario='${idUsuario}'`
  );

  // retorna o primeiro usuario encontrado
  return account[0];
};

const createConta = async (idUsuario) => {
  const saldo = 0;
  const dateAbertura = new Date();

  const create = await database.execute(
    `INSERT INTO conta ( idUsuario, saldo, dateAbertura) VALUES ('${idUsuario}', ${saldo},'${dateAbertura.toLocaleDateString()}');`
  );

  return { id: create.insertId };
};

const extratoByContaId = async (userId, dt_inicial, dt_final) => {

    const conta = await findContaByUserId(userId);

    console.log(conta)

    const sqlStatement = `SELECT data, descricao, tipo, valor FROM transacoes WHERE idConta = ${conta.id} AND data BETWEEN ${dt_inicial} AND ${dt_final} ORDER BY data DESC`

    const result = await database.execute(sqlStatement)
    
    return result
}

module.exports = { createConta, findContaByUserId, extratoByContaId };
