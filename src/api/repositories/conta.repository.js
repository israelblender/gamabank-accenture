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

  const create = await database.execute(
    `INSERT INTO conta ( idUsuario, saldo, dateAbertura) VALUES ('${idUsuario}', ${saldo},'${dateAbertura.toLocaleDateString()}');`
  );

  return { id: create.insertId };
};

// atualiza o saldo da conta
const updateBalanceAccount = async (userId, value) => {
  const balance = await database.execute(
    `UPDATE conta SET saldo = ${value} WHERE idUsuario = '${userId}'`
  )
  return balance
}

module.exports = { createConta, findContaByUserId, findContaByUserEmail, updateBalanceAccount };
