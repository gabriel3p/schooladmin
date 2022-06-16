'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('classes', {
       id: {
         type: Sequelize.INTEGER,
         autoIncrement: true,
         allowNull: false,
         primaryKey: true,
       },

       curso_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'cursos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
       },

       nivel: {
         type: Sequelize.INTEGER,
         allowNull: false
       },

       preco: {
         type: Sequelize.DECIMAL,
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
     await queryInterface.dropTable('classes');
  }
};
