'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('notas', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false, 
        primaryKey: true,
     },

      matricula_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'matriculas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      disciplina_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'disciplinas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      prova1: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },

      prova2: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: null,
      },

      trimestre: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'I',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    

     updated_at: {
       type: Sequelize.DATE,
       allowNull: false,
     } 

    });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('notas');
  }
};
