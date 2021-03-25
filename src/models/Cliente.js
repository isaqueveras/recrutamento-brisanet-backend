module.exports = (sequelize, Sequelize) => {
  const Cliente = sequelize.define("cliente", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    data_criacao: {
      type: Sequelize.DATE,
    },
    data_atualizacao: {
      type: Sequelize.DATE,
    },
    nome: {
      type: Sequelize.STRING(200),
    },
    data_remocao: {
      type: Sequelize.DATE,
    },
    tipo: {
      type: Sequelize.STRING(200),
    }
  }, {
    freezeTableName: true,
    tableName: 't_cliente'
  });

  return Cliente;
};
