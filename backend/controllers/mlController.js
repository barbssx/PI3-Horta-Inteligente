const { Sequelize, Op } = require("sequelize");
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

exports.ultimosPorIntervalo = async (req, res) => {
  try {
    const { intervalo = "1d" } = req.query;
    const agora = new Date();
    let dataInicio;

    switch (intervalo) {
      case "6h":
        dataInicio = new Date(agora - 6 * 60 * 60 * 1000);
        break;
      case "1w":
        dataInicio = new Date(agora - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        dataInicio = new Date(agora - 24 * 60 * 60 * 1000);
    }

    const registros = await Registro.findAll({
      where: Sequelize.literal(`
                CAST(CONCAT(data, ' ', hora) AS DATETIME) >= '${dataInicio
                  .toISOString()
                  .replace("T", " ")
                  .substring(0, 19)}'
            `),
      order: [
        ["data", "ASC"],
        ["hora", "ASC"],
      ],
      raw: true,
    });

    console.log(
      `Registros encontrados no intervalo (${intervalo}):`,
      registros.length
    );
    res.json(registros);
  } catch (error) {
    console.error("Erro ao buscar registros por intervalo:", error);
    res.status(500).json({ erro: "Erro ao buscar registros por intervalo." });
  }
};

exports.verificarAnomalias = async (req, res) => {
  try {
    const limiteTolerancia = 3.0;

    const ultimasPrevisoes = await Previsao.findAll({
      limit: 10,
      order: [["id", "DESC"]],
      raw: true,
    });

    const anomalias = ultimasPrevisoes
      .filter((p) => {
        if (p.temperatura_real === null || p.temperatura_prevista === null) {
          return false;
        }
        const desvio = Math.abs(p.temperatura_real - p.temperatura_prevista);
        return desvio > limiteTolerancia;
      })
      .map((p) => ({
        idRegistro: p.registro_id,
        data: p.data,
        hora: p.hora,
        desvio: parseFloat(
          Math.abs(p.temperatura_real - p.temperatura_prevista).toFixed(2)
        ),
        alerta: `Desvio de ${Math.abs(
          p.temperatura_real - p.temperatura_prevista
        ).toFixed(2)}°C excede o limite de ${limiteTolerancia}°C.`,
      }));

    if (anomalias.length > 0) {
      console.log(`ANOMALIA DETECTADA! Total: ${anomalias.length}`);
      res.json({ mensagem: "Anomalias detectadas", anomalias });
    } else {
      res.json({
        mensagem: "Nenhuma anomalia crítica detectada nas últimas medições.",
      });
    }
  } catch (err) {
    console.error("Erro ao verificar anomalias:", err);
    res.status(500).json({ erro: "Erro ao verificar anomalias." });
  }
};

exports.calcularAcuraciaModelo = async (req, res) => {
  try {
    const previsoes = await Previsao.findAll({
      attributes: ["temperatura_real", "temperatura_prevista"],
      where: {
        temperatura_real: { [Op.not]: null },
        temperatura_prevista: { [Op.not]: null },
      },
      raw: true,
    });

    if (!previsoes.length) {
      return res.json({
        mensagem: "Nenhuma previsão completa para calcular a acurácia.",
      });
    }

    let somaErrosQuadrados = 0;
    let n = 0;

    previsoes.forEach((p) => {
      const erro = p.temperatura_real - p.temperatura_prevista;
      somaErrosQuadrados += erro * erro;
      n++;
    });

    const mse = somaErrosQuadrados / n;
    const rmse = Math.sqrt(mse);

    const acuracia = {
      totalPrevisoes: n,
      MSE: parseFloat(mse.toFixed(4)),
      RMSE: parseFloat(rmse.toFixed(4)),
      mensagem: `O modelo erra em média em ±${rmse.toFixed(
        2
      )} °C na previsão. (RMSE)`,
    };

    res.json(acuracia);
  } catch (err) {
    console.error("Erro ao calcular acurácia do modelo:", err);
    res.status(500).json({ erro: "Erro ao calcular acurácia do modelo." });
  }
};

exports.gerarComandosDeOtimizacao = async (req, res) => {
  try {
    const ultimaPrevisao = await Previsao.findOne({
      order: [["id", "DESC"]],
      raw: true,
      where: {
        temperatura_prevista: { [Op.not]: null },
        umidade_prevista: { [Op.not]: null },
      },
    });

    if (!ultimaPrevisao) {
      return res.json({
        mensagem: "Nenhuma previsão completa encontrada para otimização.",
      });
    }

    const t_com = ultimaPrevisao.temperatura_prevista;
    const u_amb = ultimaPrevisao.umidade_prevista;

    const comandos = [];
    const t_ideal_min = 55.0;
    const t_ideal_max = 65.0;
    const u_ideal_min = 40.0;
    const u_ideal_max = 60.0;

    if (t_com > t_ideal_max + 3.0) {
      comandos.push({
        acao: "REDUZIR_TEMPERATURA",
        prioridade: "CRÍTICA",
        justificativa: `Previsão de T_Comp (${t_com.toFixed(
          2
        )}°C) indica superaquecimento. Aere vigorosamente OU umedeça para resfriar.`,
      });
    }

    if (t_com < t_ideal_min) {
      comandos.push({
        acao: "AUMENTAR_TEMPERATURA",
        prioridade: "ALTA",
        justificativa: `Previsão de T_Comp (${t_com.toFixed(
          2
        )}°C) indica estagnação. Adicione mais Nitrogênio OU vire a leira.`,
      });
    }

    if (u_amb < u_ideal_min + 5.0) {
      comandos.push({
        acao: "IRRIGAR_LEVEMENTE",
        prioridade: "MÉDIA",
        justificativa: `Previsão de Umidade (${u_amb.toFixed(
          2
        )}%) está caindo. Regue levemente para evitar interrupção do processo.`,
      });
    }

    if (u_amb > u_ideal_max) {
      comandos.push({
        acao: "ADICIONAR_CARBONO_SECO_OU_AERAR",
        prioridade: "ALTA",
        justificativa: `Previsão de Umidade (${u_amb.toFixed(
          2
        )}%) está alta. Isso pode levar à falta de oxigênio. Adicione material seco (Carbono) e aere.`,
      });
    }

    if (comandos.length > 0) {
      res.json({
        mensagem: `Comandos PREDITIVOS gerados com base na previsão para ${ultimaPrevisao.data} às ${ultimaPrevisao.hora}.`,
        tipoAnalise: "PREDITIVA (usando T_Prevista e U_Prevista)",
        dadosAnalisados: { t_previsto: t_com, u_previsto: u_amb },
        comandos,
      });
    } else {
      res.json({
        mensagem:
          "As condições previstas estão na faixa ideal. Nenhuma intervenção preditiva necessária.",
        tipoAnalise: "PREDITIVA",
        dadosAnalisados: { t_previsto: t_com, u_previsto: u_amb },
      });
    }
  } catch (err) {
    console.error("Erro ao gerar comandos de otimização:", err);
    res.status(500).json({ erro: "Erro ao gerar comandos de otimização." });
  }
};
