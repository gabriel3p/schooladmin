
const multer = require('multer');
const { Router } = require('express');
const routes = Router();

const AlunosControllers = require('../controllers/AlunosControllers');
const { validateToken } = require('../middlewares/validationMiddlewares')
const { eDiretor } = require('../middlewares/permissionsMiddlewares');
const multerConfig = require('../../config/multerConfig');


//POST ROUTES
routes.post('/buscar', validateToken, AlunosControllers.buscar);
routes.post('/:id/editar', multer(multerConfig).single('foto'), validateToken, AlunosControllers.editar);
routes.post('/matricular', multer(multerConfig).single('foto'), validateToken, AlunosControllers.matricular);


//GET ROUTES
routes.get('/:id/deletar', validateToken, eDiretor, AlunosControllers.delete);

//RENDER ROUTES
routes.get('/', validateToken, AlunosControllers.alunosRender);
routes.get('/aluno/:id', validateToken, AlunosControllers.perfilAlunoRender);
routes.get('/matricular', validateToken, AlunosControllers.matricularRender);
routes.get('/confirmar', validateToken, AlunosControllers.confirmarMatriculaRender);

module.exports = routes;