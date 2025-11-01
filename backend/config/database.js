const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log("✅ Conectado ao banco Railway"))
  .catch((err) => console.error("❌ Erro ao conectar:", err));

module.exports = sequelize;
