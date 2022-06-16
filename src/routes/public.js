const { Router } = require('express');
const routes = Router();
const multer = require('multer');

const Alunos = require('../models/Alunos');
const Cursos = require('../models/Cursos');
const Funcionarios = require('../models/Funcionarios');

const AlunosControllers = require('../controllers/AlunosControllers');

const multerConfig = require('../../config/multerConfig');
const { setDate } = require('../helpers/utils');


routes.get('/', async (req, res) => {
    try {   
        const cursos = await Cursos.findAll({
            order: [[ 'nome', 'ASC' ]],
            include: {
                association: 'classes',
                attributes: ['nivel', 'preco'],
                order: [[ 'nivel', 'ASC' ]],
            }
        });

        const professores = await Funcionarios.findAndCountAll({ where: {
            cargo: 'professor'
        } });

        const alunos = await Alunos.findAndCountAll();

       res.render('./public/index', { cursos, professores, alunos }); 
       
    } catch (error) {
        console.log(error)
    }
});

routes.get('/contactos', (req, res) => {
    res.render('./public/pages/contacts');
});

routes.get('/aluno/matricular', async (req, res) => {
   try {
        const cursos = await Cursos.findAll({ order: [['nome', 'ASC']] });
        
        res.render('./public/pages/registerStudent', { cursos });
   } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Houve um erro interno, por favor tente novamente.');
        res.redirect('/');
   }
});

routes.get('/aluno/confirmar', async (req, res) => {
    try {
        const cursos = await Cursos.findAll({ order: [['nome', 'ASC']] });
        
        res.render('./public/pages/confirmStudent', { cursos });
    } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Houve um erro interno, por favor tente novamente.');
        res.redirect('/');
    }
});

routes.get('/aluno/sobre', (req, res) => {
    res.render('./public/pages/aboutStudent');
});

routes.get('/faq', (req, res) => {
    res.render('./public/pages/faq');
});


routes.post('/aluno/matricular', multer(multerConfig).array('foto'), AlunosControllers.matricular);

routes.get('/documento', (req, res) => {
    res.render('./admin/pages/pagina_imprimir');
});

module.exports = routes;