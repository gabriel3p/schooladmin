'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('disciplina_notas', { 
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false, 
        primaryKey: true,
     },

      nota_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'notas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      disciplina_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'disciplinas', key: 'id' },
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
    await queryInterface.dropTable('disciplina_notas');
  }
};
