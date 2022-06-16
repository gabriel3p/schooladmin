'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('feedbacks', { 
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true, 
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      contacto: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      assunto: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('feedbacks');
  }
};
