const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET
// Database 
const {
    connection
} = require('../utils/connection.js')

const {
    createTableTransactions
} = require('../utils/funcBD.js')

const {
    logout
} = require('../middleware/auth.js')

router.get('/logout', logout);


router.get('/', async (req, res) => {
    res.render('../views/login.ejs')
})

router.get('/cadastrar', (req, res) => {
    res.render('../views/cadastro.ejs')
})

router.post('/cadastrar', async (req, res) => {
    const username = req.body.username
    const password = await bcrypt.hash(req.body.password, 8)
    const email = req.body.email
    const name = req.body.name

    connection.query(`INSERT INTO users(s_user_users, s_password_users, s_email_users, s_nome_users) VALUES 
    ("${username}", "${password}", "${email}", "${name}")`, (err, results) => {
        if (err) {
            console.error("Erro ao cadastrar o usuário: " + err)
            return res.status(400).json({
                error: true,
                mensagem: "Erro ao cadastrar o usuário!"
            })
        } else {
            const userId = results.insertId
            createTableTransactions(userId)
            return res.status(200).json({
                error: false,
                mensagem: "Usuário cadastrado com sucesso!"
            })
        }
    })
})

router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body

    try {
        const [rows] = await connection.promise().query(`SELECT * FROM users WHERE s_email_users = ?`, [email])

        // Verifica se o usuário foi encontrado
        if (rows.length === 0) {
            return res.status(400).json({
                error: true,
                mensagem: "Usuário não encontrado!"
            })
        }
        // Verificando a senha do usuário
        const user = rows[0]
        if (!(await bcrypt.compare(password, user.s_password_users))) {
            return res.status(400).json({
                erro: true,
                mensagem: "Erro usuário ou senha incorreto!"
            })
        }

        const seteDiasEmMilissegundos = 7 * 24 * 60 * 60 * 1000;
        const token = jwt.sign({
            id: user.id_user_users
        }, JWT_SECRET, {
            expiresIn: seteDiasEmMilissegundos // 7 dias
        })

        const response = {
            error: false,
            nomeUsuario: user.s_nome_users,
            message: 'Login realizado com sucesso!',
            autenticacao: {
                token,
                expiresIn: seteDiasEmMilissegundos,
                id: user.id_user_users
            },
        }

        return res.status(200).json(response)

    } catch (err) {
        const response = {
            err: true,
            mensagem: 'Erro interno do servidor',
        }
        return res.status(500).json(response);
    }
})

module.exports = router