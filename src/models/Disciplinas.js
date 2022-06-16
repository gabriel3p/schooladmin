const { Model, DataTypes } = require('sequelize');

class Disciplinas extends Model {
    static init (sequelize) {
        super.init({
            classe_id: DataTypes.INTEGER,
            nome_disciplina: DataTypes.STRING,
            abreviacao: DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'disciplinas',
        });
    }

    static associate (models) {
        this.belongsTo(models.Classes, { foreignKey: 'classe_id', as: 'classe' });
        this.belongsToMany(models.Funcionarios, { foreignKey: 'disciplina_id', through: 'professores_disciplinas', as: 'professores' });
        this.hasMany(models.Notas, { foreignKey: 'disciplina_id', as: 'notas' });
    }
}

module.exports = Disciplinas;

