const db = require("../models");
const Op = db.Sequelize.Op;

const Ponto = db.ponto;
const Cliente = db.cliente;
const Endereco = db.endereco;
const Contrato = db.contrato;

exports.create = (req, res) => {
  if (!req.body.cliente_id || !req.body.endereco_id) { // Validando a requisição
    res.status(400).send({ message: "Os campos cliente_id e endereco_id são obrigatorios" });
    return;
  }
  
  const ponto = {
    cliente_id: req.body.cliente_id,
    endereco_id: req.body.endereco_id
  };

  Cliente.findByPk(ponto.cliente_id).then(cliente => {
    Endereco.findByPk(ponto.endereco_id).then(endereco => {

      // Verifica se eles estão como desativados 
      if (cliente.data_remocao == null && endereco.data_remocao == null) {
        
        // Salva o ponto no banco de dados
        Ponto.create(ponto).then(data => {
          res.status(201).send({ message: "Ponto criado com sucesso!"});
        }).catch(err => {
          res.status(400).send({ message: "Não foi possível criar o ponto" });
        });

      } else {
        if (cliente.data_remocao != null) res.status(400).send({ message: "Cliente está desativado" });
        if (endereco.data_remocao != null) res.status(400).send({ message: "Endereço está desativado" });
      }

    }).catch(err => {
      res.status(400).send({ message: "Endereço não existe" });
    }); 

  }).catch(err => {
    res.status(400).send({ message: "Cliente não existe" });
  });
};

exports.listAll = (req, res) => {
  const { cliente_id, endereco_id } = req.query;
  var condition = cliente_id ? { cliente_id: { [Op.iLike]: `%${cliente_id}%` } } : 
                  endereco_id ? { endereco_id: { [Op.iLike]: `%${endereco_id}%` } } : null;

  Ponto.findAll({ 
    where: condition,
    attributes: {
      exclude: ['data_remocao', 'data_criacao', 'data_atualizacao'],
    },
    include: [
      { 
        association: 'ponto',
        attributes: {
          exclude: ['id', 'data_remocao', 'data_criacao', 'data_atualizacao'],
        },
      },
      { 
        association: 'cliente',
        attributes: {
          exclude: ['id', 'data_remocao', 'data_criacao', 'data_atualizacao'],
        },
      },
    ]
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível listar os pontos" });
  });
};

// Soft delete
exports.delete = (req, res) => {
  const uuid = req.params.uuid;
  const dataRemocao = { data_remocao: new Date().getTime() }

  Ponto.update(dataRemocao, {
    where: { id: uuid }
  }).then(numPonto => {

    Contrato.update(dataRemocao, {
      where: { ponto_id: uuid }
    }).then(numPonto => {
      if (numPonto == 1) res.status(204).send();
      else res.status(400).send();
    });

    if (numPonto == 1) res.status(204).send();
    else res.status(400).send({ message: "Não foi possivel excluir o ponto" }); // Mensagem de error
    
  }).catch(err => {
    res.status(500).send({ message: "Endereço não encontrado" });
  });
};
