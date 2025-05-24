const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CompostagemDado = sequelize.define('CompostagemDado', {
  t_com: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  t_amb: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  u_amb: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tensao: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  data_hora: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Hora: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'compostagem_dados',
  timestamps: false, 
});

module.exports = CompostagemDado;
