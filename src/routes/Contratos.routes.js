const { checkDuplicateContrato } = require("../middleware");

module.exports = app => {
  const contrato = require("../controllers/ContratoController");
  var router = require("express").Router();
  
  router.get('/contrato/:uuid/historico', contrato.historyList); // Lista o historico de um contrato
  router.get('/contrato/:uuid', contrato.listOne); // Listar dados de um contrato
  router.get('/contratos', contrato.listAll); // Listar contratos
  router.post('/contratos', checkDuplicateContrato, contrato.create); // Cadastrar um contrato
  router.delete('/contratos/:uuid', contrato.delete); // Excluir um contrato

  app.use('/api/v1/', router);
};