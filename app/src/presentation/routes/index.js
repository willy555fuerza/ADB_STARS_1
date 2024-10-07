const express = require('express');
//const AuthController = require('../controllers/authController');
const router = express.Router();
const SecretariaRoutes = require('./SecretariaRoutes'); // Importa las rutas del vendedor

// Ruta de inicio
router.get('/', (req, res) => {
    res.render('index',{title: 'Dashboard'});
});

// Ruta de login
router.get('/login', (req, res) => {
    res.render('login',{title: 'Login🔑'});
});

// Ruta de perfil
router.get('/Perfil', (req, res) => {
    res.render('perfil',{title: 'Perfil🔑'});
});
  
// Ruta de usuarios
router.get('/Usuarios', (req, res) => {
    res.render('usuarios',{title: 'Usuarios🎇'});
});
  
// Ruta de ministerios
router.get('/Ministerios', (req, res) => {
    res.render('ministerio',{title: 'Ministerios🧱'});
});

// Ruta de miembros
router.get('/Miembros', (req, res) => {
    res.render('miembro',{title: 'Miembros🐊'});
});

// Ruta de Listas
router.get('/Listas', (req, res) => {
    res.render('lista',{title: 'Listas📦'});
});

// Ruta de Tipo ingresos
router.get('/tipo_ingresos',(req, res) => {
    res.render('tipo_ingreso',{ title: 'tipo_ingresos🙍‍♂️'});
});


// Ruta de Ingreso
router.get('/ingresos', (req, res) => {
    res.render('ingreso',{title: 'ingresos⛺⛺⛺'});
});

// Ruta de Tipo egresos
router.get('/tipo_egresos',(req, res) => {
    res.render('tipo_egreso',{ title: 'tipo_egresos🙍‍♂️'});
});


// Ruta de egresos
router.get('/egresos', (req, res) => {
    res.render('egreso',{title: 'egresos📝'});
});

// Ruta de egresos
router.get('/reportes', (req, res) => {
    res.render('reportes',{title: 'Reportes📝'});
});

// Usa las rutas específicas para la Secretaria
router.use('/Secretaria',SecretariaRoutes);


module.exports = router;
