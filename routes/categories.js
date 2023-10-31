const express = require('express')
const router = express.Router()

const {
    connection
} = require('../connection.js')

const {
    eAdmin
} = require('../middleware/auth.js')

router.get('/controlecategorias', eAdmin, (req, res) => {
    res.render('../views/categorias.ejs')
})

router.post('/insertcategoria', eAdmin, async (req, res) =>{
    const categoria = req.body.categoria
    console.log(categoria)
    try {
        const query = await connection.promise().query('INSERT INTO categorias (s_categoria_config) VALUES (?)', [categoria]);
        if (query[0].affectedRows > 0) {
            return res.status(200).json({
                error: false,
                mensagem: "Categoria criada com sucesso!"
            })
        } else {
            return res.status(400).json({
                error: true,
                mensagem: "Houve um erro ao criar a categoria!"
            })
        }
    } catch (erro){
        console.error("Erro ao criar a categoria: " + erro)
    }
})

module.exports = router