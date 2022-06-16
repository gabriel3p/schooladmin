const { Model, DataTypes } = require('sequelize');

class Notas extends Model {
    static init (sequelize) {
        super.init({
            matricula_id: DataTypes.INTEGER,
            disciplina_id: DataTypes.INTEGER,
            prova1: DataTypes.FLOAT,
            prova2: DataTypes.FLOAT,
            trimestre: DataTypes.STRING,
        }, {
            sequelize
        });
    }

    static associate (models) {
        this.belongsTo(models.Matriculas, { foreignKey: 'matricula_id', as: 'matricula' });
        this.belongsTo(models.Disciplinas, { foreignKey: 'disciplina_id', as: 'disciplina' });
    }
}

module.exports = Notas;