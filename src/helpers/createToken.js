const { sign } = require('jsonwebtoken');

module.exports = {
    createToken (funcionario) {
        const accessToken = sign({
            email: funcionario.usuario,
            id: funcionario.id
        }, process.env.TOKEN_SECRET);

        return accessToken;
    }
}