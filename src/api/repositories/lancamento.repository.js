const database = require("../../configs/database");

const register = async (id, descricao ,valor) => {
    const data = new Date();
    const tipo = 'TRANSFERENCIA';

    const register = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${id}', '${data.toLocaleDateString('en-CA')}', '${tipo}','${descricao}','${valor}')`
    );

    return register
}

const createNewLaunchPay = async (id, cpf, value) => {
    const data = new Date();
    const tipo = 'PAGAMENTO';
    const descricao = `Pagamento em débito pelo cpf: ${cpf}`;

    const newLaunch = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${id}', '${data.toLocaleDateString('en-US')}', '${tipo}','${descricao}','${value}')`
    );

    return newLaunch
}

module.exports = { register, createNewLaunchPay };
