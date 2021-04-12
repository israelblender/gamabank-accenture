const lancamentoService = require("../services/lancamento.service")
const contaRepository = require("../repositories/conta.repository");

const extrato = async (request, h) => {

    const payload = request.payload
    
    const dt_inicial = payload.data_inicial
    const dt_final = payload.data_final
    let extrato
  
    const { accountId, userId } = await request.auth.credentials

    conta = await contaRepository.findContaByUserId(userId)

    if (!dt_inicial && !dt_final) {
        result_extrato = await lancamentoService.extratoService(accountId, new Date().toLocaleDateString('en-CA'), new Date().toLocaleDateString('en-CA'))
        extrato = {
            lancamentos: result_extrato,
            saldo: conta.saldo
        }
    } else {
        result_extrato = await lancamentoService.extratoService(accountId, dt_inicial, dt_final)
        extrato = {
            lancamentos: result_extrato,
            saldo: conta.saldo
        }
    }
  
    return extrato
}

module.exports = { extrato };