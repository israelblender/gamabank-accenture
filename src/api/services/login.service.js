const loginRepository = require("../repositories/login.repository");
const bcrypt = require('bcrypt');

const checkLogin = async(username, password)=>{
    const info_user = await loginRepository.getInformationLogin(username)

    if (info_user.length > 0){
        const password_equal = await bcrypt.compareSync(password, info_user[0].senha)

        if (password_equal) return {isValid: true, id:info_user[0].id}
        else return {isValid: false, message: 'Password Incorreto'}
    }
    else return {isValid: false, message: 'Username Inesistente'}
    
}
module.exports = { checkLogin }