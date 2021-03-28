const { checkDuplicateCliente } = require("../middleware");

module.exports = app => {
  const cliente = require("../controllers/ClienteController");
  var router = require("express").Router();
  
  router.get('/cliente/:uuid', cliente.listOne); // Listar dados de um cliente
  router.get('/clientes', cliente.listAll); // Listar clientes
  router.post('/clientes', checkDuplicateCliente, cliente.create); // Cadastrar um cliente
  router.put('/cliente/:uuid', cliente.update); // Atualiza dados de um cliente
  router.delete('/cliente/:uuid', cliente.delete); // Excluir um cliente

  app.use('/api/v1/', router);
};