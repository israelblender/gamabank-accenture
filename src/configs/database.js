require("./bootstrap");
const mysql = require("mysql");
const Boom = require("@hapi/boom");
const { object } = require("joi");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
});

const execute = (sqlStatement) => {
  return new Promise((resolve, reject) => {
    connection.query(sqlStatement, (err, result) => {
      if (err) {
        return reject(err);
        reject(err.sqlMessage);
      } else return resolve(result);
    });
  }).catch((err) => {
    throw new Boom.badRequest(err);
  });
};

const rollback = async () => {
  const object = [
    "fatura",
    "transacoescredito",
    "lancamentos",
    "credito",
    "conta",
    "usuario",
  ];
  for (const value of object) {
    await execute(`DELETE FROM ${process.env.DB_DATABASE}.${value}`);
  }
};

module.exports = { rollback, execute };
