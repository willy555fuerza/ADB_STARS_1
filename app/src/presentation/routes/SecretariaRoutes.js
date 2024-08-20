const express = require('express');
const router = express.Router();

// Ruta de inicio
router.get('/', (req, res) => {
    res.render('secretaria/index',{title: 'Dashboard'});
});

// Ruta de login
router.get('secretaria/login', (req, res) => {
    res.render('secretaria/login',{title: 'Login🔑'});
});

// Ruta de perfil
router.get('/Perfil', (req, res) => {
    res.render('secretaria/perfil',{title: 'Perfil🔑'});
});
  

// Ruta de miembros
router.get('/Miembros', (req, res) => {
    res.render('Secretaria/miembro',{title: 'Miembros🐊'});
});

// Ruta de Listas
router.get('/Listas', (req, res) => {
    res.render('Secretaria/lista',{title: 'Listas📦'});
});


// Ruta de Ingreso
router.get('/ingresos', (req, res) => {
    res.render('Secretaria/ingreso',{title: 'ingresos⛺⛺⛺'});
});



// Ruta de egresos
router.get('/egresos', (req, res) => {
    res.render('Secretaria/egreso',{title: 'egresos📝'});
});

module.exports = router;
