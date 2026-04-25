const path = require('path');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// MIDDLEWARES GLOBAIS
app.use(express.json());
app.use(cors());

// CONFIGURAÇÃO DAS VIEWS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS
app.use(express.static("public"));

// ROTA PRINCIPAL (EJS)
app.get('/', (req, res) => {
    res.render('index'); 
});

// ROTAS DA API
app.use(routes);

// EXPORTA O APP
module.exports = app;