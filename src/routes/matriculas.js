const multer = require('multer');
const { Router } = require('express');
const routes = Router();

const MatriculasControllers = require('../controllers/MatriculasControllers');
const multerConfig = require('../../config/multerConfig');


//POST ROUTES
routes.post('/buscar', MatriculasControllers.buscarMatricula);
routes.post('/alterar/matricula/', MatriculasControllers.alterarEstado);
routes.post('/confirmar', multer(multerConfig).single('foto'), MatriculasControllers.confirmarMatricula);


//GET ROUTES

//RENDER ROUTES


module.exports = routes;