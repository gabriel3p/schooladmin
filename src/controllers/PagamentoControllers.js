
const Meses = require('../models/Meses');
const Alunos = require('../models/Alunos');
const Pagamentos = require('../models/Pagamentos');

const { setTime } = require('../helpers/utils');

module.exports = {
    //GET CONTROLLERS

    //POST CONTROLLERS
    async pagamento (req, res) {
        const { meses, funcionario_id, forma_pagamento, valor_pago, matricula_id } = req.body;
        try {

            const pagamentos = [];
            const aluno = await Alunos.findOne({ 
                include: {
                    association: 'matriculas',
                    where: { id: matricula_id }
                }
             });

           if (typeof meses == 'object') {
                meses.forEach(async (mes, index) => {
                    const mesPago = await Meses.findOne({ where: { mes } });

                    if (!await Pagamentos.findOne({ where: {  mes_id: mesPago.id, matricula_id } })) { 
                        
                        const pagamento = await Pagamentos.create({
                            mes_id: mesPago.id,
                            valor_pago: valor_pago[index],
                            funcionario_id: req.funcionario_logado.id,
                            matricula_id,
                            forma_pagamento,
                        });
   
                        pagamentos.push(pagamento)
                    }

                });

           } else {
                const mesPago = await Meses.findOne({ where: { mes: meses } });

                if (!await Pagamentos.findOne({ where: {  mes_id: mesPago.id, matricula_id } })) {

                    const pagamento = await Pagamentos.create({
                        mes_id: mesPago.id,
                        valor_pago,
                        funcionario_id: req.funcionario_logado.id,
                        matricula_id,
                        forma_pagamento,
                    });
    
                    pagamentos.push(pagamento)

                }

           }


            return res.render('./admin/pages/pagamentoFatura', {
                aluno,
                forma_pagamento,
                valor_pago,
                funcionario: req.funcionario_logado,
                meses
            });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Houve um erro interno, por favor tente novamente!', success: false });
        }
    },

    //RENDER CONTROLLERS
    async pagamentoRender (req, res) {
        try {

            res.render('./admin/pages/pagamento', {
                funcionario: req.funcionario_logado,
                message: req.messages,
                setTime,
            });
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente.');
            res.redirect('/admin/alunos');
        }
    }
}