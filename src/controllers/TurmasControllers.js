const { Op } = require('sequelize');
const Cursos = require('../models/Cursos');
const Classes = require('../models/Classes');
const Turmas = require('../models/Turmas'); 
const Disciplinas = require('../models/Disciplinas'); 
const Matriculas = require('../models/Matriculas'); 



const { setTime, setDate } = require('../helpers/utils');

module.exports = {

    //POst Controllers
    async turmasCriar (req, res) {
        const { curso_id, nivel, codigo_turma, turno, ano_lectivo } = req.body
        try {

            if (!await Cursos.findByPk(curso_id)) return res.status(400).json({ message: 'Curso não encontrado!', success: false });

            if (typeof (nivel) === 'object') {
                nivel.forEach(async (niv, index) => {
                    let classe = await Classes.findOne({ where: { curso_id, nivel: niv } });

                    if (!classe) return res.status(400).json({ message: 'Classe não encontrada!', success: false });

                    if (await Turmas.findOne({ where: { codigo_turma: codigo_turma[index].toUpperCase() } })) return res.status(400).json({ message: `Turma ${ codigo_turma[index] } já existe.`, success: false });

                    await Turmas.create({ classe_id: classe.id, ano_lectivo, codigo_turma: codigo_turma[index].toUpperCase(), turno: turno[index] });
                });

                return res.json({ message: 'Turmas adicionadas com sucesso.', success: true });

            } else {

                const classe = await Classes.findOne({ where: { curso_id, nivel } });

                if (!classe) return res.status(400).json({ message: 'Classe não encontrada!', success: false });

                if (await Turmas.findOne({ where: { codigo_turma: codigo_turma.toUpperCase() } })) return res.status(400).json({ message: `Turma ${ codigo_turma } já existe.`, success: false });

                await Turmas.create({ classe_id: classe.id, codigo_turma: codigo_turma.toUpperCase(), turno, ano_lectivo });

                return res.json({ message: 'Turma adicionada com sucesso.', success: true });

            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
       
        }
    },

    async turmaGerarLista (req, res) {

        const { estado_matricula, codigo_matricula, ordem_alfabetica, turmas_id } = req.body;

        try {
            let turma;

            if (typeof turmas_id == 'object') {
                
                req.flash('error_msg', 'Esta acção requer apenas uma única turma!');
                return res.redirect('/admin/turmas');
                    
            } else {

                turma = await Turmas.findByPk(turmas_id, {
                    include: [
                        {
                            association: 'matriculas',
                            include: {
                                association: 'aluno'
                            }
                        },

                        {
                            association: 'classe',
                            include:  {
                                association: 'curso',
                            },
    
                        }
                    ]
                })
            }


            return res.render('./admin/pages/lista_presenca', { turma, codigo_matricula, funcionario: req.funcionario_logado });

        } catch (error) {
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            return res.redirect('/admin/turmas');
        }
    },

    async editarTurma (req, res) {
        const { codigo_turma, ano_lectivo } = req.body;
        const { id } = req.params;
        try {
            const turma = await Turmas.findByPk(id);
            
            if (!turma) return res.status(400).json({ message: 'Esta turma não existe!', success: false });
            
            if (!await Turmas.findOne({ where: { codigo_turma } }) && turma.codigo_turma.toUpperCase() != codigo_turma.toUpperCase()) return res.status(400).json({ message: 'Esta turma já existe!', success: false });

            await Turmas.update({ codigo_turma: codigo_turma.toUpperCase(), ano_lectivo }, { where: { id } });

            res.json({ message: 'Alterações feitas com sucesso!', success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        
        }
    },

    async imprimir (req, res) {
        const {  codigo_turma, nome_curso, codigo_curso, nivel, turno, ano_lectivo, matriculas, data_cadastro } = req.body
        try {
                       
           return res.json({  codigo_turma, nome_curso, codigo_curso, nivel, turno, ano_lectivo, matriculas, data_cadastro, success: true });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
        }
    },

    //Get CONTROLLERS
    async turmaDelete (req, res) {
        const { id } = req.params;
        const { turmas } = req.body
       try {
            if (id) {
                await Turmas.destroy({ where: { id } });
                req.flash('success_msg', 'Turma deletada com sucesso!');
                return res.redirect('/admin/turmas');
            }

            if (turmas.includes('all')) {
                Turmas.destroy({ truncate: true });
                req.flash('success_msg', 'Todas as turmas foram deletadas com sucesso!');
                return res.redirect('/admin/turmas');
            }

            
            if (typeof turmas == 'object') {
                turmas.forEach(async turma => {
                    await Turmas.destroy({ where: { id: turma } });
                });
    
                req.flash('success_msg', 'Turmas deletadas com sucesso!');
            } else {
                await Turmas.destroy({ where: { id: turmas } });
                req.flash('success_msg', 'Turma deletada com sucesso!');
            }
            
            return res.redirect('/admin/turmas');
           
           
       } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/turmas');
       }
    },

    async buscar (req, res) {
         const { ano_lectivo, nivel, codigo_curso, turno, codigo_turma, nome  } = req.body;
         const { professor } = req.query;
        try {
            //console.log(professor)

            const turmas = await Turmas.findAll({ 
                where: (ano_lectivo || codigo_turma || turno) ? {
                    [Op.or]: {
                        turno: (turno) ? turno : '',
                        ano_lectivo: (ano_lectivo) ? ano_lectivo : '',
                        codigo_turma: (codigo_turma) ? codigo_turma : '',
                    }
                } : {},

                include: [
                    {
                        association: 'classe',
                        where: (nivel) ? {
                            nivel: (nivel) ? nivel : ''
                        } : {},
    
                        include: [
    
                            {
                                association: 'disciplinas',
    
                                include: {
                                    association: 'professores',
                                    where: (nome) ? {
                                        nome: (nome) ? nome : ''
                                        /*[Op.or]: {
                                            nome: {
                                                [Op.iLike]: `%${nome}%` 
                                            },
    
                                            sobrenome: {
                                                [Op.iLike]: `%${nome}%` 
                                            }
                                        }*/
                                        
                                    } : {},
                                }
                            },
        
                            {
                                association: 'curso',
                                where: (codigo_curso) ? {
                                    codigo_curso: (codigo_curso) ? codigo_curso : ''
                                } : {},
                            }
    
                        ],
                    },

                    {
                        association: 'matriculas'
                    }
                ]
             }); 

             const turmasProfessor = await Turmas.findAll({ 
                where: (turno || codigo_turma) ? {
                    [Op.or]: {
                        turno: (turno) ? turno : '',
                        codigo_turma: (codigo_turma) ? codigo_turma : '',
                    }
                } : {},

                include: [
                    {
                    
                        association: 'classe',
                        where: (nivel) ? {
                            nivel: (nivel) ? nivel : ''
                        } : {},
    
                        include: [
    
                            {
                            
                                association: 'disciplinas',
                                include: {
                                    
                                    association: 'professores',
                                    where: (professor) ? {
                                        id: (professor) ? professor : '', 
                                    } : {},
                                }
                            },
        
                            {
                            
                                association: 'curso',
                                where: (codigo_curso) ? {
                                    codigo_curso: (codigo_curso) ? codigo_curso : ''
                                } : {},
                            }
    
                        ],
                    },

                    {
                        association: 'matriculas'
                    },


                    {
                        required: true,
                        association: 'professor',
                    },
                ]
             }); 
            
             if (professor) return res.json({ turmasProfessor, professor });

             return res.json({ turmas, funcionario: req.funcionario_logado })
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
        
        }
    },

    async pegarDados (req, res) {
        const { id } = req.params;
        try {

            const turma = await Turmas.findByPk(id, {
                include: {
                    required: false,
                    association: 'classe',
                    include: [
                        {  
                            association: 'curso',
                        },
                        
                        {
                            association: 'disciplinas',
                            include: {
                                association: 'professores',
                            }
                        }
                    ]
                },
            });

            res.json({ turma })
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
         
        }
    },

    //Render Controllers
    async turmasCriarRender (req, res) {
        try {
            const cursos = await Cursos.findAll({
                include: {
                    association: 'classes',
                    attributes: ['nivel', 'preco']
                }
            });
            const funcionario = req.funcionario_logado;

            res.render('./admin/pages/turmasCriar', { funcionario, cursos, message: req.messages, setTime });
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/cursos');
        }
    },

    async turmasRender (req, res) {
        const numeroPagina = Number.parseInt(req.query.pagina);
        try {

            let pagina = 0;
            if (!Number.isNaN(numeroPagina) && numeroPagina > 0) {
                pagina = numeroPagina - 1;
            }
                
            let tamanho =  10;
            
            const { rows, count } = await Turmas.findAndCountAll({
                order: [['ano_lectivo', 'ASC'], ['codigo_turma', 'ASC']],
                include: [
                    {
                        required: false,
                        association: 'classe',
                        include: [
                            {  
                                association: 'curso',
                            },
                            
                            {
                                association: 'disciplinas',
                                include: {
                                    association: 'professores',
                                }
                            },
                        ]
                    },

                    {
                       association: 'matriculas'
                    },
                ],
                limit: tamanho,
                offset: pagina * tamanho,
            });

            const cursos = await Cursos.findAll({
                order: [['nome', 'ASC']]
            });

            const funcionario = req.funcionario_logado

            res.render('./admin/pages/turmas', { 
                funcionario, 
                turmas: rows, 
                paginasTotal: Math.ceil(count / tamanho), 
                pagina: pagina + 1, 
                message: req.messages, 
                setTime,
                cursos,
                setDate 
            });
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente');
            res.redirect('/admin/dashboard');
        }
    },

    async minhasTurmasRender (req, res) {
        const { id } = req.params;
        try {

            const funcionario = req.funcionario_logado
            const cursos = await Cursos.findAll({
                order: [['nome', 'ASC']]
            });


            const turmas = await Turmas.findAll({ 

                include: [
                    {
                        association: 'classe',
                       
                        include: [
    
                            {
    
                                association: 'disciplinas',
                                include: {
                                    association: 'professores',
                                }
                            },
        
                            {
                                association: 'curso',
                            }
    
                        ],
                    },

                    {
                        required: true,
                        association: 'professor',
                        where: {
                            id: id,
                        }
                    },

                    {
                        association: 'matriculas'
                    }
                ]
             }); 

            res.render('./admin/pages/minhasTurmas', { 
                funcionario,
                setTime,
                cursos,
                turmas
            });

        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/dashboard');
        }
    },

    async imprimirRender (req, res) {
        const {  codigo_turma, nome_curso, codigo_curso, nivel, turno, ano_lectivo, matriculas, data_cadastro } = req.params;
        try {

            const turmas = await Turmas.findAll({ 
                attributes: [ 'id', (codigo_turma != 'false') ? codigo_turma : 'id', (turno != 'false') ? turno : 'id', (ano_lectivo != 'false') ? ano_lectivo : 'id', (data_cadastro != 'false') ? data_cadastro : 'id' ], 
                order: [['ano_lectivo', 'ASC'], ['codigo_turma', 'ASC']],
                include: [
                    {
                        association: 'classe',
                        attributes: [ 'id', (nivel != 'false') ? nivel : 'id', ],
                        
                        include: {
                            association: 'curso',
                            attributes: [ 'id', (nome_curso != 'false') ? nome_curso : 'id', (codigo_curso != 'false') ? codigo_curso : 'id', ],
                        }
                    },

                    {
                        association: 'matriculas'
                    }
                ],
            });

            return res.render('./admin/pages/turmas_imprimir', { 
                turmas, 
                setDate,
                codigo_turma, 
                nome_curso, 
                codigo_curso, 
                nivel, 
                turno, 
                ano_lectivo, 
                matriculas, 
                data_cadastro 
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
        }
    },

    async miniPautaRender (req, res) {
        const { disciplina_id, turma_id } = req.params;
        try {

            const disciplina = await Disciplinas.findByPk(disciplina_id, {
                include: [
                    {
                        association: 'professores'
                    },

                    {
                        association: 'notas'
                    }
                ]
            });

            const turma = await Turmas.findByPk(turma_id, {
                include: [
                    {
                        association: 'matriculas',
                        include: [
                            {
                                order: [['nome', 'ASC']],
                                association: 'aluno'
                            },

                            {
                                association: 'notas',
                                where: {
                                    disciplina_id: disciplina_id
                                }
                            }
                        ]
                    },

                    {
                        association: 'classe',
                        include: 'curso'
                    }
                ]
            })

            const matriculas = await Matriculas.findAll({ 
                include: [
                    {
                        order: [['nome', 'ASC']],
                        association: 'aluno'
                    },

                    {
                        association: 'notas',
                        where: {
                            disciplina_id: disciplina_id
                        }
                    }
                ]
            });

            const funcionario = req.funcionario_logado

            res.render('./admin/pages/miniPauta', { 
                funcionario,
                setTime,
                turma,
                disciplina,
                matriculas
            });
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/dashboard');
        }
    }
       
    

}