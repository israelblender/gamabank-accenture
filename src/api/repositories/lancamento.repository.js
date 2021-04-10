const database = require("../../configs/database");

const register = async (id, descricao ,valor) => {
    const data = new Date();
    const tipo = 'TRANSFERENCIA';

    const register = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${id}', '${data.toLocaleDateString('en-CA')}', '${tipo}','${descricao}','${valor}')`
    );

    return register
}

const extratoByContaId = async (accountId, dt_inicial, dt_final) => {

    const sqlStatement = `SELECT data, tipo, descricao, valor FROM lancamentos WHERE idConta = ${accountId} AND data BETWEEN '${dt_inicial.toString()}' AND '${dt_final.toString()}' ORDER BY data ASC`
    const result = await database.execute(sqlStatement)

    return result
}

module.exports = { register, extratoByContaId };
