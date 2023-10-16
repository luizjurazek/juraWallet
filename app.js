const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()

// Database 
const {
    connection
} = require('./connection.js')

// Auxiliares
const {
    eAdmin
} = require('./middleware/auth.js')
const {
    gerarStringAleatoria
} = require('./funcAuxiliares.js')

// Middlewares
app.use(express.json())

app.get('/listartransacoes', eAdmin, async (req, res) => {
    connection.query('SELECT * FROM transacoes', function (err, results, fields) {
        if (err) {
            console.error("Erro ao listar as transacoes: " + err)
            return res.status(400).json({
                error: true,
                mensagem: "Houve um erro ao listar as transacoes!"
            })
        } else {
            const query = results
            return res.status(200).json({
                error: false,
                id_usuario_logado: req.userId,
                transacoes: query
            })
        }
    })
})

app.delete("/deletartransacao/:id", eAdmin, async (req, res) => {
    const id = req.params.id
    try {
        const query = await connection.promise().query(`DELETE FROM transacoes WHERE id_transacoes = ?`, id)

        if (query[0].affectedRows > 0) {
            return res.status(200).json({
                error: false,
                mensagem: "Transação de id " + id + " deletada com sucesso!"
            })
        } else {
            return res.status(400).json({
                error: true,
                mensagem: "Houve um erro ao deletar o item"
            })
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            err: true,
            mensagem: 'Erro interno do servidor',
        });
    }
})

app.post('/cadastrar', async (req, res) => {
    const username = req.body.username
    const password = await bcrypt.hash(req.body.password, 8)
    const email = req.body.email
    const name = req.body.name

    connection.query(`INSERT INTO users(s_user_users, s_password_users, s_email_users, s_nome_users) VALUES 
    ("${username}", "${password}", "${email}", "${name}")`, (err) => {
        if (err) {
            console.error("Erro ao cadastrar o usuário: " + err)
            return res.status(400).json({
                error: true,
                mensagem: "Erro ao cadastrar o usuário!"
            })
        } else {
            return res.status(200).json({
                error: false,
                mensagem: "Usuário cadastrado com sucesso!"
            })
        }
    })
})

app.post('/login', async (req, res) => {
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
                mensagem: "Erro usuário ou senha incorreto! Senha incorreta"
            })
        }

        // const secretKey = gerarStringAleatoria(10)
        const token = jwt.sign({
            id: user.id_user_users
        }, "CHAVE_SECRETA", {
            expiresIn: '7d' // 7 dias
        })

        return res.json({
            error: false,
            message: 'Login realizado com sucesso!',
            token,
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            err: true,
            mensagem: 'Erro interno do servidor',
        });
    }
})


app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080/")
});