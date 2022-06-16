const { Op } = require('sequelize');
const Sociais = require('../models/Sociais');
const nomes =  ['facebook', 'twitter', 'instagram', 'linkedin'];

module.exports = {
    async add_social (funcionario) {
        try {

            nomes.forEach(async name => {
                await Sociais.create({ nome: name, funcionario_id: funcionario.id  });
            });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
        }
    },

    async edit_social (funcionario_id, valores) {
        try {
            console.log(valores)
            valores.forEach(async (valor, index) => {
                await Sociais.update({ link: valor }, { where: { [Op.and]: { funcionario_id, nome: nomes[index] } } })
            })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });   
        }
    }
}