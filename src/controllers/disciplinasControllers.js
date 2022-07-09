const { Op } = require('sequelize');
const Cursos = require('../models/Cursos');
const Classes = require('../models/Classes');
const Disciplinas = require('../models/Disciplinas');
const Turmas = require('../models/Turmas');
const Funcionarios = require('../models/Funcionarios');
const Matriculas = require('../models/Matriculas');
const Notas = require('../models/Notas');




const { setTime } = require('../helpers/utils');

module.exports = {
    //POST CONTROLLERS
    async disciplinasCadastrar (req, res) {
        const { curso_id, nivel, disciplina, abreviacao } = req.body;
        const trimestres = [ 'I', 'II', 'III' ]

        try {
            

            if (!await Cursos.findByPk(curso_id)) return res.status(400).json({ message: 'Curso não encontrado!', success: false });

           
            if (typeof (nivel) === 'object') {

                nivel.forEach(async (niv, index) => {
                    let classe = await Classes.findOne({ where: { curso_id, nivel: niv } });

                    const matriculas = await Matriculas.findAll({
                        include: {
                            required: true,
                            association: 'classe',
                            where: {
                                curso_id, 
                                nivel: niv 
                            }
                        }
                    });


                    if (!classe) return res.status(400).json({ message: 'Classe não encontrada!', success: false });

                    let disc = await Disciplinas.findOne({ where: { [Op.and]: { [Op.or]: { classe_id: classe.id, nome_disciplina: disciplina[index] }, [Op.and]: { classe_id: classe.id, abreviacao: abreviacao[index].toUpperCase() } } } })

                    if (!disc) {
                        const newDisciplina = await Disciplinas.create({ classe_id: classe.id, abreviacao: abreviacao[index].toUpperCase(), nome_disciplina: disciplina[index] });

                        matriculas.forEach(matricula => {
                            trimestres.forEach(async trimestre => {
                                await Notas.create({
                                    matricula_id: matricula.id,
                                    disciplina_id: newDisciplina.id,
                                    trimestre: trimestre
                                });
                            });
                        });
                    }
                });

                return res.json({ message: 'Disciplinas adicionadas com sucesso.', success: true });

            } else {

                const matriculas = await Matriculas.findAll({
                    include: {
                        required: true,
                        association: 'classe',
                        where: {
                            curso_id, 
                            nivel 
                        }
                    }
                });

                const classe = await Classes.findOne({ where: { curso_id, nivel } });

                if (!classe) return res.status(400).json({ message: 'Classe não encontrada!', success: false });

                if (await Disciplinas.findOne({ where: { [Op.or]: { [Op.and]: { classe_id: classe.id, abreviacao: abreviacao.toUpperCase() }, [Op.and]: { classe_id: classe.id,  nome_disciplina: disciplina } } } })) return res.status(400).json({ message: `${ classe.nivel }ª classe já possui ${ disciplina }/${ abreviacao.toUpperCase() }.`, success: false });

                const newDisciplina = await Disciplinas.create({ classe_id: classe.id, abreviacao: abreviacao.toUpperCase(), nome_disciplina: disciplina });

                matriculas.forEach(matricula => {
                    trimestres.forEach(async trimestre => {
                        await Notas.create({
                            matricula_id: matricula.id,
                            disciplina_id: newDisciplina.id,
                            trimestre: trimestre
                        });
                    });
                });

                return res.json({ message: 'Disciplina adicionada com sucesso.', success: true });

            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    },

    //GET CONTROLLERS
    async deletar (req, res) {
        const { id } = req.params;
        try {

            if (!await Disciplinas.findByPk(id)) {
                req.flash('error_msg', 'Esta disciplina não existe!');
                return res.redirect('/admin/cursos');
            }

            await Disciplinas.destroy({ where: {
                id
            } });

            req.flash('success_msg', 'Disciplina deletada com sucesso!');
            res.redirect('/admin/cursos');
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/cursos');
        }
    },

    async remove (req, res) {
        const { perfil_id, disciplina_id, turma_id } = req.params;
        try {
            const funcionario = await Funcionarios.findByPk(perfil_id, {
                include: {
                    association: 'turmas'
                }
            });

            if (!funcionario) {
                req.flash('error_msg', 'Professor não encontrado.');
                res.redirect(`/admin/perfil/${ perfil_id }`);
            }

            if (disciplina_id) { // funcionario.turmas.length < 2
                const disciplina = await Disciplinas.findOne({ where: { id: disciplina_id } });
                await funcionario.removeDisciplina(disciplina);

            }

            if (turma_id != -1) {
                const turma = await Turmas.findOne({ where: { id: turma_id } });
                await funcionario.removeTurma(turma, { limit: 1 })
            }            

            req.flash('success_msg', 'Disciplina removida do Professor com sucesso!');
            res.redirect(`/admin/perfil/${ perfil_id }`);

        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente.');
            res.redirect(`/admin/perfil/${ perfil_id }`);
        }
    },

    //RENDER CONTROLLERS
    async disciplinasCadastrarRender (req, res) {
        try {
            const cursos = await Cursos.findAll({
                include: {
                    association: 'classes',
                    attributes: ['nivel', 'preco']
                }
            });
            const funcionario = req.funcionario_logado;

            res.render('./admin/pages/disciplinaCadastrar', { funcionario, cursos, message: req.messages, setTime });
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect('/admin/cursos');
        }
    }
}