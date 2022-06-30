const multer = require('multer');
const { Router } = require('express');
const routes = Router();

const multerConfig = require('../../config/multerConfig');

const TurmasControllers = require('../controllers/TurmasControllers');

const { validateToken } = require('../middlewares/validationMiddlewares');

//POST ROUTES
routes.post('/buscar', validateToken, TurmasControllers.buscar);
routes.post('/imprimir', validateToken, TurmasControllers.imprimir);
routes.post('/:id/editar', validateToken, TurmasControllers.editarTurma);
routes.post('/delete/selected', validateToken, TurmasControllers.turmaDelete);
routes.post('/generate-list/selected', validateToken, TurmasControllers.turmaGerarLista);
routes.post('/generate-mini-pauta/selected', validateToken, TurmasControllers.turmaGerarMiniPauta);
routes.post('/cadastrar', validateToken, multer(multerConfig).single('foto'), TurmasControllers.turmasCriar);

//GET ROUTES
routes.get('/:id/deletar', validateToken, TurmasControllers.turmaDelete);
routes.get('/pegar-dados/:id', validateToken, TurmasControllers.pegarDados);

//RENDER ROUTES
routes.get('/', validateToken, TurmasControllers.turmasRender);
routes.get('/minhas-turma/:id', validateToken, TurmasControllers.minhasTurmasRender);
routes.get('/cadastrar', validateToken, TurmasControllers.turmasCriarRender);
routes.get('/pauta/:disciplina_id/:turma_id', validateToken, TurmasControllers.miniPautaRender);
routes.get('/imprimir/:codigo_turma/:nome_curso/:codigo_curso/:turno/:ano_lectivo/:matriculas/:data_cadastro/:nivel', validateToken, TurmasControllers.imprimirRender);


///admin/turmas/pauta/<%= funcionario.disciplinas[0].id %>/<%= turma.id %>

module.exports = routes;