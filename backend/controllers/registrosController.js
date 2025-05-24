const { Op, fn, col, where } = require("sequelize");
const CompostagemDado = require("../models/Registro.js");

exports.getAll = async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) return res.json([]);

    const registros = await CompostagemDado.findAll({
      where: {
        data: data,
      },
      order: [["id", "DESC"]],
    });

    res.json(registros);
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    res.status(500).json({ error: "Erro ao buscar registros" });
  }
};
