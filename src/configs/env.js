

module.exports = {
    env: process.env.NODE_ENV,
    secret: process.env.JWT_SECRET || 'Shu7UUp0RsHutD0wN',
    token_exp: process.env.TOKEN_EXPIRATION_TIME || 300,
    algorithm: process.env.ALGORITHM || 'HS256'
}