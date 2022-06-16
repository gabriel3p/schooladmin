const multer = require('multer');
const { Router } = require('express');
const routes = Router();

const CursosControllers = require('../controllers/CursosControllers');
const ClassesControllers = require('../controllers/ClassesControllers');

const multerConfig = require('../../config/multerConfig');
const { validateToken } = require('../middlewares/validationMiddlewares');

//POST ROUTES
routes.post('/buscar', validateToken, CursosControllers.buscar);
routes.post('/:id/editar', validateToken, multer(multerConfig).single('foto'), CursosControllers.cursoEditar);
routes.post('/cadastrar', validateToken, multer(multerConfig).single('foto'), CursosControllers.cursoCadastro);



//GET ROUTES
routes.get('/:codigo_curso/deletar', validateToken, CursosControllers.cursoDeletar);
routes.get('/pegar-dados', validateToken, CursosControllers.pegarDados);


//RENDER ROUTES
routes.get('/', validateToken, CursosControllers.cursosRender);
routes.get('/cadastrar', validateToken, CursosControllers.cursoCadastroRender);


module.exports = routes;