/*****************conection 3*********************/

const express = require('express')
const router = express.Router()
const Users = require('../controllers/miembro_controller')


// Ruta para obtener todas los miembros
router.get('/miembro',Users.getAll)
// Ruta para cambiar el estado de un miembro
router.put('/miembro/:userId/state', Users.changeState);
// Ruta para crear una nuevo miembro
router.post('/create_miembro', Users.createUser);
// Ruta para actualizar un miembro existente
router.put('/miembro/:id_miembro', Users.updateUser); 
// Ruta para eliminar un miembro
router.delete('/miembro_delete/:userId', Users.deleteUser);
 

module.exports = router 