const Cursos = require('../models/Cursos');
const Turmas = require('../models/Turmas');
const Alunos = require('../models/Alunos');
const Classes = require('../models/Classes');
const Notas = require('../models/Notas');
const Matriculas = require('../models/Matriculas');

const { setDate, generateCode } = require('../helpers/utils');

module.exports = {

    //POST CONTROLLERS
    async buscarMatricula (req, res) {
        const { query } = req.body;
        try {

            if (!query) return res.status(400).json({ message: 'Preencha o campo de busca com o código de matrícula!', success: false });

            const matricula = await Matriculas.findOne({ 
                where: { codigo_matricula: query },
                include: [
                    {
                        association: 'aluno',
                    },

                    {
                        association: 'notas',
                        include: {
                            association: 'disciplina'
                        }
                    },

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
                        association: 'pagamentos',
                        include: [
                            {
                                association: 'mes'
                            },

                            {
                                association: 'funcionario'
                            }
                        ]
                    }
                ]
            });

            if (!matricula) return res.status(400).json({ message: 'Matrícula não encontrada, verifique o código de Matrícula', success: false, matricula: [] });

            res.json({ matricula })
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    },

    async alterarEstado (req, res) {
        const { estado_matricula, codigo_matricula } = req.body;

        try {

            if (!await Matriculas.findOne({ where: { codigo_matricula }})) {
                req.flash('error_msg', 'Matrícula não encontrada, por favor tente novamente!');
                res.redirect('/admin/alunos');
            }

            await Matriculas.update({ estado_matricula }, { where: { codigo_matricula } });

            req.flash('success_msg', 'Estado da matrícula alterado com sucesso!!');
            res.redirect('/admin/alunos');
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/alunos');
        }
    },

    async confirmarMatricula (req, res) {
        const { aluno_id, curso, nivel, turma_id, situacao_financeira, ano_lectivo, estado_matricula } = req.body;

        let codigo_matricula = '';
        const trimestres = [ 'I', 'II', 'III' ]

        try {

            let date = new Date();

            const classeAl = await Classes.findByPk(nivel, { include: { association: 'disciplinas' } });
            
            const aluno = await Alunos.findByPk(aluno_id);
            
            if (!aluno) return res.status(400).json({ message: 'Este aluno não existe!', success: false });


            do {
                codigo_matricula = generateCode();
            } while (await Matriculas.findOne({ where: { codigo_matricula } }));

            const matricula = await Matriculas.create({
                aluno_id: aluno.id, 
                codigo_matricula, 
                situacao_financeira, 
                estado_matricula, 
                ano_lectivo: (ano_lectivo) ? ano_lectivo : date.getFullYear(),
                bolderon: (req.file) ? req.file.filename : null,
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

            if (req.file) {
                return res.json({ message: 'Aluno confirmado com sucesso, verifique o seu email/telefone.', success: true });
            } else {
                return res.json({ message: 'Aluno confirmado com sucesso!', success: true });
            }         

        
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    }


    //GET CONTROLLERS


    //RENDER CONTROLLERS

}