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
    getStatsGeral,
    getStatsMes
} = require('../funcStats.js')


router.get('/stats', eAdmin, async (req, res) => {
    const query = await connection.promise().query('SELECT * FROM transacoes')
    const results = query[0]

    const statsGeral = getStatsGeral(results)
    const statsPorMes = getStatsMes(results)
    console.log(statsPorMes)
    res.json(statsPorMes)
})

module.exports = router