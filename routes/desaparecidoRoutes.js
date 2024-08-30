const express = require('express');
const router = express.Router();
const desaparecidoController = require('../controllers/desaparecidoController');

router.get('/desaparecido/:id', desaparecidoController.getDesaparecido);
router.get('/desaparecido', desaparecidoController.getAllDesaparecidos);
router.post('/desaparecido', desaparecidoController.createDesaparecido);
router.put('/desaparecido/:id', desaparecidoController.updateDesaparecido);
router.delete('/desaparecido/:id', desaparecidoController.deleteDesaparecido);

module.exports = router;