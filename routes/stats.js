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
    getStatsMes
} = require('../funcStats.js')


router.get('/gastospormes', eAdmin, async (req, res) => {
    const query = await connection.promise().query('SELECT * FROM transacoes')
    const results = query[0]

    const statsPorMes = getStatsMes(results)

    res.json(statsPorMes)
})

module.exports = router