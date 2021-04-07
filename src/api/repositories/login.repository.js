const database = require('../../configs/database')

const getLogin = async(username)=>{//Chega dados se dados fornecidos de usuário são válidos
    const result = await database.execute(
      `select id, senha, salt from usuario where email='${username}'`
    );
    return result
  }
module.exports = { getLogin }