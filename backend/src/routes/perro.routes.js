const express = require('express');
const router = express.Router();
const perroController = require('../controllers/perro.controller');

// Obtener todos los perros
router.get('/', perroController.getAllPerros);

// Obtener un perro por ID
//router.get('/:id', perroController.getPerroById);

// Crear un nuevo perro
//router.post('/', perroController.createPerro);

// Actualizar un perro
//router.put('/:id', perroController.updatePerro);

// Eliminar un perro (eliminación lógica)
//router.delete('/:id', perroController.deletePerro);

module.exports = router;