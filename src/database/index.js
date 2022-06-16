const Sequelize = require('sequelize');

const dbConfig = require('../../config/databaseConfig');
const { createMonth } = require('../helpers/utils');

const connection = new Sequelize(dbConfig);

const Meses = require('../models/Meses');
const Notas = require('../models/Notas');
const Alunos = require('../models/Alunos');
const Cursos = require('../models/Cursos');
const Turmas = require('../models/Turmas');
const Classes = require('../models/Classes');
const Sociais = require('../models/Sociais');
const FeedBacks = require('../models/FeedBacks');
const Pagamentos = require('../models/Pagamentos');
const Matriculas = require('../models/Matriculas');
const Disciplinas = require('../models/Disciplinas');
const Funcionarios = require('../models/Funcionarios');



try {

    //Iniciando os Models
    Meses.init(connection);
    Notas.init(connection);
    Alunos.init(connection);
    Cursos.init(connection);
    Turmas.init(connection);
    Classes.init(connection);
    Sociais.init(connection);
    FeedBacks.init(connection);
    Pagamentos.init(connection);
    Matriculas.init(connection);
    Disciplinas.init(connection);
    Funcionarios.init(connection);


    //Incluíndo relacionamentos
    Notas.associate(connection.models);
    Alunos.associate(connection.models);
    Cursos.associate(connection.models);
    Turmas.associate(connection.models);
    Classes.associate(connection.models);
    Sociais.associate(connection.models);
    Pagamentos.associate(connection.models);
    Matriculas.associate(connection.models);
    Disciplinas.associate(connection.models);
    Funcionarios.associate(connection.models);

    createMonth(Meses);

    connection.authenticate().then(() => {
        console.log('Banco de Dados conectado com sucesso!');
    }).catch(error => {
        console.error('Houve um erro na conexão com o Banco de Dados' + error)
    });

} catch (error) {
    console.error('Houve um erro interno.' + error)
}

module.exports = connection;