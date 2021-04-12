const transferService = require("../services/transfer.service");

const transfer = async (request, h) => {
  const { userId, accountId } = await request.auth.credentials;

  const { email, cpf, codigoBanco, value } = request.payload;

  // se informado email, a transferencia será interna
  if (email) {
    const bankTransferIntern = await transferService.transferIntern(
      userId,
      accountId,
      email,
      value
    );
    return bankTransferIntern;
  }

  // transferencia externa
  const bankTransferExtern = await transferService.transferExtern(
    userId,
    codigoBanco,
    cpf,
    value
  );
  return bankTransferExtern;
};

module.exports = { transfer };
