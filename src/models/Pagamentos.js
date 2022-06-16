const { Model, DataTypes } = require('sequelize');

class Pagamentos extends Model {
    static init (sequelize) {
        super.init ({
            funcionario_id: DataTypes.INTEGER,
            mes_id: DataTypes.INTEGER,
            matricula_id: DataTypes.INTEGER,
            valor_pago: DataTypes.INTEGER,
            forma_pagamento: DataTypes.STRING,
        }, {
            sequelize
        });
    }

    static associate (models) {
        this.belongsTo(models.Matriculas, { foreingKey: 'matricula_id', as: 'matricula' });
        this.belongsTo(models.Funcionarios, { foreignKey: 'funcionario_id', as: 'funcionario' });
        this.belongsTo(models.Meses, { foreingKey: 'mes_id', as: 'mes' });
    }
}

module.exports = Pagamentos;