const db = require("../models");

const Contrato = db.contrato;
const Ponto = db.ponto;
const Historico = db.historico; 

// Cadastrar um novo contrato
exports.create = (req, res) => {
  if (!req.body.ponto_id) { // Validando a requisição
    res.status(400).send({ message: "Os campos ponto_id é obrigatório" });
    return;
  }
  
  // Recebe os dados do contrato
  const contrato = { 
    ponto_id: req.body.ponto_id,
    estado: "Em vigor"
  };

  // Procura se existe o ponto no banco de dados
  Ponto.findByPk(contrato.ponto_id).then(ponto => {

    // Salva o contrato no banco de dados
    Contrato.create(contrato).then(contrato => {
      
      const historico = {
        contrato_id: contrato.id,
        estado_anterior: contrato.estado,
        estado_posterior: contrato.estado,
      };

      // Salva uma copia na tabela historico
      Historico.create(historico).then(h => {
        res.status(201).send({ message: "Historico do contrato foi cadastrado com sucesso!"});
      }).catch(err => {
        res.status(400).send({ message: "Não foi possível cadastrar o historico" });
      });

      res.status(201).send({ message: "Contrato cadastrado com sucesso!"});
    }).catch(err => {
      res.status(400).send({ message: "Não foi possível cadastrar o contrato" });
    });

  }).catch(err => {
    res.status(400).send({ message: "Ponto não existe no banco de dados" });
  });
};

// Lista dados de um endereço 
exports.listOne = (req, res) => {
  const { uuid } = req.params;

  Contrato.findByPk(uuid, { 
    attributes: {
      exclude: ['data_remocao', 'data_criacao', 'data_atualizacao'],
    },
    include: { 
      association: 'ponto',
      attributes: {
        exclude: ['id', 'data_remocao', 'data_criacao', 'data_atualizacao'],
      },
      include: [
        { 
          association: 'cliente',
          attributes: {
            exclude: ['id', 'data_remocao', 'data_criacao', 'data_atualizacao'],
          },
        }, { 
          association: 'endereco',
          attributes: {
            exclude: ['id', 'data_remocao', 'data_criacao', 'data_atualizacao'],
          },
        }
      ]
    }
  }).then(data => {
    res.status(200).send(data);
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível listar o contrato" });
  });
};

// Lista todos os contratos 
exports.listAll = (req, res) => {
  Contrato.findAll({ 
    attributes: {
      exclude: ['data_remocao', 'data_criacao', 'data_atualizacao'],
    },
    include: { 
      association: 'ponto',
      attributes: {
        exclude: ['id', 'data_remocao', 'data_criacao', 'data_atualizacao'],
      },
      include: [
        { 
          association: 'cliente',
          attributes: {
            exclude: ['id', 'data_remocao', 'data_criacao', 'data_atualizacao'],
          },
        }, { 
          association: 'endereco',
          attributes: {
            exclude: ['id', 'data_remocao', 'data_criacao', 'data_atualizacao'],
          },
        }
      ]
    }
  }).then(data => {
    res.status(200).send({ dados: data });
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível listar os contratos" });
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

  Contrato.findByPk(uuid).then(data => {

    // Corpo de um historico
    const historico = {
      contrato_id: uuid,
      estado_anterior: data.estado,
      estado_posterior: 
        data.estado == "Em vigor" ? "Desativado temporário" : 
        data.estado == "Desativado temporário" ? "Cancelado" : "Cancelado",
    };

    // Salva uma copia na tabela historico
    Historico.create(historico).then(h => {
      res.status(201).send();
    }).catch(err => {
      res.status(400).send();
    });

    // Corpo de um contrato
    const contrato = { 
      estado: historico.estado_posterior,
      data_remocao: new Date().getTime() 
    }

    Contrato.update(contrato, {
      where: { id: uuid }
    }).then(numContrato => {
      if (numContrato == 1) res.status(204).send();
      else res.status(400).send({ message: "Não foi possivel excluir o contrato" });
    
    }).catch(err => {
      res.status(500).send({ message: "Contrato não encontrado no banco de dados" });
    });
  
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível listar o contrato" });
  });
};

// Lista o historico de um contrato
exports.historyList = (req, res) => {
  const {uuid} = req.params;

  Historico.findAll({
    where: { contrato_id: uuid }, 
    attributes: ['contrato_id', 'data_criacao', 'estado_anterior', 'estado_posterior'] 
  }).then(data => {
    res.status(200).send({ dados: data });
  }).catch(err => {
    res.status(400).send({ message: "Não foi possível listar o historico do contrato" });
  });
};
