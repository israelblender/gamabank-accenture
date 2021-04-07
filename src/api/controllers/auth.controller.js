const AuthService = require("../services/auth.service");
const LoginService = require("../services/login.service");

const login = async (request, h) => {
    const { username, password } = request.payload

    const login_result = await LoginService.checkLogin(username, password)

    if (login_result.is_valid) return await AuthService.sign( login_result )
    else  return h.response( AuthService.noSign(login_result) ).code(401)
}

// const validate = async (request, h) => {
//     const token = request.headers['x-access-token']

//     try {
//         const validated = await AuthService.verify(token)
//         return validated
//     } catch (error) {
//         return error
//     }
// }

module.exports = {
  login,
};
