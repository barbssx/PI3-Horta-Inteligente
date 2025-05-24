const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registro = sequelize.define('Registro', {
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
  data: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  hora: {
    type: DataTypes.TEXT,
    allowNull: false,
  },  
}, {
  tableName: 'compostagem_dados',
  timestamps: false, 
});

module.exports = Registro;
