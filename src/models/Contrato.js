module.exports = (sequelize, Sequelize) => {
  const Contrato = sequelize.define("contrato", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    estado: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    ponto_id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
    },
    data_remocao: {
      type: Sequelize.DATE,
    }
  }, {
    freezeTableName: true,
    tableName: 't_contrato',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao',
  });

  return Contrato;
};
