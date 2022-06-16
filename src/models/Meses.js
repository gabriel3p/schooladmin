const { Model, DataTypes } = require('sequelize');

class Meses extends Model {
    static init (sequelize) {
        super.init({
            mes: DataTypes.STRING,
            pos: DataTypes.INTEGER,
        }, {
            sequelize
        });
    }

    static associate (models) {
        this.hasMany(models.Pagamentos, { foreignKey: 'mes_id', as: 'pagamentos' });
    }
}

module.exports = Meses;