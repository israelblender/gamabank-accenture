const transferService = require("../services/transfer.service");

const transfer = async (request, h) => {
    
    const { userId } = await request.auth.credentials;

    const { email, cpf, codigoBanco, valor } = request.payload;

    if(email){
        const bankTransferIntern = await transferService.transferIntern(userId, email, valor);
        return bankTransferIntern
    }
    
    const bankTransferExtern = await transferService.transferExtern(userId, codigoBanco, cpf, valor);
    return bankTransferExtern
}

module.exports = { transfer }