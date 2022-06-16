'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('professor_turmas', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
    
      funcionario_id: {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: { model: 'funcionarios', key: 'id' },
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
    
     })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('professor_turmas');
  }
};

