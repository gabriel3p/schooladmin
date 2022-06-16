const { Router } = require('express');
const routes = Router();

const NotasControllers = require('../controllers/NotasControllers');

//POST CONTROLLERS
routes.post('/editar/:disciplina_id/:turma_id', NotasControllers.editarNotas);

//GET CONTROLLERS
routes.get('/pegar-notas/:trimestre/:disciplina_id/:turma_id', NotasControllers.pegarNotas);

//RENDER CONTROLLERS


module.exports = routes;