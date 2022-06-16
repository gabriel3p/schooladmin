'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.createTable('disciplinas', { 
       id: {
         type: Sequelize.INTEGER,
         autoIncrement: true,
         primaryKey: true,
         allowNull: false,
       },

       classe_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'classes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
       },

       nome_disciplina: {
         type: Sequelize.STRING,
         allowNull: false,
       },

       abreviacao: {
         type: Sequelize.STRING,
         allowNull: false,
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
    await queryInterface.dropTable('disciplinas');
  }
};
