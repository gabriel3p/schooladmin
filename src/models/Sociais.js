const { DataTypes, Model } = require('sequelize');

class Sociais extends Model {
    static init (sequelize) {
        super.init({
            funcionario_id: DataTypes.INTEGER,
            nome: DataTypes.STRING,
            link: DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'sociais',
        });
    }

    static associate (models) {
        this.belongsTo(models.Funcionarios, { foreignKey: 'funcionario_id', as: 'funcionarios' });
    }
}

module.exports = Sociais;