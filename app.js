const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



const app = express()


const { eAdmin } = require('./middleware/auth.js')

app.use(express.json())

app.get('/', eAdmin,async (req, res) =>{
    return res.json({
        erro: false,
        mensagem: "Listar usuários",
        id_usuario_logado: req.userId
    })
})

app.post('/cadastrar', async (req, res) =>{
    // $2a$08$tkx07l5UK3dRs5fVxS5Rr.5o7IrC9hCr10NIIEf0MHucxHB4TRpOa
    const password = await bcrypt.hash("1234567", 8)

    console.log(password);
    return res.json({
        erro: false,
        mensagem: "Cadastrar usuário"
    });
})

app.post('/login', async (req, res) =>{
    console.log(req.body)

    if(req.body.email != "luizjurazek@gmail.com"){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro usuário ou senha incorreto! Email incorreto"
        })
    }


    // primeira password vem da requisição, a segunda deve ser a senha que foi criptográfada no banco de dados 
    if(!(await bcrypt.compare(req.body.password, "$2a$08$tkx07l5UK3dRs5fVxS5Rr.5o7IrC9hCr10NIIEf0MHucxHB4TRpOa"))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro usuário ou senha incorreto! Senha incorreta"
        })
    }

    const token = jwt.sign({id: 2}, "D5JKJA851JIJKPOIUD987985HUHKKNBYGSYDHJ5654",{
        // expiresIn: 600 // 10 min
        // expiresIn: '7d' // 7 dias
        expiresIn: 60 // 1 minuto
    })

    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso!",
        token
    });
})


app.listen(8080, ()=> {
    console.log("Servidor rodando na porta 8080: http://localhost:8080/")
});