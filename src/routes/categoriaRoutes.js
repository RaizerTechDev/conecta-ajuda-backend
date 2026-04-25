const { Router } = require('express');
const router = Router();
const Categorias = require('../controllers/CategoriasController');
const authMiddleware = require('../middlewares/auth');

// Listar categorias (logado)
router.get('/', authMiddleware, Categorias.index);

// // Criar categoria (Protegido)
// router.post('/', authMiddleware, Categorias.store);

module.exports = router;