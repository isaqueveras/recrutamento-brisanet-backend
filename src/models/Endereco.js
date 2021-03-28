module.exports = (sequelize, Sequelize) => {
  const Endereco = sequelize.define("endereco", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    logradouro: {
      type: Sequelize.STRING(200),
    },
    bairro: {
      type: Sequelize.STRING(200),
    },
    numero: {
      type: Sequelize.SMALLINT
    },
    data_remocao: {
      type: Sequelize.DATE,
    }
  }, {
    freezeTableName: true,
    tableName: 't_endereco',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: 'data_atualizacao',
  });

  return Endereco;
};
