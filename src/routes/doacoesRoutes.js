const { Router } = require('express');
const router = Router();
const Doacao = require('../controllers/RegistroDoacoesController');
const authMiddleware = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const schemas = require('../middlewares/validations/schemas');
const adminOnly = require('../middlewares/adminOnly'); 

router.post('/', authMiddleware, validate(schemas.doacao), Doacao.store);
router.put('/:id', authMiddleware, adminOnly, Doacao.update);
router.get('/', authMiddleware, Doacao.index);
router.delete('/:id', authMiddleware, adminOnly, Doacao.delete);

module.exports = router;