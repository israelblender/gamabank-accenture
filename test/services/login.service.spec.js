const chai = require("chai")

const loginService = require('../../src/api/services/login.service')

const assert = chai.assert
const expect = chai.expect

describe('Teste API login.service', ()=>{
    it("Deve aprovar autenticação", async ()=>{
        const login = await loginService.check('ISRAELGOMES.PROG@gmail.com', 'blender3d')
        assert.isTrue(login.is_valid)
    })
    it("Deve reprovar autenticação", async ()=>{
        const login = await loginService.check('ISRAELGOMES.PROG@gmail.com', 'blender3d--')
        assert.isNotTrue(login.is_valid)
    })
    it("Deve retornar objeto", async ()=>{
        const login = await loginService.check('ISRAELGOMES.PROG@gmail.com', 'blender3d')
        assert.isObject(login)
    })
    it("Deve conter as propriedades de aprovação", async ()=>{
        const login = await loginService.check('ISRAELGOMES.PROG@gmail.com', 'blender3d')
        assert.hasAllKeys(login, ['is_valid', 'user_id'])
    })
    it("Deve conter as propriedades de reprovação", async ()=>{
        const login = await loginService.check('ISRAELGOMES.PROG@gmail.com', 'blender3d--')
        assert.hasAllKeys(login, ['is_valid', 'message'])
    })
})