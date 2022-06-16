const { Op } = require('sequelize');
const Cursos = require('../models/Cursos');
const Classes = require('../models/Classes');


const { deletePhoto, setDate, setTime } = require('../helpers/utils');

module.exports = {
   
    //POST CONTROLLERS
    async cursoCadastro (req, res) {
        const { nome, codigo_curso, descrição } = req.body;
        try {

            if (!req.file) return  res.status(400).json({ message: 'É obrigatório ter uma foto de capa', success: false });

            if(await Cursos.findOne({ where: { [Op.or]: { codigo_curso, nome } } })) return  res.status(400).json({ message: 'Já existe um curso cadastrado com essa sigla ou nome', success: false });

            await Cursos.create({
                codigo_curso: codigo_curso.toUpperCase(),
                foto: req.file.filename,
                nome,
                descrição,
            });

            return res.json({ message: 'Curso cadastrado com sucesso!', success: true });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    },

    async cursoEditar (req, res) {
        const { id } = req.params;
        const { nome, codigo_curso, preco, nivel, descrição } = req.body
        try {
            const curso = await Cursos.findByPk(id);

            if (!curso) return res.status(400).json({ message: 'Este curso não existe.', success: false });

            if (req.file) {
                deletePhoto(curso);
            }

            await Cursos.update(
                {
                    foto: (req.file) ? req.file.filename : curso.foto,
                    nome, 
                    codigo_curso,
                    descrição 
                }, 
                    { where: { id } 
            });

            nivel.forEach(async (niv, index) => { 
                await Classes.update({ preco: preco[index] }, { where: { [Op.and]: { curso_id: id, nivel: niv } } })
            })

            res.json({ message: 'Alterações feitas com sucesso!', success: true });
           /* req.flash('success_msg', 'Dodos recebidos')
            res.redirect('/admin/cursos')*/
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        
        }
    },

    async buscar (req, res) {
      const { nome, codigo_curso, preco, nivel, codigo_turma, turno, nome_disciplina, abreviacao } = req.body;
        try {

            const funcionario = req.funcionario_logado
           
           const cursos = await Cursos.findAll({ 
               where: (nome || codigo_curso) ? {
                    [Op.or]:  {
                        nome: (nome) ? nome : '',
                        codigo_curso: (codigo_curso) ? codigo_curso : '',
                    },
                } : {},
                order: [[ 'nome', 'ASC' ]],
                include: { 
                    //required: false,
                    association: 'classes',
                    attributes: ['nivel', 'preco', 'id'],
                    where: (preco || nivel) ? {
                        [Op.or]: {
                            preco: (preco) ? preco : '',
                            nivel: (nivel) ? nivel : '', 
                        },  
                    } : {},
                    include: [
                        {
                            association: 'turmas',
                            attributes: ['codigo_turma', 'turno', 'id'],
                            where: (codigo_turma || turno) ? {
                                [Op.or]: {
                                    codigo_turma: (codigo_turma) ? codigo_turma : '',
                                    turno: (turno)  ? turno : '',
                                }
                                
                            } : {},
                            include: {
                                association: 'matriculas'
                            },
                        },

                        {
                            association: 'disciplinas',
                            attributes: ['nome_disciplina', 'abreviacao', 'id'],
                            where: (nome_disciplina || abreviacao) ? {
                                [Op.or]: {
                                    nome_disciplina: (nome_disciplina) ? nome_disciplina : '',
                                    abreviacao: (abreviacao)  ? abreviacao : '',
                                } 
                            } : {},
                            include: {
                                association: 'professores'
                            }
                        }
                    ]
                }
            });


            res.json({ cursos, funcionario, success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
        }
    },

    async pegarDados (req, res) {
        try {
            const cursos = await Cursos.findAll({ 
                include: { 
                    association: 'classes',
                    attributes: ['nivel', 'preco'],
                    include: {
                        association: 'matriculas',
                    }
                } 
            });
            
            return res.json({ cursos });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    },

    //GET CONTROLLERS
    async cursoDeletar (req, res) {
        const { codigo_curso } = req.params;
        try {

            const curso = await Cursos.findOne({ where: { codigo_curso } })

            if (!curso) {
                req.flash('error_msg', 'Este curso não existe!');
                res.redirect('/admin/cursos');
            }

            await Cursos.destroy({ where: { codigo_curso } });
            deletePhoto(curso);

            return res.redirect('/admin/cursos');
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/cursos');
        }
    },
    
    //RENDERS CONTRLLERS
    async cursosRender (req, res) {
        try {

            const cursos = await Cursos.findAll({ 
                order: [[ 'nome', 'ASC' ]],
                include: { 
                    association: 'classes',
                    attributes: ['nivel', 'preco', 'id'],
                    include: [
                        {
                            association: 'turmas',
                            attributes: ['codigo_turma', 'turno', 'id'],
                            include: {
                                association: 'matriculas'
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

                              
            const funcionario = req.funcionario_logado;

            res.render('./admin/pages/cursos', { funcionario, cursos, message: req.messages, setTime });
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/dashboard');
        }
    },

    async cursoCadastroRender (req, res) {
        try {
            const funcionario = req.funcionario_logado;

            res.render('./admin/pages/cursosCadastro', { funcionario, message: req.messages, setTime });
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/cursos');
        }
    }
}