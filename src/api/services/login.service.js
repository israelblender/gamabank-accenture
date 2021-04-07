const loginRepository = require("../repositories/login.repository");
const bcrypt = require('bcrypt');

const check = async(username, password)=>{
    const info_user = await loginRepository.getLogin(username.toLowerCase())

    if (info_user.length > 0){
        const password_equal = await bcrypt.compareSync(password, info_user[0].senha)

        if (password_equal) return {auth: true, user_id:info_user[0].id}
        else return {auth: false, message: "Failed to autentication password"}
    }
    else return {auth: false, message: "Failed to autentication username"}
    
}
module.exports = { check }