const database = require("../../configs/database");

const createNewLaunchDebit = async (id, value) => {
    const data = new Date();
    const tipo = 'DÉBITO';
    const descricao = `Déposito em conta do correntista para o cpf: ${cpf}`;

    const newLaunch = await database.execute(
        `INSERT INTO lancamentos (idConta, data, tipo, descricao, valor) VALUES ('${id}', '${data.toLocaleDateString('en-US')}', '${tipo}','${descricao}','${value}')`
    );

    return newLaunch
}

module.exports = { createNewLaunchDebit };