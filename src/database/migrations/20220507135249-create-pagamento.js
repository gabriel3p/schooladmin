'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('pagamentos', { 
       id: {
         type: Sequelize.INTEGER,
         allowNull: false,
         autoIncrement: true,
         primaryKey: true,
       },

       funcionario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'funcionarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
       },

       mes_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'meses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
       },

       matricula_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'matriculas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
       },

       valor_pago: { 
         type: Sequelize.INTEGER,
         allowNull: false,
       },

       forma_pagamento: {
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

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('pagamentos');
  }
};
