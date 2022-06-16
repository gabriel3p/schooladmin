const { DataTypes, Model } = require('sequelize');

class Cursos extends Model {
    static init (sequelize) {
        super.init({
            nome: DataTypes.STRING,
            foto: DataTypes.STRING,
            codigo_curso: DataTypes.STRING,
            descrição: DataTypes.TEXT,
        }, {
            sequelize,
            tableName: 'cursos'
        });
    }

    static associate (models) {
        this.hasMany(models.Classes, { foreignKey: 'curso_id', as: 'classes' });
    }
}

module.exports = Cursos;