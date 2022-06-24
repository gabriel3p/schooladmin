const Cursos = require('../models/Cursos');
const Turmas = require('../models/Turmas');
const Alunos = require('../models/Alunos');
const Classes = require('../models/Classes');
const Notas = require('../models/Notas');
const Matriculas = require('../models/Matriculas');
const { Op } = require('sequelize');

const { setTime, setDate, generateCode, deletePhoto } = require('../helpers/utils');

module.exports = {
    //POST CONTROLLERS
    async matricular (req, res) {
        
        const { nome, nome_pai, nome_mae, nacionalidade, municipio, bairro, data_nascimento, genero, bi, phone1, phone2, email, situacao_aluno, curso, nivel, turma_id, estado_matricula, ano_lectivo, situacao_financeira } = req.body;
        let codigo_matricula = '';
        const trimestres = [ 'I', 'II', 'III' ]
        try {

            let date = new Date();

            const classeAl = await Classes.findByPk(nivel, { include: { association: 'disciplinas' } });
            
            
            if (await Alunos.findOne({ where: { bi } })) return res.status(400).json({ message: 'Já existe um aluno matriculado com este nº do BI', success: false });

            const aluno = await Alunos.create({
                foto: (req.files) ? req.files[0].filename : req.file.filename,
                nome, 
                nome_pai, 
                nome_mae, 
                nacionalidade, 
                municipio, 
                bairro, 
                data_nascimento, 
                genero, 
                bi, 
                phone1, 
                phone2, 
                email,
                situacao_aluno
            });

            do {
                codigo_matricula = generateCode();
            } while (await Matriculas.findOne({ where: { codigo_matricula } }));

            const matricula = await Matriculas.create({
                aluno_id: aluno.id, 
                codigo_matricula, 
                situacao_financeira, 
                estado_matricula, 
                ano_lectivo: (ano_lectivo) ? ano_lectivo : date.getFullYear(),
                bolderon: (req.files) ? req.files[1].filename : null,
            });

            const [ turma ] = await Turmas.findOrCreate({ where: { id: turma_id } });
            const [ classe ] = await Classes.findOrCreate({ where: { id: nivel } });

            Promise.all([
                matricula.addTurma(turma),
                matricula.addClasse(classe)
            ]);  
            
            classeAl.disciplinas.forEach(disciplina => {
                trimestres.forEach(async trimestre => {
                    await Notas.create({
                        matricula_id: matricula.id,
                        disciplina_id: disciplina.id,
                        trimestre: trimestre
                    });
                });
            });

            if (req.files) {
                return res.json({ message: 'Aluno matriculado com sucesso, verifique o seu email/telefone.', success: true });
            } else {
                return res.json({ message: 'Aluno matriculado com sucesso!', success: true });
            }         

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    },

    async editar (req, res) {
        const { id } = req.params;
        const { nome, nome_pai, nome_mae, genero, municipio, bairro, bi, nacionalidade, phone, phone2, email, situacao_aluno } = req.body;
        try {
            
            const aluno = await Alunos.findByPk(id);
            if (!aluno) {
                req.flash('error_msg', 'Aluno não encontrado!');
                res.redirect(`/admin/alunos/aluno/${ id }`);
            }

            if (req.file) {
                deletePhoto(aluno)
            }

            await Alunos.update({
                foto: (req.file) ? req.file.filename : aluno.foto,
                nome, 
                nome_pai, 
                nome_mae, 
                genero, 
                municipio, 
                bairro, 
                bi, 
                nacionalidade, 
                phone, 
                phone2, 
                email, 
                situacao_aluno 
            },{
                where: {
                    id
                }
            });

            res.redirect(`/admin/alunos/aluno/${ id }`);  

        } catch (error) {
            console.log(error)
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect(`/admin/alunos/aluno/${ id }`);
        }
    },

    async buscar (req, res) {
        const { 
            nome,
            ano_lectivo,
            situacao_matricula,
            nivel,
            codigo_curso,
            codigo_turma,
            bi,
            codigo_matrcula,
            email 
        } = req.body;

        try {

            const alunos = await Alunos.findAll({
                where: (nome || bi || email) ? {
                    [Op.or]:  {
                        nome: {
                            [Op.like]: `%${ (nome) ? nome : '' }%`
                        },
                        //nome: (nome) ? nome : '',
                        email: (email) ? email : '',
                        bi: (bi) ? bi : '',
                    },
                } : {},
                include: {
                    association: 'matriculas',
                    where: (ano_lectivo || situacao_matricula || codigo_matrcula) ? {
                        [Op.or]:  {
                            ano_lectivo: (ano_lectivo) ? ano_lectivo : '',
                            codigo_matricula: (codigo_matrcula) ? codigo_matrcula : '',
                            estado_matricula: (situacao_matricula) ? situacao_matricula : '',
                        },
                    } : {},
                    include: [
                        {
                            association: 'turma',
                            where: (codigo_turma) ? {
                                [Op.or]:  {
                                    codigo_turma: (codigo_turma) ? codigo_turma : '',
                                },
                            } : {},
                        },

                        {
                            association: 'classe',
                            where: (nivel) ? {
                                [Op.or]:  {
                                    nivel: (nivel) ? nivel : '',
                                },
                            } : {},
                            include: {
                                association: 'curso',
                                where: (codigo_curso) ? {
                                    [Op.or]:  {
                                        codigo_curso: (codigo_curso) ? codigo_curso : '',
                                    },
                                } : {},
                            }
                        }
                    ]
                }
            });

            return res.json({ alunos, funcionario: req.funcionario_logado });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
        }
    },

    //GET CONTROLLERS
    async delete (req, res) {
        const { id } = req.params;
        try {
            const aluno = await Alunos.findByPk(id)

            if (!aluno) {
                req.flash('error_msg', 'Este aluno não existe.');
                res.redirect('/admin/alunos');
            }

            deletePhoto(aluno);

            await Alunos.destroy({ where: { id } });

            req.flash('success_msg', 'Aluno deletado com sucesso!');
            res.redirect('/admin/alunos');
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente.');
            res.redirect('/admin/alunos');
        }
    },

    async pegarDados (req, res) {
        try {
            const alunos = await Alunos.findAll({
                include: {
                    association: 'matriculas',
                    include: [
                        {
                            association: 'classe'
                        },
                        {
                            association: 'turma'
                        },
                        {
                            association: 'notas'
                        },
                        {
                            association: 'pagamentos',
                            include: {
                                association: 'mes'
                            }
                        }
                    ]
                }
            });

            return res.json({ alunos });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false }); 
        }
    },

    //RENDER CONTROLLERS
    async alunosRender (req, res) {
        const numeroPagina = Number.parseInt(req.query.pagina);
        try {

            const cursos = await Cursos.findAll({ order: [['nome', 'ASC']] });
            const turmas = await Turmas.findAll({ order: [['codigo_turma', 'ASC']] });
            
            let pagina = 0;
            if (!Number.isNaN(numeroPagina) && numeroPagina > 0) {
                pagina = numeroPagina - 1;
            }
        
            let tamanho =  10;

            const { rows, count } = await Alunos.findAndCountAll({ 
                order: [['nome', 'ASC']],
                include: {
                    association: 'matriculas',
                    include: [
                        {
                            association: 'classe',
                            include: {
                                association: 'curso'
                            }
                        },

                        {
                            association: 'turma'
                        }
                    ]
                },
                limit: tamanho,
                offset: pagina * tamanho, 
            });

            const funcionario = req.funcionario_logado;

            res.render('./admin/pages/alunos', { 
                funcionario,
                message: req.messages,
                setTime,
                cursos,
                turmas,
                alunos: rows, 
                paginasTotal: Math.ceil(count / tamanho), 
                pagina: pagina + 1
            });
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente.');
            res.redirect('/admin/dashboard');
        }
    },

    async matricularRender (req, res) {
        try {
            const funcionario = req.funcionario_logado;
            const cursos = await Cursos.findAll({ order: [['nome', 'ASC']] });

            res.render('./admin/pages/matricular', { 
                funcionario,
                message: req.messages,
                setTime,
                cursos
            });
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente.');
            res.redirect('/admin/alunos');
        }
    },

    async confirmarMatriculaRender (req, res) {
        try {
            const funcionario = req.funcionario_logado;
            const cursos = await Cursos.findAll({ order: [['nome', 'ASC']] });

            res.render('./admin/pages/confirmarMatricula', { 
                funcionario,
                message: req.messages,
                setTime,
                cursos
            });
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente.');
            res.redirect('/admin/alunos');
        }
    },

    async perfilAlunoRender (req, res) {

        const { id } = req.params;

        try {
            const cursos = await Cursos.findAll();

            const funcionario = req.funcionario_logado;

            const aluno = await Alunos.findByPk(id, {
                include: {
                    association: 'matriculas',
                    include: [
                        {
                            association: 'classe',
                            include: {
                                association: 'curso'
                            }
                        },

                        {
                            association: 'turma'
                        }, 

                        {
                            association: 'notas',
                            include: {
                                association: 'disciplina'
                            }
                        },

                        {
                            association: 'pagamentos',
                            include:[ 
                                {
                                    association: 'mes'
                                },

                                {
                                    association: 'funcionario'
                                }
                            ]
                        }
                    ]
                },
            });

            if (!aluno) {
                req.flash('error_msg', 'Aluno não encontrado!');
                res.redirect('/admin/alunos');
            }

            
            res.render('./admin/pages/perfilAluno', { 
                aluno,
                funcionario,
                message: req.messages,
                setTime,
                setDate,
                cursos 
            });
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente.');
            res.redirect('/admin/alunos');
        }
    }
}