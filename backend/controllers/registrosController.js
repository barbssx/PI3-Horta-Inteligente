const { Op } = require("sequelize");
const Registro = require("../models/Registro");

exports.getAll = async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      return res.json([]);
    }

    const inicio = `${data} 00:00:00`;
    const fim = `${data} 23:59:59`;

    const registros = await Registro.findAll({
      where: {
        data: {
          [Op.between]: [inicio, fim],
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
