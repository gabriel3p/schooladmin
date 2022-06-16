const Cursos = require('../models/Cursos');
const Classes = require('../models/Classes');

const { setTime } = require('../helpers/utils');

module.exports = {
    //POST CONTROLLERS
    async classesAdd (req, res) {
        const { nivel, preco, curso_id } = req.body;
       
        try {
            if (typeof nivel == 'object' && typeof preco == 'object')  {
               
                nivel.forEach(async (niv, index) => {
                   
                   await Classes.create({ nivel: niv, preco: preco[index], curso_id });
                    
                });
                return res.json({ message: 'Classes adicionadas com sucesso.', success: true });

            } else {
                await Classes.create({ nivel, preco, curso_id });

                return res.json({ message: 'Classe adicionada com sucesso.', success: true });
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    },

   

    //GET CONTROLLERS
    async pegarDados (req, res) {
        const { curso_id } = req.params;
        try {
            const curso = await Cursos.findByPk(curso_id, { 
                include: { 
                    required: false,
                    association: 'classes',
                    attributes: ['nivel', 'preco', 'id'],
                    include: [
                        {
                            association: 'turmas',
                            attributes: ['codigo_turma', 'turno', 'id'],
                            include: {
                                association: 'professor',
                                include: {
                                    association: 'turmas'
                                }
                            }
                        },

                        {
                            association: 'disciplinas',
                            attributes: ['nome_disciplina', 'abreviacao', 'id'],
                            include: {
                                association: 'professores'
                            }
                        }
                    ]
                }
             });

            if (!curso_id) {
                req.flash('error_msg', 'Este curso não existe!');
                res.redirect('/admin/cursos/classe/add')
            } 

            return res.json({ curso });
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/cursos/classe/add');
        }
    },

    async classDelete (req, res) {
        const { id } = req.params;
       try {
            await Classes.destroy({ where: { id } });
            req.flash('success_msg', 'Classe deletada com sucesso!');
            res.redirect('/admin/cursos');
           
       } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/cursos');
       }
    },

    //RENDER CONTROLLERS
    async classesAddRender (req, res) {
        try {
            const cursos = await Cursos.findAll({
                include: {
                    association: 'classes',
                    attributes: ['nivel', 'preco']
                }
            });
            const funcionario = req.funcionario_logado;

            res.render('./admin/pages/classesAdicionar', { funcionario, cursos, message: req.messages, setTime });
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/cursos');
        }
    }
}