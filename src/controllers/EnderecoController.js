const db = require("../models");
const Op = db.Sequelize.Op;

const Endereco = db.endereco;
const Ponto = db.ponto;

// Cadastrar um novo endereço
exports.create = (req, res) => {
  if (!req.body.logradouro || !req.body.bairro || !req.body.numero) { // Validando a requisição
    res.status(400).send({ message: "Os campos logradouro, bairro e numero são obrigatorios" });
    return;
  }
  
  // Recebe os dados do endereço
  const endereco = { 
    logradouro: req.body.logradouro,
    bairro: req.body.bairro,
    numero: req.body.numero
  };

  // Salva o endereço no banco de dados
  Endereco.create(endereco).then(data => {
    res.status(201).send({ message: "Endereço cadastrado com sucesso!"});
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível cadastrar o endereço" });
  });
};

// Lista dados de um endereço 
exports.listOne = (req, res) => {
  const { uuid } = req.params;

  Endereco.findByPk(uuid, { 
    attributes: ['logradouro', 'bairro', 'numero'] 
  }).then(data => {
    res.status(200).send(data);
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível listar os dados do endereço" });
  });
};
  
// Lista todos os Enderecos e os parametros 
// opcionais de procurar pelo logradouro, numero ou bairro
exports.listAll = (req, res) => {
  const { logradouro, bairro, numero } = req.query;
  var condition = 
    logradouro ? { logradouro: { [Op.iLike]: `%${logradouro}%` } } : 
    numero ? { numero: { [Op.iLike]: `%${numero}%` } } :
    bairro ? { bairro: { [Op.iLike]: `%${bairro}%` } } : null; 

  Endereco.findAll({ 
    where: condition,
    attributes: ['logradouro', 'bairro', 'numero'] 
  }).then(data => {
    res.status(200).send({ dados: data });
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível listar os endereços" });
  });
};

// Atualiza os dados de um endereço
exports.update = (req, res) => {
  const uuid = req.params.uuid;

  Endereco.update(req.body, {
    where: { id: uuid }
  }).then(num => {
    if (num == 1) res.status(204).send({ message: "Endereco editado com sucesso" }); // Mensagem de sucesso
    else res.status(400).send({ message: "Não foi possível editar o Endereco" }); // Mensagem de error
  }).catch(err => {
    res.status(500).send({ message: "Endereco não encontrado" }); // Endereço não existe no banco de dados
  });
};

// Soft delete
exports.delete = (req, res) => {
  const uuid = req.params.uuid;
  const dataRemocao = { data_remocao: new Date().getTime() }

  Endereco.update(dataRemocao, {
    where: { id: uuid }
  }).then(numEndereco => {

    Ponto.update(dataRemocao, {
      where: { endereco_id: uuid }
    }).then(numPonto => {
      if (numPonto == 1) res.status(204).send();
      else res.status(400).send();

    }).catch(err => {
      res.status(500).send({ message: "Ponto não encontrado" });
    });

    if (numEndereco == 1) res.status(204).send();
    else res.status(400).send({ message: "Não foi possivel excluir o endereço" }); // Mensagem de error
    
  }).catch(err => {
    res.status(500).send({ message: "Endereço não encontrado" });
  });
};
