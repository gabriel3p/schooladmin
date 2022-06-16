const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class Funcionarios extends Model {
    static init (sequelize) {
        super.init({
            foto: DataTypes.STRING,
            nome: DataTypes.STRING,
            sobrenome: DataTypes.STRING,
            cargo: DataTypes.STRING,
            genero: DataTypes.ENUM('M', 'F'),
            data_nascimento: DataTypes.DATE,
            area_formação: DataTypes.STRING,
            instituto_ensino: DataTypes.STRING,
            grau: DataTypes.STRING,
            nacionalidade: DataTypes.STRING,
            estado_civil: DataTypes.STRING,
            biografia: DataTypes.TEXT,
            usuario: DataTypes.STRING,
            senha: DataTypes.STRING,
            ativo: DataTypes.BOOLEAN,
            telefone: DataTypes.STRING,
            email: DataTypes.STRING,
            bi: DataTypes.STRING,
            endereco: DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'funcionarios',
            hooks: {
                beforeCreate: (funcionario) => {
                    const salt = bcrypt.genSaltSync();
                    funcionario.senha = bcrypt.hashSync(funcionario.senha, salt)
                }
            }
        });

    }

    static associate (models) {
        this.hasMany(models.Sociais, { foreignKey: 'funcionario_id', as: 'sociais' });
        this.hasMany(models.Pagamentos, { foreignKey: 'funcionario_id', as: 'pagamentos' });
        this.belongsToMany(models.Disciplinas, { foreingKey: 'funcionario_id', through: 'professores_disciplinas', as: 'disciplinas' });
        this.belongsToMany(models.Turmas, { foreingKey: 'funcionario_id', through: 'professor_turmas', as: 'turmas' });

    }
}

module.exports = Funcionarios;