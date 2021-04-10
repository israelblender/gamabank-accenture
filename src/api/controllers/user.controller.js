const userService = require("../services/user.service");

const store = async (request, h) => {
  const { nome, cpf, email, senha, telefone } = request.payload;

  // envio para o service dados do usuario
  
  const createConta = await userService.createUser(
    nome,
    cpf,
    email,
    senha,
    telefone
  );

  return createConta;
};

module.exports = { store };
