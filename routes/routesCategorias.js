const express = require('express')
const router = express.Router()

const {
    connection
} = require('../utils/connection.js')

const {
    eAdmin
} = require('../middleware/auth.js')

router.get('/configuracoesdecategoria', eAdmin, (req, res) => {
    res.render('../views/categorias.ejs')
})

router.post('/insertcategoria', eAdmin, async (req, res) => {
    const categoria = req.body.categoria
    let todasCategorias = await connection.promise().query(`SELECT * FROM categorias`)
    todasCategorias = todasCategorias[0]
    const categoriaExiste = todasCategorias.some((cat) => cat.s_categoria_config === categoria)

    if (categoriaExiste) {
        const response = {
            erro: true,
            mensagem: `A categoria ${categoria} já existe.`
        }

        return res.status(409).json(response)
    } else {
        try {
            const query = await connection.promise().query('INSERT INTO categorias (s_categoria_config) VALUES (?)', [categoria]);
            if (query[0].affectedRows > 0) {
                const response = {
                    error: false,
                    categoria: categoria,
                    mensagem: "Categoria criada com sucesso!"
                }

                return res.status(200).json(response)
            } else {
                const response = {
                    error: true,
                    categoria: categoria,
                    mensagem: "Houve um erro ao criar a categoria!"
                }

                return res.status(400).json(response)
            }
        } catch (erro) {
            console.error("Erro ao criar a categoria: " + erro)
        }
    }
})

router.post('/deletarcategoria/:categoria', eAdmin, async (req, res) => {
    const categoria = req.params.categoria

    try {
        let query = await connection.promise().query(`DELETE FROM categorias WHERE s_categoria_config = ?`, categoria)
        if (query[0].affectedRows > 0) {
            const response = {
                error: false,
                categoria: categoria,
                mensagem: `A categoria ${categoria} foi deletada com sucesso!`
            }

            return res.status(200).json(response)
        } else {
            const response = {
                error: true,
                categoria: categoria,
                mensagem: `Houve um erro ao deletar a categoria ${categoria}.`
            }
            
            return res.status(400).json(response)
        }
    } catch (error) {
        console.error("Erro ao deletar a categoria: " + error)
    }
})

router.put('/editarcategoria', eAdmin, async (req, res) => {
    let categoria = req.body.categoria;
    let novaCategoria = req.body.novaCategoria

    try {
        let query = await connection.promise().query(`UPDATE categorias SET s_categoria_config = '${novaCategoria}' WHERE s_categoria_config = ?`, categoria)
        if (query[0].affectedRows > 0) {
            const response = {
                error: false,
                categoria: categoria,
                mensagem: `Categoria editada com sucesso!`
            }

            return res.status(200).json(response)
        } else {
            const response = {
                error: true,
                categoria: categoria,
                mensagem: `Houve um erro ao editar a categoria ${categoria}.`
            }

            return res.status(400).json(response)
        }
    } catch (error) {
        console.error("Erro ao deletar a categoria: " + error)
    }
})
module.exports = router