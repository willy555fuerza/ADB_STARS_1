/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controllers/egresos_controller')


// Ruta para obtener todas las medidas
// Ruta para obtener todas las medidas
router.get('/egreso',Users.getAll)
// Ruta para cambiar el estado de un usuario
router.put('/egreso/:userId/state', Users.changeState);
// Ruta para crear un nuevo usuario
router.post('/create_egreso', Users.createUser);
// Ruta para actualizar un usuario existente
router.put('/egreso/:id_egreso', Users.updateUser); 
// Ruta para eliminar un usuario
router.delete('/egreso_delete/:userId', Users.deleteUser);

module.exports = router 