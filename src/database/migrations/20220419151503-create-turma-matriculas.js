'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('turma_matriculas', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      matricula_id: {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: { model: 'matriculas', key: 'id' },
       onUpdate: 'CASCADE',
       onDelete: 'CASCADE',
      },
      
      turma_id: {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: { model: 'turmas', key: 'id' },
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

  async down (queryInterface, Sequelize) {
     await queryInterface.dropTable('turma_matriculas');
  }
};
