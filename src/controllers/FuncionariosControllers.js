const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const Cursos = require('../models/Cursos');
const Alunos = require('../models/Alunos');
const Feedbacks = require('../models/FeedBacks');
const Disciplinas = require('../models/Disciplinas');
const Turmas = require('../models/Turmas');
const Funcionarios = require('../models/Funcionarios');
const SociaisControllers = require('../controllers/SociaisControllers');

const { createToken } = require('../helpers/createToken');
const { deletePhoto, setDate, setTime } = require('../helpers/utils');

module.exports = {

    //POST controllers
    async auth (req, res) {
        const { usuario, senha } = req.body;
        try {

            const funcionario = await Funcionarios.findOne({ where: { usuario } });

            if (!funcionario) return res.status(400).json({ message: 'Usuário* não encontrado!', success: false });
            
            await bcrypt.compare(senha, funcionario.senha).then(async batem => {
                
                if (!batem) return res.status(400).json({ message: 'Senha* incorrecta!', success: false });

                const token = createToken(funcionario);
                res.cookie('access-token', token, {
                    maxAge: 12 * 15 * 24 * 20 * 1000,
                    httpOnly: true,
                });

                await Funcionarios.update({ ativo: true }, { where: { usuario } });

                return res.json({ message: 'Login feito com sucesso.', success: true });
                //return res.redirect('/admin/dashboard');
            }).catch(error => {
                console.log(error)
                res.status(500).json({ message: 'Houve um erro durante a autenticação, por favor tente novamente!', success: false });
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    },

    async editFuncinonario (req, res) {
        const { 
            telefone, 
            estado_civil, 
            usuario, 
            email, 
            nome, 
            sobrenome, 
            data_nascimento, 
            genero, 
            biografia,  
            area_formação, 
            instituto_ensino, 
            grau, 
            nacionalidade,
            bi,
            twitter,
            facebook,
            instagram,
            linkedin,
        } = req.body;

        try {

            const funcionario = await Funcionarios.findOne({ where: { usuario: req.params.usuario } });
            const usuarioEncontrado = await Funcionarios.findOne({ where: { usuario } });
            const emailEncontrado = await Funcionarios.findOne({ where: { email } });

            if (!funcionario) return res.status(400).json({ message: 'Funcionário não encontrado.', success: false });

            if (usuarioEncontrado && funcionario.usuario !== usuarioEncontrado.usuario) return res.status(400).json({ message: 'Este nome de usuário* já está em uso.', success: false });

            if (emailEncontrado && funcionario.email !== emailEncontrado.email) return res.status(400).json({ message: 'Este email* já está em uso.', success: false });


            if (req.file) {
                deletePhoto(funcionario);
            }

            await Funcionarios.update({ 
                foto: (req.file) ? req.file.filename : funcionario.foto,
                telefone, 
                estado_civil, 
                usuario, 
                email, 
                nome, 
                sobrenome, 
                data_nascimento, 
                genero, 
                biografia,  
                area_formação, 
                instituto_ensino, 
                grau, 
                nacionalidade,
                bi
            }, {
                where: { usuario: req.params.usuario } 
            });

            SociaisControllers.edit_social(funcionario.id, [ facebook, twitter, instagram, linkedin, ]);

            res.status(200).json({ message: 'Dados enviados com sucesso!', success: true });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
        }
    },

    async alterarSenha (req, res) {
        const { senha, novaSenha, novaSenha2 } = req.body;
        const { usuario } = req.params;
        try {

            const funcionario = await Funcionarios.findOne({ where: { usuario } });

            if (!funcionario) return res.status(400).json({ message: 'Usuário* não encontrado!', success: false });

            await bcrypt.compare(senha, funcionario.senha).then(async batem => {
                
                if (!batem) return res.status(400).json({ message: 'Senha* actual incorrecta!', success: false });

                if (novaSenha !== novaSenha2) return res.status(400).json({ message: 'As senhas* são diferentes!', success: false });

                await bcrypt.hash(novaSenha, 10).then(async hash => {
                   
                    await Funcionarios.update({ senha: hash }, { where: { usuario } });

                    return res.json({ message: 'Senha* alterada com sucesso!', success: true });
                   
                }).catch(error => {
                    console.log(error)
                    console.log(error)
                    res.status(500).json({ message: 'Erro ao salvar a senha, por favor tente novamente!', success: false });
                });                
            }).catch(error => {
                console.log(error)
                res.status(500).json({ message: 'Erro ao salvar a senha, por favor tente novamente!', success: false });
            });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
        }
    },

    async buscar (req, res) {
        //const { nome, sobrenome, bi, data_nascimento, cargo, ativo, grau, instituto_ensino } = req.body;
        try {

            const funcionarios = await Funcionarios.findAll({ where: req.body, order: [[ 'nome', 'ASC' ], [ 'sobrenome', 'ASC' ]] });

            res.json({ funcionarios });   
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
        }
    },

    async registro(req, res) {
        const { usuario, email, nome, sobrenome, data_nascimento, genero, cargo, senha, bi, telefone } = req.body;
        try {

            let FileFoto;

            //console.log(req.body)


            if (await Funcionarios.findOne({ where: { email }})) return res.status(400).json({ message: 'Email* existente.', success: false });
            
            if (await Funcionarios.findOne({ where: { bi }})) return res.status(400).json({ message: 'Bilhete de Identidade* existente.', success: false });

            if (await Funcionarios.findOne({ where: { usuario }})) return res.status(400).json({ message: 'Usuário* existente.', success: false });

           if (!req.file) {
               if (genero === 'M') {
                   FileFoto = 'static/avatar04.png';
               } else {
                    FileFoto = 'static/avatar2.png';
               }
           } else {
                FileFoto = req.file.filename;
           } 

            const funcionario = await Funcionarios.create({ 
                foto: FileFoto,
                usuario, 
                email, 
                nome, 
                sobrenome, 
                data_nascimento, 
                genero, 
                cargo, 
                senha,
                bi, 
                telefone,
                ativo: false, 
            });

            SociaisControllers.add_social(funcionario);

            return res.json({ message: 'Funcionário cadastrado com sucesso!', success: true });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    },

    //GET's controllers
    async logOut (req, res) {
        const { usuario } = req.params;
        try {
            await Funcionarios.update({ ativo: false }, { where: { usuario } });
            res.cookie('access-token', '', { maxAge: 1 });
            res.redirect('/admin/entrar');
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/dashboard');
        }
    },

    async delete (req, res) {
        const { usuario } = req.params;
        try {
            const funcionario = await Funcionarios.findOne({ where: { usuario } });

            if (!funcionario) return res.status(400).json({ message: 'Funcionário não encontrado.', success: false });

            deletePhoto(funcionario);

            await Funcionarios.destroy({ where: { usuario } });

            res.cookie('access-token', '', { maxAge: 1 });
            res.redirect('/admin/entrar');
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/perfil');
        }
    },

    async deletarConta (req, res) {
        const { id } = req.params;
        try {
            const funcionario = await Funcionarios.findByPk(id);

            if (!funcionario) {
                req.flash('error_msg', 'Funcionário não encontrado.');
                res.redirect('/admin/funcionarios');
            } 

            deletePhoto(funcionario);

            await Funcionarios.destroy({ where: { id } });

            if (req.funcionario_logado.id === parseInt(id)) {
                res.cookie('access-token', '', { maxAge: 1 });
                return res.redirect('/admin/entrar');
            }

            req.flash('success_msg', 'Funcionário deletado com sucesso!');
            res.redirect('/admin/funcionarios');
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/funcionarios');
        }
    },

    async adicionarDisciplina (req, res) {
        const { professor_id, disciplina_id, turma_id, disciplina_nome, turma_nome } = req.body;
        try {

            if (typeof professor_id == 'object') {

                professor_id.forEach(async (id, index) => {
                    let professor = await Funcionarios.findByPk(id, {
                        include: [
                            {
                                required: true,
                                association: 'turmas',
                                where: {
                                    id: turma_id[index]
                                }
                            },
    
                            {
                                required: true,
                                association: 'disciplinas',
                                where: {
                                    id: disciplina_id[index]
                                }
                            }
                        ]
                    });

                    if (!professor) {
                        professor = await Funcionarios.findByPk(id)

                        const [ disciplina ] = await Disciplinas.findOrCreate({ where: { id: disciplina_id[index] } });
    
                        const [ turma ] = await Turmas.findOrCreate({ where: { id: turma_id[index] } });
    
            
                        Promise.all([
                            professor.addDisciplina(disciplina),
                            professor.addTurma(turma)
                        ]);
                        
                    } 

                   
                   
                });
                res.json({ message: 'Disciplinas adicionadas aos professores com sucesso!', success: true });

            } else {
                let professor = await Funcionarios.findByPk(professor_id, {
                    include: [
                        {
                            required: true,
                            association: 'turmas',
                            where: {
                                id: turma_id
                            }
                        },

                        {
                            required: true,
                            association: 'disciplinas',
                            where: {
                                id: disciplina_id
                            }
                        }
                    ]
                });

                if (professor) {

                    return res.json({ message: `A turma ${ turma_nome } já tem um professor de ${ disciplina_nome }`, success: false });

                } else {

                    professor = await Funcionarios.findByPk(professor_id)
                    const [ disciplina ] = await Disciplinas.findOrCreate({ where: { id: disciplina_id } });

                    const [ turma ] = await Turmas.findOrCreate({ where: { id: turma_id } });

                    console.log(turma)
                    console.log(disciplina);
        
                    Promise.all([
                        professor.addDisciplina(disciplina),
                        professor.addTurma(turma)
                    ]);
                    
                    res.json({ message: 'Disciplina adicionada ao professor com sucesso!', success: true });

                }

               
            }

           

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    },

   


    //Controllers para Renderização

    async dashboardRender (req, res) {
        try {

            const totalAlunos = await Alunos.count();
            const { count } = await Alunos.findAndCountAll({ where: { situacao_aluno: 'ativo' }});
            const funcionario = req.funcionario_logado;
           
            const totalFuncionariosAtivos = await Funcionarios.findAndCountAll({ where: { ativo: true }});
            const totalFuncionarios = await Funcionarios.count();

            const totalCursos = await Cursos.count();
            const cursos = await Cursos.findAll({ 
                include: { 
                    association: 'classes',
                    attributes: ['nivel', 'preco'],
                    include: {
                        association: 'turmas',
                        attributes: ['codigo_turma'],
                        include: {
                            association: 'matriculas'
                        }
                    }
                } 
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
                            id: funcionario.id,
                        }
                    },

                    {
                        association: 'matriculas'
                    }
                ]
            }); 


            let totTurmasProfessor = 0;

            turmas.forEach(turma => {
                turma.classe.disciplinas.forEach(disciplina => {
                    disciplina.professores.forEach(prof => {
                        if (funcionario.id == prof.id) {
                            totTurmasProfessor++;
                        }
                    });
                });
            });

            res.render('./admin/index', { 
                funcionario, 
                totalFuncionarios, 
                totalFuncionariosAtivos,
                totalCursos,
                cursos,
                message: req.messages,
                setTime,
                totalAlunos,
                totalAlunosAtivos: count,
                totTurmasProfessor             
             });

        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/entrar');
        }
    },

    async perfilRender (req, res) {
        const { id } = req.params;
        try {
            const perfil = await Funcionarios.findByPk(id, { 
                include: [
                    {
                        association: 'sociais',
                        attributes: ['nome', 'link'],
                    },

                    {
                        association: 'turmas',
                        include: {
                            association: 'professor'
                        }
                    },

                    {
                        order: [['nome_disciplina', 'ASC']],
                        association: 'disciplinas',
                        include: {
                            association: 'classe',
                            include: {
                                association: 'curso'
                            }
                        }
                    }
                ]
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
                        association: 'matriculas'
                    },

                    {
                        required: true,
                        association: 'professor',
                        where: {
                            id: id,
                        }
                    }

                ]
             }); 


            const funcionario = req.funcionario_logado;
                      
            
            const sociais = perfil.sociais.map(item => {
                let { dataValues } = item
                return dataValues;
            })           
            
            res.render('./admin/pages/perfil', { funcionario, setDate, perfil, sociais, message: req.messages, setTime, turmas });
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/dashboard');
        }
    },

    async loginRender (req, res) {
        try {
            if (req.cookies['access-token']) return res.redirect('/admin/dashboard')
            
            res.render('./admin/pages/login');
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/');
        }
    },

    async funcionariosRender (req, res) {
        const numeroPagina = Number.parseInt(req.query.pagina);
    
        try {
            let pagina = 0;
            if (!Number.isNaN(numeroPagina) && numeroPagina > 0) {
                pagina = numeroPagina - 1;
            }
        
            let tamanho =  10;

            const { rows, count } = await Funcionarios.findAndCountAll({ 
                order: [[ 'nome', 'ASC' ], [ 'sobrenome', 'ASC' ]],
                limit: tamanho,
                offset: pagina * tamanho, 
            });
            const funcionario = req.funcionario_logado;
            

            res.render('./admin/pages/funcionarios', { funcionario, message: req.messages, setTime, funcionarios: rows, paginasTotal: Math.ceil(count / tamanho), pagina: pagina + 1 });
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente.');
            res.redirect('/admin/dashboard');
        }
    },

    async registroRender (req, res) {
        try {

            const funcionario = req.funcionario_logado;

            res.render('./admin/pages/register', { funcionario, message: req.messages, setTime });
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!')
            res.redirect('/admin/funcionarios');
        }
    },

    async adicionarDisciplinaRender (req, res) {
        try {
            const cursos = await Cursos.findAll();
            const funcionario = req.funcionario_logado;

            const professores = await Funcionarios.findAll({ where: { cargo: 'Professor' } });

            res.render('./admin/pages/professorDisciplina', { funcionario, message: req.messages, setTime, cursos, professores });
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!')
            res.redirect('/admin/funcionarios');
        }
    },

    /**CONTROLLERS PRIVADOS */

    registroPrivadoRender (req, res) {
        try {
            res.render('./admin/pages/adminRegister');
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!')
            res.redirect('/admin/entrar');
        }
    },

    async registroPrivado (req, res) {
        const { usuario, email, nome, sobrenome, data_nascimento, genero, cargo, senha } = req.body;
        try {

            if (await Funcionarios.findOne({ where: { email }})) return res.status(400).json({ message: 'Email* existente.', success: false });

            if (await Funcionarios.findOne({ where: { usuario }})) return res.status(400).json({ message: 'Usuário* existente.', success: false });


            const funcionario = await Funcionarios.create({ 
                foto: (genero === 'M') ? 'static/avatar04.png' : 'static/avatar2.png',
                usuario, 
                email, 
                nome, 
                sobrenome, 
                data_nascimento, 
                genero, 
                cargo, 
                senha,
                ativo: true, 
            });

            SociaisControllers.add_social(funcionario);

            const token = createToken(funcionario);
            res.cookie('access-token', token, {
                maxAge: 12 * 15 * 24 * 20 * 1000,
                httpOnly: true,
            });

            return res.json({ message: 'Conta criada com sucesso!', success: true });
            //return res.redirect('/admin/dashboard');

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    }
}
