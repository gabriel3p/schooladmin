'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.createTable('turmas', { 
       id: {
         type: Sequelize.INTEGER,
         allowNull: false,
         autoIncrement: true,
         primaryKey: true,
       },

       classe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'classes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
       },

       turno: {
        type: Sequelize.ENUM('t', 'm'),
        allowNull: false,
       },
       
       codigo_turma: {
         type: Sequelize.STRING,
         allowNull: false,
         unique: true,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('turmas');
  }
};
