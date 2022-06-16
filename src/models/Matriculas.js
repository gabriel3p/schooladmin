const { Model, DataTypes } = require('sequelize');

class Matriculas extends Model {
    static init (sequelize) {
        super.init({
            aluno_id: DataTypes.INTEGER,
            codigo_matricula:DataTypes.STRING,
            estado_matricula: DataTypes.STRING,
            situacao_financeira: DataTypes.STRING,
            ano_lectivo: DataTypes.INTEGER,
            bolderon: DataTypes.STRING,
        }, {
            sequelize
        });
    }

    static associate (models) {
        this.belongsTo(models.Alunos, { foreingKey: 'aluno_id', as: 'aluno' });
        this.belongsToMany(models.Classes, { foreingKey: 'matricula_id', through: 'classe_matriculas', as: 'classe' });
        this.belongsToMany(models.Turmas, { foreingKey: 'matricula_id', through: 'turma_matriculas', as: 'turma' });
        this.hasMany(models.Notas, { foreignKey: 'matricula_id', as: 'notas' });
        this.hasMany(models.Pagamentos, { foreignKey: 'matricula_id', as: 'pagamentos' });
    }
}

module.exports = Matriculas;