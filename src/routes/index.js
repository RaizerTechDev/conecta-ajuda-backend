const { Router } = require('express');
const routes = Router();

// Importando as rotas específicas
const usuariosRoutes = require('./usuariosRoutes');
const centrosRoutes = require('./centrosRoutes');
const necessidadesRoutes = require('./necessidadesRoutes');
const doacoesRoutes = require('./doacoesRoutes');
const categoriasRoutes = require('./categoriaRoutes');

// Definindo os prefixos globais
routes.use('/usuarios', usuariosRoutes);
routes.use('/centros-distribuicao', centrosRoutes);
routes.use('/lista-necessidades', necessidadesRoutes);
routes.use('/registro-doacoes', doacoesRoutes);
routes.use('/categorias', categoriasRoutes);

module.exports = routes;