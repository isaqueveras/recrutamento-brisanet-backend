module.exports = (sequelize, Sequelize) => {
  const Historico = sequelize.define("historico", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    estado_anterior: {
      type: Sequelize.STRING(200),
    },
    estado_posterior: {
      type: Sequelize.STRING(200),
    },
    contrato_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    data_remocao: {
      type: Sequelize.DATE,
    }
  }, {
    freezeTableName: true,
    tableName: 't_contrato_evento',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao',
  });

  return Historico;
};
