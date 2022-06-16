'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('meses', { 
       id: {
         type: Sequelize.INTEGER,
         autoIncrement: true,
         allowNull: false,
          primaryKey: true,
       },

       mes: {
         type: Sequelize.STRING,
         allowNull: false,
         unique: true,
       },

       pos: {
         type: Sequelize.INTEGER,
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
     await queryInterface.dropTable('meses');
  }
};
