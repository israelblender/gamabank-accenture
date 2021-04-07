const Jwt = require('jsonwebtoken')
const Config = require('../../Configs/env')

const sign = async object => {

    const token = Jwt.sign(object, Config.secret, { algorithm: Config.algorithm, expiresIn: Config.token_exp })

    return { auth: true, token }
}
const noSign = (object) =>{
    if (object) return object
    return {
        auth: false,
        message: 'Failed to autentication username or password'
    }
}

const verify = async (token) => {
    return new Promise((resolve, reject) => {
        Jwt.verify(token, Config.secret, (err, decoded) => {

            if(err) reject({ auth: false, message: 'Failed to autentication'})
            resolve({auth: true, data: decoded })
        })
    })
}

module.exports = { sign, noSign, verify }