const express = require('express')
const router = express.Router()

// Database 
const {
    connection
} = require('../utils/connection.js')

// Auxiliares
const {
    eAdmin
} = require('../middleware/auth.js')

const {
    entradaSaidaPorMes,
    somaCategoria,
    entradaSaidaPorDia
} = require('../utils/funcStats.js')

let userId;

router.get('/statsmesesdoano', eAdmin, async (req, res) => {
    userId = req.userId
    const query = await connection.promise().query(`SELECT * FROM transacoes_${userId} ORDER BY dt_data_transacoes`)
    const results = query[0]

    const entradaSaidaMes= entradaSaidaPorMes(results)
    const saidaPorCategoria = somaCategoria(results)

    const response = {
        entradaSaidaMes,
        saidaPorCategoria
    }

    res.json(response)
})

router.get('/statscategoriapormes/:mes/:ano', eAdmin, async (req, res) => {
    userId = req.userId
    let mes = (req.params.mes.length === 1) ? "0" + req.params.mes : req.params.mes;
    let ano = (req.params.ano >= 2001 && req.params.ano <= 2100) ? req.params.ano : null;
    
    const query = await connection.promise().query(`SELECT * FROM transacoes_${userId} WHERE DATE_FORMAT(dt_data_transacoes, '%Y-%m') = '${ano}-${mes}' ORDER BY dt_data_transacoes`);
    const results = query[0]
    
    const entradaSaidaDia= entradaSaidaPorDia(results)
    const saidaPorCategoria = somaCategoria(results)
    
    const response = {
        entradaSaidaDia,
        saidaPorCategoria
    }
    res.json(response)
})

module.exports = router