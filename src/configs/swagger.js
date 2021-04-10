const inert = require("@hapi/inert");
const vision = require("@hapi/vision");
const hapiswagger = require('hapi-swagger')

const swagger = {
    plugin: hapiswagger,
    options: {
      info: {
        title: 'Gamabank - NoDesign',
        description: 'Nossa Fintech tem objetivo simplificar a vida dos nossos clientes, todos os problemas são resolvidos dentro da aplicação acabando com filas e aglomerações.',
        version: '1.0'
      }
    }
  }

module.exports = [inert, vision, swagger]