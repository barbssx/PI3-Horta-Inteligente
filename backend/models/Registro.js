const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registro = sequelize.define('Registro', {
  T_Comp: DataTypes.FLOAT,
  T_Amb: DataTypes.FLOAT,
  U_Amb: DataTypes.FLOAT,
  Tensao: DataTypes.FLOAT,
  Ano: DataTypes.INTEGER,
  Mes: DataTypes.INTEGER,
  Dia: DataTypes.INTEGER,
  Hora: DataTypes.INTEGER,
  Min: DataTypes.INTEGER,
  Seg: DataTypes.INTEGER
});

module.exports = Registro;