const express = require('express')
const app = express()

// Importando rotas
const transactionRoutes = require('./routes/transaction.js')
const loginRoutes = require('./routes/login.js')

// View engine
app.set('view engine', 'ejs')
// Definir o diretório de modelos
app.set('views', './views');

// Middlewares
app.use(express.json())
app.use(express.static('./public'));


// Rotas 
app.use('/', transactionRoutes)
app.use('/', loginRoutes)



app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080: http://localhost:8080/")
});