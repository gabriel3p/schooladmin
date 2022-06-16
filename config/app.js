require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');

class Application {
    constructor () {
        this.app = express();

        this.middlewares();
        this.settings();
        this.routes();
    }

    middlewares () {
        this.app.use(cookieParser());
        this.app.use(flash());
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

        this.app.use(session({
            secret: 'schollAdmin',
            resave: true,
            saveUninitialized: true,
        }));

        this.app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg");
            res.locals.error_msg = req.flash("error_msg");
            
            next();
        });
    }

    routes () {
        //Importando e Utilizando as rotas
        this.app.use(require('../src/routes/routes'));

        //Rota para vizualização das fotos
        this.app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));

        //Rotas não encontradas (404)
        this.app.use((req, res, next) => {
            res.render('./partials/erro404');
        });
    }

    settings () {
        this.app.set('port', process.env.PORT);

        //Configurando os arquivos Estáticos
        this.app.use(express.static(path.join(__dirname, '../src/public')));

        //Configurando a View Engine
        this.app.set('views', path.join(__dirname, '../src/views'));
        this.app.set('view engine', 'ejs');
    }

    start () {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Servidor Rodando na porta: ${ this.app.get('port') }`);
        });
    }
}

module.exports = Application;