const express = require('express')
const router = express.Router()

// Database 
const {
    connection
} = require('../connection.js')

// Auxiliares
const {
    eAdmin
} = require('../middleware/auth.js')

const {
    separarTransacaoPorTipo
} = require('../funcAuxiliares')

router.get('/home', eAdmin, async (req, res) => {
    res.render('../views/home.ejs')
});

router.get('/pagenotfound', eAdmin, async (req, res) => {
    res.render('../views/naoAutorizadoPage.ejs')
});


router.get('/listartodastransacoes', eAdmin, async (req, res) => {
    connection.query('SELECT * FROM transacoes', function (err, results, fields) {
        if (err) {
            console.error("Erro ao listar as transacoes: " + err)
            return res.status(400).json({
                error: true,
                mensagem: "Houve um erro ao listar as transacoes!"
            })
        } else {
            const query = results
            const transacaoPorTipo = separarTransacaoPorTipo(query)
            return res.status(200).json({
                error: false,
                id_usuario_logado: req.userId,
                quantidadeDeTransacoes: query.length,
                transacoes: query,
                entradas: transacaoPorTipo[0],
                saidas: transacaoPorTipo[1]
            })
        }
    })
})

router.get('/listartransacaopordata/:mes/:ano', eAdmin, async (req, res) => {
    let mes = (req.params.mes.length === 1) ? "0" + req.params.mes : req.params.mes;;
    let ano = (req.params.ano >= 2001 && req.params.ano <= 2100) ? req.params.ano : null;
    if (mes > 0 && mes < 13) {
        try {
            const query = await connection.promise().query(`SELECT * FROM transacoes WHERE DATE_FORMAT(dt_data_transacoes, '%Y-%m') = '${ano}-${mes}'`)
            if (query[0] != "") {
                const result = query[0]
                console.log(result)
                const transacaoPorTipo = separarTransacaoPorTipo(result)
                return res.status(200).json({
                    error: false,
                    id_usuario_logado: req.userId,
                    quantidadeDeTransacoes: result.length,
                    transacoes: result,
                    entradas: transacaoPorTipo[0],
                    saidas: transacaoPorTipo[1]
                })

                // return res.status(200).json(response)
            } else if (query[0] == "") {
                const response = {
                    error: true,
                    mensagem: `Não foram encontradas transações referentes ao mês ${mes} e ano ${ano}`
                }


                return res.status(400).json(response)
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                err: true,
                mensagem: 'Erro interno do servidor',
            });
        }
    } else {
        return res.status(400).json({
            error: true,
            mensagem: "Insira mês e ano válidos!"
        })
    }

})

router.get('/listartransacao', eAdmin, async (req, res) => {
    let id = req.body.id
    try {
        const query = await connection.promise().query(`SELECT * FROM transacoes WHERE id_transacoes = ?`, id)
        if (query[0] != "") {
            return res.status(200).json({
                error: false,
                transacoes: query[0]
            })
        } else if (query[0] == "") {
            return res.status(400).json({
                error: true,
                mensagem: "Transacação não encontrada!"
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

router.post('/criartransacao', eAdmin, async (req, res) => {
    let nome = req.body.nome;
    let categoria = req.body.categoria;
    let valor = req.body.valor;
    let tipoTransacao = req.body.tipo;
    let data = req.body.data;

    try {
        const query = await connection.promise().query(`INSERT INTO transacoes (s_nome_transacoes, s_categoria_transacoes, i_valor_transacoes, s_tipo_transacoes, dt_data_transacoes) 
        VALUES ("${nome}", "${categoria}", ${valor}, "${tipoTransacao}" , "${data}")`)


        if (query[0].affectedRows > 0) {
            return res.status(200).json({
                error: false,
                mensagem: "Transação criada com sucesso!"
            })
        } else {
            return res.status(400).json({
                error: true,
                mensagem: "Houve um erro ao criar a transação!"
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

router.post('/editartransacao', eAdmin, async (req, res) => {
    let id = req.body.id;
    let nome = req.body.nome;
    let categoria = req.body.categoria;
    let valor = req.body.valor;
    let tipoTransacao = req.body.tipo;
    let data = req.body.data;
    try {
        const query = await connection.promise().query(`UPDATE transacoes SET s_nome_transacoes = "${nome}", s_categoria_transacoes = "${categoria}",
         i_valor_transacoes = ${valor}, s_tipo_transacoes = "${tipoTransacao}",dt_data_transacoes = "${data}" WHERE id_transacoes = ?`, id)

        if (query[0].affectedRows > 0) {
            return res.status(200).json({
                error: false,
                mensagem: "Transação editada com sucesso!"
            })
        } else {
            return res.status(400).json({
                error: true,
                mensagem: "Houve um erro ao editada a transação!"
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

router.post('/deletartransacao/:id', eAdmin, async (req, res) => {
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

module.exports = router