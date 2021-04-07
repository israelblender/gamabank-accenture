const Boom = require("@hapi/boom");
const userRepository = require("../repositories/user.repository");
const contaService = require("../services/conta.service");
const cpfHelper = require("../../helpers/cpf.helper");
const checkPassword = require("../../helpers/checkPassword");

const createUser = async (nome, cpf, email, senha, telefone) => {
  //valida cpf

  const validaCpf = await cpfHelper.validateCpf(cpf);

  if (!validaCpf) {
    console.log("CPF invalido");
    throw Boom.badRequest("CPF INVALIDO");
  }

  // verifico se usuario já existe
  const findUser = await userRepository.findUserByCpf(cpf);

  // caso exista retorno erro
  if (findUser) {
    console.log("CPF duplicado");
    throw Boom.badRequest("CPF Duplicado");
  }

  const passwordIsValid = await checkPassword(senha);

  if (!passwordIsValid) {
    throw Boom.badRequest(
      "A senha deve conter 8 dígitos, sendo pelo menos um deles, um caractere maiúsculo, um minúsculo, um caractere especial e um numero"
    );
  }
  // chamo repositorio para criação do usuario
  const user = await userRepository.createUser(
    nome,
    cpf,
    email,
    senha,
    telefone
  );

  // pego o id do usuario criado e envio para criação de conta
  const conta = await contaService.createConta(user.id);

  return {
    message: "O Usuario foi Criado com sucesso",
    id: user.id,
    idConta: conta.id,
    login: email,
  };
};

module.exports = { createUser };
