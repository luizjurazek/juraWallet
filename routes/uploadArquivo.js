const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({
    dest: './uploads'
})
const csv = require('csv-parser');
const fs = require('fs');

const {
    eAdmin
} = require('../middleware/auth.js')

const {
    connection
} = require('../connection.js')

router.post('/importartransacoes', eAdmin, upload.single('csvFile'), async (req, res) => {
    const results = [];
    let csvFilePath;

    if (!req.file) {
        return res.status(400).json({
            error: true,
            message: 'Nenhum arquivo CSV enviado'
        });
    }

    if (!req.file.path) {
        return res.status(400).json({
            error: true,
            message: 'Nenhum arquivo CSV enviado'
        });
    } else {
        csvFilePath = req.file.path;
    }

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const jsonData = results;
            gravarTransacaoMassivas(jsonData).then(message => {
                res.json({
                    error: false,
                    message: message,
                    data: jsonData
                });
            }).catch(err => {
                res.json({
                    error: true,
                    message: message
                });
            })

        })
});

async function gravarTransacaoMassivas(data) {
    try {
        let i;
        for (i = 0; i < data.length; i++) {
            await connection.promise().query(`INSERT INTO transacoes (s_nome_transacoes, s_categoria_transacoes, i_valor_transacoes, s_tipo_transacoes, dt_data_transacoes) 
            VALUES (?, ?, ?, ?, ?)`, [data[i].nome_transacao, data[i].categoria_transacao, data[i].valor_transacao, data[i].tipo_transacao, data[i].data_transacao]);
        }
        return "Inserções realizadas com sucesso";
    } catch (error) {
        console.error("Erro ao gravar transações massivas:", error);
        return "Ocorreu um erro ao inserir as transações.";
    }
}

module.exports = router