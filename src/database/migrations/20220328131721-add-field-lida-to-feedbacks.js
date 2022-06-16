'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('feedbacks', 'lida', { 
       type: Sequelize.BOOLEAN,
       allowNull: true, 
      });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.dropColumn('feedbacks', 'lida');
  }
};
