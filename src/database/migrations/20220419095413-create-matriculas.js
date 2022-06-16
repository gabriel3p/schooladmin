'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.createTable('matriculas', { 
       id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          allowNull: false, 
          primaryKey: true,
       },

       aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'alunos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

       codigo_matricula: {
         type: Sequelize.STRING,
         allowNull: false,
         unique: true,
      },

      
       situacao_financeira: { //Liquidada e Inadimplente
         type: Sequelize.STRING, 
         allowNull: false,
      },

      estado_matricula: { //ativa, pendente e recusada
        type: Sequelize.STRING, 
        allowNull: false,
     },

      ano_lectivo: { //Ano lectivo da turma
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
     await queryInterface.dropTable('matriculas');
  }
};
