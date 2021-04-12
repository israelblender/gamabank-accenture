const lancamentoService = require("../services/lancamento.service");
const contaRepository = require("../repositories/account.repository");

const extrato = async (request, h) => {
  const payload = request.payload;

  const dt_inicial = payload.data_inicial;
  const dt_final = payload.data_final;
  let extrato;

  const { accountId, userId } = await request.auth.credentials;

  //Saldo deve exibir movimentos do dia + saldo disponivel
  //Data Final não pode ser superior a data atual
  //Limite do extrato é de 3 meses
  const conta = await contaRepository.findAccountByUserId(userId);

  if (!dt_inicial && !dt_final) {
    result_extrato = await lancamentoService.getExtract(
      accountId,
      new Date().toLocaleDateString(),
      new Date().toLocaleDateString()
    );
    extrato = {
      lancamentos: result_extrato,
      saldo: conta.saldo,
    };
  } else {
    result_extrato = await lancamentoService.getExtract(
      accountId,
      dt_inicial,
      dt_final
    );
    extrato = {
      lancamentos: result_extrato,
      saldo: conta.saldo,
    };
  }

  return extrato;
};

module.exports = { extrato };
