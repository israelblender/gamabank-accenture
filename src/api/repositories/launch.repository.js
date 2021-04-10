const database = require("../../configs/database");

const createNewLaunchDebit = async (cpf, value) => {
    const data = new Date();
    const tipo = 'DÉBITO';
    const descricao = `Déposito em conta do correntista pelo cpf: ${cpf}`;

    const newLaunch = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${id}', '${data.toLocaleDateString('en-US')}', '${tipo}','${descricao}','${value}')`
    );

    return newLaunch
}

const createNewLaunchPay = async (cpf, value) => {
    const data = new Date();
    const tipo = 'PAGAMENTO';
    const descricao = `Pagamento em débito pelo cpf: ${cpf}`;

    const newLaunch = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${id}', '${data.toLocaleDateString('en-US')}', '${tipo}','${descricao}','${value}')`
    );

    return newLaunch
}

module.exports = { createNewLaunchDebit, createNewLaunchPay };