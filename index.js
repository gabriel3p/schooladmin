const App = require('./config/app');

const app = new App();
require('./src/database');

app.start();