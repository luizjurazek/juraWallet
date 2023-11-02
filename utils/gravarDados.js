const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const {
    connection
} = require('../utils/connection.js')

const {
    entradaSaidaPorMes,
    somaCategoria,
    entradaSaidaPorDia
} = require('../utils/funcStats.js')

async function gravarTodasTransacoes(mes, ano, userId){
    const query = await connection.promise().query(`SELECT * FROM transacoes_${userId} ORDER BY dt_data_transacoes`)
    const results = query[0]
    const entradaEsaidaPorMes = entradaSaidaPorMes(results)
    const gastosPorCategoria = somaCategoria(results)

   const csvWriter = createCsvWriter({
    path: 'C:/Users/Luiz Jurazek/Desktop/token-node/uploads/todas-transacoes.csv',
    header: [
        {id: 'id_transacoes', title: 'ID Transacao'},
        {id: 's_nome_transacoes', title: 'Nome Transacao'},
        {id: 's_categoria_transacoes', title: 'Categoria Transacao'},
        {id: 'i_valor_transacoes', title: 'Valor Transacao'},
        {id: 's_tipo_transacoes', title: 'Tipo Transacao'},
        {id: 'dt_data_transacoes', title: 'Data Transacao'}
    ]
   })

   csvWriter.writeRecords(results)
    .then(() => {
        console.log('Dados gravados com sucesso no arquivo CSV.');
    })
    .catch(err => {
        console.error('Erro ao gravar os dados no arquivo CSV: ', err)
    })
}

module.exports = {
    gravarTodasTransacoes
}
