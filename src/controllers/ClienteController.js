const db = require("../models");

const Cliente = db.cliente;

exports.findAll = (req, res) => {
  Cliente.findAll({
    // attributes: ['id', 'name', 'uf'],
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(data => {
    res.send(data);
  }).catch(err => {
    res.status(500).send({ message: err.message || "Some error occurred while retrieving users." });
  });
};