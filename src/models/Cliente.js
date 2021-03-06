module.exports = (sequelize, Sequelize) => {
  const Cliente = sequelize.define("cliente", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    data_remocao: {
      type: Sequelize.DATE,
    },
    tipo: {
      type: Sequelize.STRING(200),
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    tableName: 't_cliente',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao',
  });

  return Cliente;
};
