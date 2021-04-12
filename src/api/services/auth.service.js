const JWT = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");
const accountRepository = require("../repositories/account.repository");
const bcrypt = require("../../helpers/mycrypto");

const Boom = require("@hapi/boom");
const secret = process.env.SECRET;

const generate = (userData) =>
  new Promise((resolve) => {
    JWT.sign(
      userData,
      secret,
      { algorithm: "HS256", expiresIn: "20m" },
      (err, token) => {
        if (err) {
          throw new Error("ERR_INVALID_TOKEN");
        }

        resolve(token);
      }
    );
  });

const signIn = async ({ email, senha }) => {
  const findUser = await userRepository.findUserByEmail(email);

  if (!findUser) {
    // erro
    throw Boom.forbidden("Usuario não encontrado");
  }

  const passwordIsValid = await bcrypt.comparePassword(
    senha,
    findUser.salt,
    findUser.senha
  );

  if (!passwordIsValid) {
    throw Boom.forbidden("Senha incorreta");
  }

  const userAccount = await accountRepository.findAccountByUserId(findUser.id);

  const userData = {
    userId: findUser.id,
    accountId: userAccount.id,
  };

  const token = await generate(userData);

  return {
    message: "Login efetuado com sucesso",
    token: token,
  };
};

const validate = async (decoded) => {
  const { userId } = decoded;

  const user = await userRepository.findUserById(userId);

  if (!user) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};

module.exports = { signIn, validate };
