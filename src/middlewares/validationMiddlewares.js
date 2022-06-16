const { verify } = require('jsonwebtoken');
const Funcionarios = require('../models/Funcionarios');

module.exports = {
    validateToken(req, res, next) {
        const accessToken = req.cookies['access-token'];

        if (!accessToken) {
            return res.redirect('/admin/entrar')
        } 

        try {
            verify(accessToken, process.env.TOKEN_SECRET, async (error, decoded) => {
                if (error) {
                    req.flash('error_msg', 'Token inválido!');
                    return res.redirect('/admin/login')
                } 

                req.funcionario_logado = await Funcionarios.findByPk(decoded.id, {
                    include: [
                        {
                            association: 'sociais',
                            attributes: ['nome', 'link'],
                        },
                        
                        {
                            association: 'disciplinas',
                            include: {
                                association: 'classe',
                                include: [
                                    {
                                        association: 'curso'
                                    },

                                    {
                                        association: 'turmas'
                                    },

                                    {
                                        association: 'matriculas'
                                    }
                                ]
                            }
                        },

                        {
                            association: 'turmas',
                            include: [
                                {
                                    association: 'classe',
                                    include: [
                                        {
                                            association: 'curso'
                                        },
                                    ]
                                },

                                {
                                    association: 'matriculas'
                                }
                            ]
                        }
                    ]
                });
                req.authenticated = true;

                next();
            })
        } catch (error) {
            return res.status(400).json({ error: `Erro na autenticação: ${ error }` });
            
        }
    },
}