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
    entradaEsaidaPorMesDoAno,
    somaCategoriaPorMes
} = require('../funcStats.js')


router.get('/statsmesesdoano', eAdmin, async (req, res) => {
    const query = await connection.promise().query('SELECT * FROM transacoes')
    const results = query[0]

    const objectEntSaiPorMesDoAno = entradaEsaidaPorMesDoAno(results)
    console.log(objectEntSaiPorMesDoAno)
    res.json(objectEntSaiPorMesDoAno)
})

router.get('/statscategoriapormes/:mes/:ano', eAdmin, async (req, res) => {
    let mes = (req.params.mes.length === 1) ? "0" + req.params.mes : req.params.mes;
    let ano = (req.params.ano >= 2001 && req.params.ano <= 2100) ? req.params.ano : null;
    
    const query = await connection.promise().query(`SELECT * FROM transacoes WHERE DATE_FORMAT(dt_data_transacoes, '%Y-%m') = '${ano}-${mes}'`);
    const results = query[0]
    const somaPorCategoria = somaCategoriaPorMes(results)

    console.log(somaPorCategoria)
    res.json(somaPorCategoria)
})

module.exports = router