const { extratoByContaId } = require('../repositories/conta.repository')

const extrato = async (request, h) => {

    const payload = request.payload
    
    const dt_inicial = payload.data_inicial || new Date()
    const dt_final = payload.data_final || new Date()
  
    const { userId } = await request.auth.credentials
  
    extratoByContaId(userId, dt_inicial, dt_final)
    .then(onSuccess => console.log(onSuccess)) //resolve
    .catch(onError => console.log(onError)) //reject
  
    return {
        data_ocorrencia: '2021-04-01',
        tipo_ocorrencia: 'C',
        descricao_ocorrencia: 'Depósito em conta',
        valor_ocorrencia: 150.0
    }
}

module.exports = { extrato };