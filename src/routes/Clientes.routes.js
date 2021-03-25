// const { authJwt } = require("../middleware");
module.exports = app => {
  const cliente = require("../controllers/ClienteController");

  var router = require("express").Router();
  
  // Listar todas as cidades
  router.get('/', cliente.findAll);
  
  // Cadastrar uma cidade
  // router.post('/', city.create);

  // Editar a cidade de preferência do usuário
  // router.put('/editmycity/:id', [authJwt.verifyToken, authJwt.isUser], cliente.editMycliente);

  // Excluir uma cidade
  // router.delete('/:id', [authJwt.verifyToken, authJwt.isServiceProvider], cliente.deleteOne);

  app.use('/api/v1/', router);
};