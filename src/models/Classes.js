const { DataTypes, Model } = require('sequelize');

class Classes extends Model {
    static init (sequelize) {
        super.init({
            curso_id: DataTypes.INTEGER,
            nivel: DataTypes.INTEGER,
            preco: DataTypes.DECIMAL,
        }, {
            sequelize,
            tableName: 'classes',
        });
    }

    static associate (models) {
        this.belongsTo(models.Cursos, { foreignKey: 'curso_id', as: 'curso' });
        this.hasMany(models.Turmas, { foreignKey: 'classe_id', as: 'turmas' });
        this.belongsToMany(models.Matriculas, { foreignKey: 'classe_id', through: 'classe_matriculas',  as: 'matriculas' });
        this.hasMany(models.Disciplinas, { foreignKey: 'classe_id', as: 'disciplinas' });
    }
}

module.exports = Classes;