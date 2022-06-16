const { Router } = require('express');
const routes = Router();

const FeedBacksControllers = require('../controllers/FeedBacksControllers');

const { validateToken } = require('../middlewares/validationMiddlewares');

//Rotas POSTS
routes.post('/feedback/enviar', FeedBacksControllers.enviar);
routes.post('/admin/feedbacks/pesquisar', validateToken, FeedBacksControllers.feedback_pesquisar);

//Rotas GETS
routes.get('/admin/feedbacks/:id/deletar', validateToken, FeedBacksControllers.deletar);
routes.get('/admin/feedbacks/:id', validateToken, FeedBacksControllers.visFeedbackRender);


//Outras Rotas
routes.get('/admin/feedbacks', validateToken, FeedBacksControllers.feedbacksRender)

module.exports = routes;