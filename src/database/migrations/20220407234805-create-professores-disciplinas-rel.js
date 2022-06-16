'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.createTable('professores_disciplinas', { 
       id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
         allowNull: false,
       },

       funcionario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'funcionarios', key: 'id' },
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
     await queryInterface.dropTable('professores_disciplinas');
  }
};
