'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('alunos', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },

      foto: {
        type: Sequelize.STRING,
        allowNUll: true,
      },

      nome: {
        type: Sequelize.STRING,
        allowNUll: false,
      },

      nome_pai: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      nome_mae: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      nacionalidade: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      municipio: {
        type: Sequelize.STRING,
        allowNull: true,

      },

      bairro: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      data_nascimento: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      genero: {
        type: Sequelize.ENUM('M', 'F'),
        allowNull: false,
      },

      bi: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      phone1: {
        type: Sequelize.STRING,
        allowNUll: false,
      },

      phone2: {
        type: Sequelize.STRING,
        allowNUll: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNUll: true,
      },

      situacao_aluno: { // ativo, desistente e não confirmado
        type: Sequelize.STRING,
        allowNull: false
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
   await queryInterface.dropTable('alunos');
  }
};
