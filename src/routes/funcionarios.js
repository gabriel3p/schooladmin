const multer = require('multer');
const { Router } = require('express');
const routes = Router();

const FuncionariosControllers = require('../controllers/FuncionariosControllers');

const multerConfig = require('../../config/multerConfig');
const { validateToken } = require('../middlewares/validationMiddlewares');
const { eDiretor } = require('../middlewares/permissionsMiddlewares');

//Rotas POSTs
routes.post('/auth', FuncionariosControllers.auth);
routes.post('/funcionarios/buscar', validateToken, FuncionariosControllers.buscar);
routes.post('/:usuario/alterar-senha', validateToken, FuncionariosControllers.alterarSenha);
routes.post('/registrar', multer(multerConfig).single('foto'), validateToken, FuncionariosControllers.registro)
routes.post('/:usuario/editar', multer(multerConfig).single('foto'), validateToken, FuncionariosControllers.editFuncinonario);
routes.post('/funcionarios/adicionar-disciplina', multer(multerConfig).single('foto'), validateToken, FuncionariosControllers.adicionarDisciplina);



//ROTAS GETs
routes.get('/:usuario/sair', validateToken, FuncionariosControllers.logOut);
routes.get('/:usuario/eliminar', validateToken, FuncionariosControllers.delete);
routes.get('/:id/eliminar-conta', validateToken, eDiretor, FuncionariosControllers.deletarConta);


//Rotas Renders
routes.get('/entrar', FuncionariosControllers.loginRender);
routes.get('/perfil/:id', validateToken, FuncionariosControllers.perfilRender);
routes.get('/dashboard', validateToken, FuncionariosControllers.dashboardRender);
routes.get('/funcionarios', validateToken, FuncionariosControllers.funcionariosRender);
routes.get('/funcionarios/cadastrar', validateToken, FuncionariosControllers.registroRender);
routes.get('/funcionarios/adicionar-disciplina', validateToken, FuncionariosControllers.adicionarDisciplinaRender);



//Rota PRIVADA
routes.post('/privado/registrar', FuncionariosControllers.registroPrivado)
routes.get('/privado/registrar', FuncionariosControllers.registroPrivadoRender);


module.exports = routes;