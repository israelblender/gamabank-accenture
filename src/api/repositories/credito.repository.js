const database = require("../../configs/database");

const findCreditoByIdConta = async (idConta) => {
  const credito = await database.execute(
    `SELECT * FROM credito WHERE idConta='${idConta}'`
  );

  return credito[0];
};

const createCredito = async (idConta) => {
  const limite = 200;
  const limiteDisponivel = 200;

  const credito = await database.execute(
    `INSERT INTO credito ( idConta, limite, limiteDisponivel) VALUES ('${idConta}', ${limite},${limiteDisponivel});`
  );

  // retorna o id do registro criado

  return { id: credito.insertId };
  };

const getAvaliableCredit = async (accoutId) =>{
  const credit = await database.execute(
    `SELECT * FROM credito WHERE idConta= ${accoutId}`
  )
  return credit[0]
}
const updateAvaliableCredit = async (accoutId, new_avaliable_credit) =>{
  const credit = await database.execute(
    `UPDATE credito SET limiteDisponivel=${new_avaliable_credit} WHERE idConta= ${accoutId}`
  )
  return credit
}

const addTransaction = async (invoiceId, date, description, value)=>{
  const transaction = await database.execute(
    `INSERT INTO transacoesCredito(idFatura, data, descricao, valor)
    VALUES (${invoiceId}, '${date}', '${description}', ${value})`
  )
  return transaction
}

module.exports = { 
  createCredito, 
  findCreditoByIdConta, 
  getAvaliableCredit, 
  updateAvaliableCredit,
  addTransaction
 };
