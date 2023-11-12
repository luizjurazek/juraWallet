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
    gravarTodasTransacoes,
    gravarTransacoesMes,
    gravarTransacaoMassivas
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
            const response = {
                error: false,
                message: message,
                data: jsonData
            }

            gravarTransacaoMassivas(jsonData, userId).then(message => {
                res.json(response);
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

    if (mes == 00 && ano == null) {
        const todasTransacoes = await gravarTodasTransacoes(userId)
        res.status(200).json(todasTransacoes)
    } else if (mes > 0 && mes < 13) {
        const transacoesDoMes = await gravarTransacoesMes(mes, ano, userId)
        res.status(200).json(transacoesDoMes)
    }
})

module.exports = router