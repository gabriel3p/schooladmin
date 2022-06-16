const { Model, DataTypes } = require('sequelize');

class Alunos extends Model {
    static init (sequelize) {
        super.init({
            foto: DataTypes.STRING,
            nome: DataTypes.STRING,
            nome_pai: DataTypes.STRING,
            nome_mae: DataTypes.STRING,
            nacionalidade: DataTypes.STRING,
            municipio: DataTypes.STRING,
            bairro: DataTypes.STRING,
            data_nascimento: DataTypes.DATE,
            genero: DataTypes.ENUM('M', 'F'),
            bi: DataTypes.STRING,
            phone1: DataTypes.STRING,
            phone2: DataTypes.STRING,
            email: DataTypes.STRING,
            situacao_aluno: DataTypes.STRING,
        }, {
            sequelize
        });
    }

    static associate (models) {
        this.hasMany(models.Matriculas, { foreignKey: 'aluno_id', as: 'matriculas' });
    }
}

module.exports = Alunos;