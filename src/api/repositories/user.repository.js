const database = require("../../configs/database");
const crypto = require("../../helpers/mycrypto");

const findUserByCpf = async (cpf) => {
  const user = await database.execute(
    `SELECT * FROM usuario WHERE cpf='${cpf}'`
  );

  // retorna primeiro registro encontrado
  return user[0];
};

const findUserById = async (id) => {
  const user = await database.execute(
    `SELECT * FROM usuario WHERE id='${id}'`
  );

  // retorna primeiro registro encontrado
  return user[0];
}

const findUserByEmail = async (email) => {
  const user = await database.execute(
    `SELECT * FROM usuario WHERE email='${email}'`
  );

  // retorna primeiro registro encontrado
  return user[0];
};

const createUser = async (nome, cpf, email, senha, telefone) => {
  const encrypt = await crypto.encryptPassword(senha, null);

  const user = await database.execute(
    `INSERT INTO usuario (nome, cpf, email, senha, telefone, salt) VALUES ('${nome}', '${cpf}','${email}','${encrypt.encryptedPassword}','${telefone}', '${encrypt.salt}');`
  );

  // retorna id do registro criado
  return { id: user.insertId };
};

module.exports = { findUserByCpf, createUser, findUserByEmail, findUserById };
