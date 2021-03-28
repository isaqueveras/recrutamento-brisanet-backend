const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.cliente = require("./Cliente")(sequelize, Sequelize);
db.endereco = require("./Endereco")(sequelize, Sequelize);
db.ponto = require("./Ponto")(sequelize, Sequelize);
db.contrato = require("./Contrato")(sequelize, Sequelize);
db.historico = require("./Historico")(sequelize, Sequelize);

db.ponto.belongsTo(db.cliente, { 
  as: "cliente",  
  foreignKey: "cliente_id",
});

db.ponto.belongsTo(db.endereco, { 
  as: "endereco",  
  foreignKey: "endereco_id",
});

// Contratos -> ponto
db.contrato.belongsTo(db.ponto, { 
  as: "ponto",  
  foreignKey: "ponto_id",
}); 

module.exports = db;