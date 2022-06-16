const multer = require('multer');
const { Router } = require('express');
const routes = Router();

const multerConfig = require('../../config/multerConfig');

const ClassesControllers = require('../controllers/ClassesControllers');

const { validateToken } = require('../middlewares/validationMiddlewares');

//POST ROUTES
routes.post('/add', validateToken, multer(multerConfig).single('foto'), ClassesControllers.classesAdd);

//GET ROUTES
routes.get('/pegar-dados/:curso_id', ClassesControllers.pegarDados);
routes.get('/:id/deletar', validateToken, ClassesControllers.classDelete);

//RENDER ROUTES
routes.get('/add', validateToken, ClassesControllers.classesAddRender);



module.exports = routes;