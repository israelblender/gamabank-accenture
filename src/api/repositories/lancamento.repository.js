const database = require("../../configs/database");

const register = async (id, tipo, descricao, valor) => {
    const data = new Date();
    const register = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${id}', '${data.toLocaleDateString('en-CA')}', '${tipo}','${descricao}','${valor}')`
    );

    return register
}

const createNewLaunchDebit = async (idAccount, cpf, value) => {
    const data = new Date();
    const tipo = 'DÉBITO';
    const descricao = `Déposito em conta do correntista pelo cpf: ${cpf}`;

    const newLaunch = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${idAccount}', '${data.toLocaleDateString('en-US')}', '${tipo}','${descricao}','${value}')`
    );

    return newLaunch
}

module.exports = { register, createNewLaunchDebit };
