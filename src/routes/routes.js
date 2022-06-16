const { Router } = require('express');
const routes = Router();
const Feedbacks = require('../models/FeedBacks');

routes.use(async (req, res, next) => {
    req.messages = await Feedbacks.findAndCountAll({
        where: { lida: false },
        order: [['id', 'DESC']],
        limit: 4,
    });
    
    next();
});

//Rotas Pública/Portal
routes.use('/', require('./public'));

//Rotas FeedBack
routes.use('/', require('./feedbacks'));

//Rotas Administrativas (Funcionários)
routes.use('/admin', require('./funcionarios'));

//Rotas Cursos
routes.use('/admin/cursos', require('./cursos'));

//Rotas Classes
routes.use('/admin/cursos/classe', require('./classes'));

//Rotas Turmas
routes.use('/admin/turmas', require('./turmas'));

//Rotas Displinas
routes.use('/admin/cursos/disciplinas', require('./disciplinas'));

//Rotas Alunos
routes.use('/admin/alunos', require('./alunos'));

//Rotas Matriculas
routes.use('/admin/matriculas', require('./matriculas'));

//Rotas Notas
routes.use('/admin/notas', require('./notas'));

//Rotas Pagamentos
routes.use('/admin/pagamentos', require('./pagamentos'));

module.exports = routes;