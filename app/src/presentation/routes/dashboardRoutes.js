/*****************conection 3*********************/

const express = require('express');
const router = express.Router();
const DashboardModel = require('../models/dashboard_model');

// Endpoint para obtener el conteo de usuarios
router.get('/usuario/count', DashboardModel.getUsuarioCount);

// Endpoint para obtener el conteo de clientes
router.get('/ingreso/count', DashboardModel.getingresoCount);

// Endpoint para obtener el conteo de productos
router.get('/egreso/count', DashboardModel.getegresoCount);

// Endpoint para obtener el conteo de ventas
router.get('/lista/count', DashboardModel.getlistaCount);

module.exports = router;