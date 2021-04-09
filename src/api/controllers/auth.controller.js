const authService = require("../services/auth.service");

const login = async (request, h) => {
  const { email, senha } = request.payload;

  const login = await authService.signIn({email, senha});

  return login;
};

module.exports = {
  login,
};
