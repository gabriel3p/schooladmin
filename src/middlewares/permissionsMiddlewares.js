module.exports = {
    eDiretor: (req, res, next) => {
        if (!req.funcionario_logado.cargo.toLowerCase() === 'diretor') {
            req.falsh('error_msg', 'Você não tem permissão para isso!');
            res.redirect('/admin/dashboard');
        }
        next();
    }
}