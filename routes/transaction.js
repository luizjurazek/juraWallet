const e = require('express')
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


// router.get('/home', eAdmin, async (req, res) => {
//     if (req.acessoPermitido) {
//         // O acesso é permitido, renderize a página "home.ejs"
//         res.render('../views/home.ejs');
//     } else {
//         // O acesso não é permitido, verifique o código de status
//         if (res.statusCode === 400) {
//             // Código de status 400 indica que o acesso foi negado
//             res.render('../views/naoautorizadopage.ejs');
//         } else {
//             // Outros códigos de status podem ser tratados aqui
//             // Por exemplo, redirecionar para uma página de erro padrão
//             res.redirect('/erro');
//         }
//     }
// });

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

    if(mes > 0 && mes < 13){
        try {
            const query = await connection.promise().query(`SELECT * FROM transacoes WHERE DATE_FORMAT(dt_data_transacoes, '%Y-%m') = '${ano}-${mes}'`)
            if (query[0] != "") {
                console.log(query[0])
                const transacaoPorTipo = separarTransacaoPorTipo(query[0]) 
                const response = {
                    error: false,
                    mes: mes,
                    ano: ano,
                    quantidadeDeTransacoes: query[0].length,
                    todasTransacoes: query[0],
                    entradas: transacaoPorTipo[0],
                    saidas: transacaoPorTipo[1]
                }

                return res.status(200).json(response)
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

router.put('/editartransacao', eAdmin, async (req, res) => {
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

router.delete('/deletartransacao/:id', eAdmin, async (req, res) => {
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