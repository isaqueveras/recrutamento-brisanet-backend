const { checkDuplicatePonto } = require("../middleware");

module.exports = app => {
  const ponto = require("../controllers/PontoController");
  var router = require("express").Router();
  
  router.get('/pontos', ponto.listAll); // Listar pontos
  router.post('/pontos', checkDuplicatePonto, ponto.create); // Cadastrar um ponto
  router.delete('/ponto/:uuid', ponto.delete); // Excluir um cliente

  app.use('/api/v1/', router);
};