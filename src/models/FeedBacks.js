const { DataTypes, Model } = require('sequelize');

class FeedBacks extends Model {
    static init (sequelize) {
        super.init({
            nome: DataTypes.STRING,
            contacto: DataTypes.STRING,
            assunto: DataTypes.STRING,
            mensagem: DataTypes.TEXT,
            lida: DataTypes.BOOLEAN,
        }, {
            sequelize,
            tableName: 'feedbacks'
        });
    }
}

module.exports = FeedBacks;