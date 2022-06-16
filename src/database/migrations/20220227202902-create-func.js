'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('funcionarios', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      foto: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },

      bi: { 
        type: Sequelize.STRING,
        unique: true,
        allowNull: true,
       },

      sobrenome: {
        type: Sequelize.STRING,
        allowNull: false
      },

      cargo: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      genero: {
        type: Sequelize.ENUM('M', 'F'),
        allowNull: false,
      },

      endereco: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      data_nascimento: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      area_formação: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      instituto_ensino: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      grau: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      nacionalidade: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      estado_civil: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      biografia: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      usuario: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },

      senha: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },

      telefone: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING,
        unique: true,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('funcionarios');
  }
};
