const express = require('express')
const app = express()

// Importando rotas
const transactionRoutes = require('./routes/transaction.js')
const loginRoutes = require('./routes/login.js')

// Middlewares
app.use(express.json())

// Rotas 
app.use('/', transactionRoutes)
app.use('/', loginRoutes)



app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080/")
});