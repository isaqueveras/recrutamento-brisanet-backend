module.exports = (sequelize, Sequelize) => {
  const Ponto = sequelize.define("ponto", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    cliente_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    endereco_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    data_remocao: {
      type: Sequelize.DATE
    }
  }, {
    freezeTableName: true,
    tableName: 't_ponto',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao',
  });

  return Ponto;
};
