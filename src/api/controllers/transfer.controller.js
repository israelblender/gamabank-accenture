const transferService = require("../services/transfer.service");

const transfer = async (request, h) => {
    
    const { userId, accountId } = await request.auth.credentials;

    const { email, cpf, codigoBanco, valor } = request.payload;

    if(email){
        const bankTransferIntern = await transferService.transferIntern(userId, accountId, email, valor);
        return bankTransferIntern
    }
    
    const bankTransferExtern = await transferService.transferExtern(userId, codigoBanco, cpf, valor);
    return bankTransferExtern
}

module.exports = { transfer }