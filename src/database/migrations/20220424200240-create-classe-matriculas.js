'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('classe_matriculas', { 
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

      classe_id: {
         type: Sequelize.INTEGER,
         allowNull: false,
         references: { model: 'classes', key: 'id' },
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
     await queryInterface.dropTable('classe_matriculas');
  }
};
