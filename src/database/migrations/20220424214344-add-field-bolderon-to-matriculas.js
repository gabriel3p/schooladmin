'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('matriculas', 'bolderon', { 
       type: Sequelize.STRING,
       allowNull: true, 
      });
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.removeColumn('matriculas', 'bolderon');
  }
};
