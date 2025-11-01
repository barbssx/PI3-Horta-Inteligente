const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Previsao = sequelize.define(
  "Previsao",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    registro_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    temperatura_real: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    temperatura_prevista: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    umidade_real: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    umidade_prevista: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    data_prevista: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    criado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "previsoes",
    timestamps: false,
  }
);

module.exports = Previsao;
