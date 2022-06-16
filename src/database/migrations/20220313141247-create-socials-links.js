'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sociais', { 
      id:{ 
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      
      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      
      funcionario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'funcionarios', key: 'id' },
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
   await queryInterface.dropTable('sociais');
  }
};
