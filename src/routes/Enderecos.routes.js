const { checkDuplicateEndereco } = require("../middleware");

module.exports = app => {
  const endereco = require("../controllers/EnderecoController");
  var router = require("express").Router();
  
  router.get('/endereco/:uuid', endereco.listOne); // Listar dados de um endereco
  router.get('/enderecos', endereco.listAll); // Listar enderecos
  router.post('/enderecos', checkDuplicateEndereco, endereco.create); // Cadastrar um endereco
  router.put('/endereco/:uuid', endereco.update); // Atualiza dados de um endereco
  router.delete('/endereco/:uuid', endereco.delete); // Excluir um cliente

  app.use('/api/v1/', router);
};