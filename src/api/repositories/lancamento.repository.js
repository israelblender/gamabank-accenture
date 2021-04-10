const database = require("../../configs/database");

const register = async (id, tipo, descricao ,valor) => {
    const data = new Date();

    const register = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${id}', '${data.toLocaleDateString('en-CA')}', '${tipo}','${descricao}','${valor}')`
    );

    return register
}

const extratoByContaId = async (accountId, dt_inicial, dt_final) => {

    const sqlStatement = `SELECT data, tipo, descricao, valor FROM lancamentos WHERE idConta = ${accountId} AND data BETWEEN '${dt_inicial}' AND '${dt_final}' ORDER BY data DESC`
    const result = await database.execute(sqlStatement)

    return result
}

const createNewLaunchPay = async (idAccount, cpf, value) => {
    const data = new Date();
    const tipo = 'DÉBITO';
    const descricao = `Pagamento débito em conta`;

    const newLaunch = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${idAccount}', '${data.toLocaleDateString('en-CA')}', '${tipo}','${descricao}','${value}')`
    );
    return newLaunch
}

const createNewLaunchDebit = async (idAccount, value) => {
    const data = new Date();
    const tipo = 'CRÉDITO';
    const descricao = `Déposito em conta do correntista`;

    const newLaunch = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${idAccount}', '${data.toLocaleDateString('en-CA')}', '${tipo}','${descricao}','${value}')`
    );

    return newLaunch
}

module.exports = { register, createNewLaunchPay, createNewLaunchDebit, extratoByContaId };
