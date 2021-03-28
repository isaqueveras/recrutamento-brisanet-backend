const db = require("../models");
const Op = db.Sequelize.Op;

const Cliente = db.cliente;
const Ponto = db.ponto;

// Cadastrar um novo cliente
exports.create = (req, res) => {
  if (!req.body) { // Validando a requisição
    res.status(400).send({ message: "Preenche todos os campos!" });
    return;
  }
  
  const cliente = { // Recebe os dados do cliente
    nome: req.body.nome,
    tipo: req.body.tipo
  };

  // Salva o cliente no banco de dados
  Cliente.create(cliente).then(data => {
    res.status(201).send({ message: "Cliente cadastrado com sucesso!"});
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível cadastrar o cliente" });
  });
};

// Lista dados de um cliente 
exports.listOne = (req, res) => {
  const { uuid } = req.params;

  Cliente.findByPk(uuid, { 
    attributes: ['nome', 'tipo'] 
  }).then(data => {
    res.status(200).send(data);
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível listar os dados do cliente" });
  });
};
  
// Lista todos os clientes e tem os 
// opcionais de procurar pelo nome ou tipo
exports.listAll = (req, res) => {
  const { nome, tipo } = req.query;
  var condition = nome ? { nome: { [Op.iLike]: `%${nome}%` } } : 
                  tipo ? { tipo: { [Op.iLike]: `%${tipo}%` } } : null;

  Cliente.findAll({ 
    where: condition,
    attributes: ['nome', 'tipo'] 
  }).then(data => {
    res.status(200).send({ dados: data });
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível listar os clientes" });
  });
};

// Atualiza os dados de um cliente
exports.update = (req, res) => {
  const uuid = req.params.uuid;

  if (!req.body) { // Validando a requisição
    res.status(400).send({ message: "Preenche todos os campos!" });
    return;
  }

  Cliente.update(req.body, {
    where: { id: uuid }
  }).then(num => {
    if (num == 1) res.status(204).send({ message: "Cliente editado com sucesso" }); // Mensagem de sucesso
    else res.status(400).send({ message: "Não foi possível editar o cliente" }); // Mensagem de error
  }).catch(err => {
    res.status(500).send({ message: "Cliente não encontrado" }); // Cliente não existe no banco de dados
  });
};

// Soft delete
exports.delete = (req, res) => {
  const uuid = req.params.uuid;
  const dataRemocao = { data_remocao: new Date().getTime() }

  Cliente.update(dataRemocao, {
    where: { id: uuid }
  }).then(numCliente => {

    Ponto.update(dataRemocao, {
      where: { cliente_id: uuid }
    }).then(numPonto => {
      if (numPonto == 1) res.status(204).send();
      else res.status(400).send();

    }).catch(err => {
      res.status(500).send({ message: "Ponto não encontrado" });
    });

    if (numCliente == 1) res.status(204).send();
    else res.status(400).send({ message: "Não foi possivel excluir o cliente" }); // Mensagem de error
    
  }).catch(err => {
    res.status(500).send({ message: "Cliente não encontrado" });
  });
};
