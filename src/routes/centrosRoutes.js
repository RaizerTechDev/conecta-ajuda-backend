const { Router } = require('express');
const router = Router();
const Centros = require('../controllers/CentrosController');
const authMiddleware = require('../middlewares/auth');
const adminOnly = require('../middlewares/adminOnly'); // Importe o novo middleware

// APENAS ADMINISTRADORES podem listar, criar ou editar centros
router.get('/', authMiddleware, adminOnly, Centros.index);

router.post('/', authMiddleware, adminOnly, Centros.store);
router.put('/:id', authMiddleware, adminOnly, Centros.update);
router.delete('/:id', authMiddleware, adminOnly, Centros.delete);

module.exports = router;