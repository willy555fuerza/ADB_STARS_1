/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controllers/tipo_egresos_controller')


// Ruta para obtener todos los usuarios
router.get('/tipo_egreso',Users.getAll)
// Ruta para cambiar el estado de un usuario
router.put('/tipo_egreso/:userId/state', Users.changeState);
// Ruta para crear un nuevo usuario
router.post('/create_tipo_egreso', Users.createUser);
// Ruta para actualizar un usuario existente
router.put('/tipo_egreso/:id_tipo_egresos', Users.updateUser);
// Ruta para eliminar un tipo de ingreso
router.delete('/tipo_egreso_delete/:userId', Users.deleteUser);
 
 
module.exports = router 