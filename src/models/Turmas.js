const { DataTypes, Model } = require('sequelize');

class Turmas extends Model {
    static init (sequelize) {
        super.init({
            classe_id: DataTypes.INTEGER,
            codigo_turma: DataTypes.STRING,
            turno: DataTypes.ENUM('t', 'm'),
            ano_lectivo: DataTypes.INTEGER,
        }, {
            sequelize,
            tableName: 'turmas',
        });
    }

    static associate (models) {
        this.belongsTo(models.Classes, { foreignKey: 'classe_id', as: 'classe' });
        this.belongsToMany(models.Matriculas, { foreingKey: 'turma_id', through: 'turma_matriculas', as: 'matriculas' });
        this.belongsToMany(models.Funcionarios, { foreingKey: 'turma_id', through: 'professor_turmas', as: 'professor' });
    }
} 

module.exports = Turmas;