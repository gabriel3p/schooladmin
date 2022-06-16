const { Router } = require('express');
const routes = Router();

const { validateToken } = require('../middlewares/validationMiddlewares');
const PagamentosControllers = require('../controllers/PagamentoControllers');


//GET ROUTES


//POST routes
routes.post('/propina', validateToken, PagamentosControllers.pagamento);

//RENDER routes
routes.get('/propina', validateToken, PagamentosControllers.pagamentoRender);


module.exports = routes;