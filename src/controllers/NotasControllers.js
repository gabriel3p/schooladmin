const Notas = require('../models/Notas')
const Alunos = require('../models/Alunos');

module.exports = {
    //POST CONTROLLERS
    async editarNotas (req, res) {
        const { turma_id, disciplina_id } = req.params;
        const { trimestre, prova1, prova2, matricula_id } = req.body;

        try {

            if (typeof matricula_id == 'object') {
                matricula_id.forEach(async (matricula, index) => {
                    await Notas.update(
                        {
                            prova1: prova1[index] || 0,
                            prova2: prova2[index] || 0
                        },
                        {
                            where: { 
                                trimestre,
                                disciplina_id,
                                matricula_id: matricula
                            }
                        }, 
                    );
                });
            } else {
                await Notas.update(
                    {
                        prova1: prova1 || 0,
                        prova2: prova2 || 0
                    },
                    {
                        where: { 
                            trimestre,
                            disciplina_id,
                            matricula_id: matricula_id
                        }
                    }, 
                );
            }           


            req.flash('success_msg', 'Notas atualizadas com sucesso!');
            return res.redirect(`/admin/turmas/pauta/${ disciplina_id }/${ turma_id }`);
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente!');
            res.redirect(`/admin/turmas/pauta/${ disciplina_id }/${ turma_id }`);
        }
    },

    //GET CONTROLLERS
    async pegarNotas (req, res) {
        const { trimestre, disciplina_id, turma_id } = req.params;

        try {
            const notas = await Notas.findAll({ where: { trimestre } });
            const alunos = await Alunos.findAll({
                include: {
                    required: true,
                    association: 'matriculas',
                    include: [
                        {
                            requried: true,
                            association: 'turma',
                            where: { id: turma_id }
                        },

                        {
                            required: true,
                            association: 'notas',
                            where: { trimestre, disciplina_id }
                        }
                    ]
                }
            });

            return res.json({ alunos });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });  
        }
    }

    //RENDER CONTROLLERS
}