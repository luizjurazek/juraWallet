const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'controle-financeiro'
})

module.exports = {
    connection
}