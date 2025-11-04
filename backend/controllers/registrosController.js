const { Op } = require("sequelize");
const CompostagemDado = require("../models/Registro.js");

exports.getAll = async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) return res.json([]);

    const dataInicio = new Date(data);
    dataInicio.setHours(0, 0, 0, 0);

    const dataFim = new Date(data);
    dataFim.setHours(23, 59, 59, 999);

    const registros = await CompostagemDado.findAll({
      where: {
        data: {
          [Op.between]: [dataInicio, dataFim],
        },
      },
      order: [["id", "DESC"]],
    });

    res.json(registros);
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    res.status(500).json({ error: "Erro ao buscar registros" });
  }
};
