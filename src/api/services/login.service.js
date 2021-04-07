const loginRepository = require("../repositories/login.repository");
const bcrypt = require('bcrypt');

const check = async(username, password)=>{
    const info_user = await loginRepository.getInformationLogin(username.toLowerCase())

    if (info_user.length > 0){
        const password_equal = await bcrypt.compareSync(password, info_user[0].senha)

        if (password_equal) return {is_valid: true, user_id:info_user[0].id}
        else return {is_valid: false, message: 'Password Incorreto'}
    }
    else return {is_valid: false, message: 'Username Inesistente'}
    
}
module.exports = { check }