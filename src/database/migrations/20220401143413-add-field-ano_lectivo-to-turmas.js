'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addColumn('turmas', 'ano_lectivo', { 
       type: Sequelize.INTEGER,
       allowNull: true, 
      });
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.dropColumn('turmas', 'ano_lectivo');
  }
};
