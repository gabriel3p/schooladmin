const FeedBacks = require('../models/FeedBacks');
const { Op } = require('sequelize');

const { setTime } = require('../helpers/utils');

module.exports = {
    //POST CONTROLLERS
    async enviar (req, res) {
        try {
            
            await FeedBacks.create(req.body);

            res.json({ 
                message: 'Sua mensagem foi enviada. Obrigado!',
                success: true,
             });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ 
                message: 'Houve um erro interno, por favor tente novamente.',
                success: false, 
            });
        }
    },

    async feedback_pesquisar (req, res) {
        try {
            const { pesquisa } = req.body;

            const feedbacks = await FeedBacks.findAll({
                order: [['lida', 'ASC'], ['id', 'DESC']],
                where: { 
                    [Op.or]: {
                        nome: {
                            [Op.like]: `%${ pesquisa }%`
                        },
                        contacto: {
                            [Op.like]: `%${ pesquisa }%`
                        },
                        assunto: {
                            [Op.like]: `%${ pesquisa }%`
                        }
                    } 
                 }
            });

            return res.json({ feedbacks, success: true });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ 
                message: 'Houve um erro interno, por favor tente novamente.',
                success: false, 
            });
        }
    },

    //GET CONTROLLERS
    async deletar (req, res) {
        const { id } = req.params;
        try {

            if (!await FeedBacks.findByPk(id)) {
                req.flash('error_msg', 'Mensagem não encontrada.');
                return res.redirect('/admin/feedbacks');
            }

            await FeedBacks.destroy({ where: { id } });
            return res.redirect('/admin/feedbacks');
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente');
            res.redirect('/admin/feedbacks');
        }
    },

    //RENDER CONTROLLERS
    async feedbacksRender (req, res) {
        const numeroPagina = Number.parseInt(req.query.pagina);
        try {

            let tamanho =  10;
            let pagina = 0;
            if (!Number.isNaN(numeroPagina) && numeroPagina > 0) {
                pagina = numeroPagina - 1;
            }

            const { rows, count } = await FeedBacks.findAndCountAll({ 
                order: [['lida', 'ASC'], ['id', 'DESC']],
                limit: tamanho,
                offset: pagina * tamanho,  
            });

            const funcionario = req.funcionario_logado;

            res.render('./admin/pages/feedbacks', { 
                funcionario, 
                message: req.messages, 
                setTime,
                feedbacks: rows, 
                paginasTotal: Math.ceil(count / tamanho), 
                pagina: pagina + 1  
            });
            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente');
            res.redirect('/admin/dashboard');
        }
    },

    async visFeedbackRender (req, res) {
        const { id } = req.params;
        try {


            const feedback = await FeedBacks.findByPk(id);

            const funcionario = req.funcionario_logado;

            if (!feedback) {
                req.flash('error_msg', 'Mensagem não encontrada.');
                return res.redirect('/admin/feedbacks');
            }

            await FeedBacks.update({ lida: true }, { where: { id } });

            res.render('./admin/pages/visFeedback', {
                setTime,
                feedback,
                funcionario, 
                message: req.messages, 
            });

            
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Houve um erro interno, por favor tente novamente');
            res.redirect('/admin/feedbacks');
        }
    }
} 