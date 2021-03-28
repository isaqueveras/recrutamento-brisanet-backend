const db = require("../models");

const Cliente = db.cliente;
const Endereco = db.endereco;
const Ponto = db.ponto;
const Contrato = db.contrato;

exports.checkDuplicateEndereco = (req, res, next) => {
  Endereco.findOne({
    where: { 
      logradouro: req.body.logradouro,
      bairro: req.body.bairro, 
      numero: req.body.numero
    }
  }).then(endereco => {
    if (endereco) {
      if (endereco.data_remocao != null) { // Endereço desativado

        Endereco.update({ // Atualizar a data de remoção
          data_remocao: null
        }, { 
          where: { id: endereco.id }
        }).then(num => {
          if (num == 1) res.status(204).send(); // Editado
          else res.status(400).send(); // Não editado
        });

        res.status(200).send({ message: "Endereço reativado!" });
        return;
      }

      res.status(400).send({ message: "Error! Já existe um endereço igual!" });
      return;
    }
    next();
  });
};

exports.checkDuplicateCliente = (req, res, next) => {
  Cliente.findOne({
    where: { 
      nome: req.body.nome,
      tipo: req.body.tipo
    }
  }).then(cliente => {
    if (cliente) {
      if (cliente.data_remocao != null) { // Cliente desativado

        Cliente.update({ // Atualizar a data de remoção
          data_remocao: null
        }, { 
          where: { id: cliente.id }
        }).then(num => {
          if (num == 1) res.status(204).send(); // Editado
          else res.status(400).send(); // Não editado
        });

        res.status(200).send({ message: "Cliente reativado!" });
        return;
      }

      res.status(400).send({ message: "Error! Já existe um cliente igual!" });
      return;
    }
    next();
  });
};

exports.checkDuplicatePonto = (req, res, next) => {
  Ponto.findOne({
    where: { 
      cliente_id: req.body.cliente_id,
      endereco_id: req.body.endereco_id
    }
  }).then(ponto => {
    if (ponto) { // Existe um ponto
      if (ponto.data_remocao != null) { // Ponto desabilitado

        // Atualizar a data de remoção dos pontos
        Ponto.update({ data_remocao: null }, { 
          where: { 
            cliente_id: ponto.cliente_id,
            endereco_id: ponto.endereco_id
          }
        });

        // Atualizar a data de remoção do cliente
        Cliente.update({ data_remocao: null }, { 
          where: { id: ponto.cliente_id }
        });
        
        // Atualizar a data de remoção do endereço
        Endereco.update({ data_remocao: null }, { 
          where: { id: ponto.endereco_id }
        });

        res.status(200).send({ message: "Ponto reativado!" });
        return;
      }

      res.status(400).send({ message: "Error! Já existe um ponto igual!" });
      return;
    }

    next();
  });
};

exports.checkDuplicateContrato = (req, res, next) => {
  Contrato.findOne({
    where: { ponto_id: req.body.ponto_id }
  }).then(contrato => {
    if (contrato) {
      
      if (contrato.data_remocao != null) { // Contrato desabilitado
        // Atualizar a data de remoção do contrato
        Contrato.update({ data_remocao: null }, { 
          where: { 
            id: contrato.id,
            ponto_id: contrato.ponto_id
          }
        });
      
        res.status(200).send({ message: "Contrato reativado!" });
        return;
      }

      res.status(400).send({ message: "Error! Já existe um contrato igual!" });
      return;
    }
    
    next();
  });
};
