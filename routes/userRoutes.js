const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/user/:id', userController.getUser);
router.post('/user/registrar_usuario', userController.registrar_usuario);


module.exports = router;
