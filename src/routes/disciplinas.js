const multer = require('multer');
const { Router } = require('express');
const routes = Router();

const DisciplinasControllers = require('../controllers/disciplinasControllers');

const multerConfig = require('../../config/multerConfig');
const { validateToken } = require('../middlewares/validationMiddlewares');

//POST ROUTES
routes.post('/cadastrar', validateToken, multer(multerConfig).single('foto'), DisciplinasControllers.disciplinasCadastrar);


//GET ROUTES
routes.get('/:id/deletar', validateToken, DisciplinasControllers.deletar);
routes.get('/:perfil_id/:disciplina_id/:turma_id/remover', validateToken, DisciplinasControllers.remove);


//RENDER ROUTES
routes.get('/cadastrar', validateToken, DisciplinasControllers.disciplinasCadastrarRender);

module.exports = routes;