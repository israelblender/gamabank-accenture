const AuthService = require("../services/auth.service");
const LoginService = require("../services/login.service");

const login = async (request, h) => {
    const { username, password } = request.payload

    const login_result = await LoginService.check(username, password)

    if (login_result.auth) return await AuthService.sign( {user_id:login_result.user_id} )
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
