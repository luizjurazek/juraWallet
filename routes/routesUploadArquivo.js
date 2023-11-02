const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({
    dest: './uploads'
})
const csv = require('csv-parser');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const {
    eAdmin
} = require('../middleware/auth.js')

const {
    connection
} = require('../utils/connection.js')

const {
    entradaSaidaPorMes,
    somaCategoria,
    entradaSaidaPorDia
} = require('../utils/funcStats.js')

const {
    gravarTodasTransacoes
} = require('../utils/gravarDados.js')


let userId;

router.post('/importartransacoes', eAdmin, upload.single('csvFile'), async (req, res) => {
    userId = req.userId
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
            message: 'Nenhum arquivo CSV enviadooo'
        });
    } else {
        csvFilePath = req.file.path;
    }

    fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            const jsonData = results;
            gravarTransacaoMassivas(jsonData, userId).then(message => {
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

router.get('/exportartransacoes/:mes/:ano', eAdmin, async (req, res) => {
    userId = req.userId
    let mes = (req.params.mes.length === 1) ? "0" + req.params.mes : req.params.mes;
    let ano = (req.params.ano >= 2001 && req.params.ano <= 2100) ? req.params.ano : null;
    console.log(mes)
    console.log(ano)

    if(mes == 00 && ano == null){
        gravarTodasTransacoes(mes, ano, userId)
    } else if(mes > 0 && mes < 13){
        const query = await connection.promise().query(`SELECT * FROM transacoes_${userId} WHERE DATE_FORMAT(dt_data_transacoes, '%Y-%m') = '${ano}-${mes}' ORDER BY dt_data_transacoes`)
        console.log(query)
    }
})

async function gravarTransacaoMassivas(data, id) {
    try {
        let i;
        for (i = 0; i < data.length; i++) {
            await connection.promise().query(`INSERT INTO transacoes_${id} (s_nome_transacoes, s_categoria_transacoes, i_valor_transacoes, s_tipo_transacoes, dt_data_transacoes) 
            VALUES (?, ?, ?, ?, ?)`, [data[i].nome_transacao, data[i].categoria_transacao, data[i].valor_transacao, data[i].tipo_transacao, data[i].data_transacao]);
        }
        return "Inserções realizadas com sucesso";
    } catch (error) {
        console.error("Erro ao gravar transações massivas:", error);
        return "Ocorreu um erro ao inserir as transações.";
    }
}

module.exports = router