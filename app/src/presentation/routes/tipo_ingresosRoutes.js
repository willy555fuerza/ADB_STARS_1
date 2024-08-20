/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controllers/tipo_ingresos_controller')


// Ruta para obtener todos los usuarios
router.get('/tipo_ingreso',Users.getAll)
// Ruta para cambiar el estado de un usuario
router.put('/tipo_ingreso/:userId/state', Users.changeState);
// Ruta para crear un nuevo usuario
router.post('/create_tipo_ingreso', Users.createUser);
// Ruta para actualizar un usuario existente
router.put('/tipo_ingreso/:id_tipo_ingresos', Users.updateUser);
// Ruta para eliminar un tipo de ingreso
router.delete('/tipo_ingreso_delete/:userId', Users.deleteUser);
 
 
module.exports = router 