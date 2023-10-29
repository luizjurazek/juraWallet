const {
    connection
} = require('./connection.js')

function createTableTransactions(username) {
    const createTableQuery = `CREATE TABLE transacoes_${username}(
        id_transacoes INT PRIMARY KEY AUTO_INCREMENT,
    s_nome_transacoes VARCHAR(255),
    s_categoria_transacoes VARCHAR(255),
    i_valor_transacoes DOUBLE,
    s_tipo_transacoes VARCHAR(255),
    dt_data_transacoes DATE
    )`;

    connection.query(createTableQuery, (error, results, fields) => {
        if (error) {
            const response = {
                error: true,
                mensagem: 'Erro ao criar a tabela: ' + error.message
            }
            return response
        } else {
            const response = {
                error: false,
                mensagem: 'Tabela criada com sucesso.',
                resultado: results
            }
            return response
        }
    });
}



module.exports = {
    createTableTransactions
}