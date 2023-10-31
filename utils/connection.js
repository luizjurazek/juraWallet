const mysql = require('mysql2')
require('dotenv').config()
const host = process.env.DB_HOST
const user = process.env.DB_USER
const database = process.env.DB_DATABASE

const connection = mysql.createConnection({
    host: host,
    user: user,
    database: database
})

module.exports = {
    connection
}