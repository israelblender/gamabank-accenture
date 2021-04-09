

module.exports = {
    env: process.env.NODE_ENV || 'Producao',
    secret: process.env.JWT_SECRET || 'Shu7UUp0RsHutD0wN',
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 80
}