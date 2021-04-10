const invoiceService = require("../services/fatura.service")

const openInvoices = async (request, h) => {
    const { userId } = await request.auth.credentials;
    const { cpf,  value } = request.payload;

    invoiceService.findOpenInvoice(userId)
}

module.exports = {openInvoices}