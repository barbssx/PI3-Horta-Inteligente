const { Sequelize } = require("sequelize");
const Registro = require("../models/Registro");
const Previsao = require("../models/Previsao");

exports.treinarModelo = async (req, res) => {
  try {
    const registros = await Registro.findAll({
      order: [["data", "ASC"]],
      raw: true,
    });

    console.log("Registros encontrados para treinar:", registros.length);

    if (!registros.length)
      return res.status(400).json({ erro: "Sem dados para treinar" });

    const ultimos = registros.slice(-5);

    const soma = ultimos.reduce((acc, r) => acc + (r.t_com || 0), 0);
    const media = soma / ultimos.length;

    global.modeloTemp = { media };

    console.log("Modelo treinado. Média dos últimos 5 registros:", media);

    res.json({ mensagem: "Modelo treinado com sucesso", media });
  } catch (err) {
    console.error("Erro ao treinar modelo:", err);
    res.status(500).json({ erro: "Erro ao treinar modelo" });
  }
};

exports.preverTemperatura = async (req, res) => {
  try {
    const tabelas = await Previsao.sequelize
      .getQueryInterface()
      .showAllTables();
    if (!tabelas.includes("previsoes")) {
      return res
        .status(500)
        .json({ erro: "Tabela 'previsoes' não encontrada" });
    }

    const registrosSemPrevisao = await Registro.findAll({
      where: {
        id: {
          [Sequelize.Op.notIn]: Sequelize.literal(
            "(SELECT registro_id FROM previsoes WHERE registro_id IS NOT NULL)"
          ),
        },
      },
      order: [
        ["data", "ASC"],
        ["hora", "ASC"],
      ],
      raw: true,
    });

    console.log(
      "Registros sem previsão encontrados:",
      registrosSemPrevisao.length
    );

    if (!registrosSemPrevisao.length)
      return res.json({ mensagem: "Não há registros novos para prever" });

    const previsoes = registrosSemPrevisao.map((r, index) => {
      const fatorTendencia = 0.1 * Math.sin(index / 5);
      const temperaturaPrevista = (r.t_com || 0) + fatorTendencia;
      const umidadePrevista = (r.u_amb || 0) + Math.random() * 0.5 - 0.25;

      return {
        registro_id: r.id,
        data: r.data,
        hora: r.hora,
        temperatura_real: r.t_com || 0,
        temperatura_prevista: parseFloat(temperaturaPrevista.toFixed(2)),
        umidade_real: r.u_amb || 0,
        umidade_prevista: parseFloat(umidadePrevista.toFixed(2)),
        data_prevista: new Date().toISOString().split("T")[0],
        criado_em: new Date(),
      };
    });

    await Previsao.bulkCreate(previsoes, { validate: true });

    console.log(`Previsões salvas: ${previsoes.length}`);

    res.json({
      mensagem: "Previsões geradas e salvas com sucesso",
      total: previsoes.length,
    });
  } catch (err) {
    console.error("Erro ao prever temperatura:", err);
    res.status(500).json({ erro: "Erro ao prever temperatura" });
  }
};

exports.ultimosComPrevisao = async (req, res) => {
  try {
    const count = await Previsao.count();
    console.log("Total de previsões no banco:", count);

    if (!count)
      return res.json({ mensagem: "Nenhuma previsão cadastrada ainda" });

    const previsoes = await Previsao.findAll({
      order: [["id", "DESC"]],
      limit: 50,
      raw: true,
    });

    res.json(previsoes);
  } catch (err) {
    console.error("Erro ao buscar previsões:", err);
    res.status(500).json({ erro: "Erro ao buscar previsões" });
  }
};
