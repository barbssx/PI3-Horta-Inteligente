const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const moment = require("moment");
const Registro = require("../models/Registro");

const logError = (context, error) => {
  const details =
    error instanceof Error
      ? error.stack || error.message
      : typeof error === "string"
      ? error
      : JSON.stringify(error);
  console.error(`[fileController] ${context}:`, details);
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("Nenhum arquivo enviado.");

    const file = req.file;
    const uploadPath = file.path;
    let registros = [];

    const parseNumber = (value) => {
      if (typeof value === "string") {
        value = value.replace(",", ".").trim();
      }
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    };

    const parseRow = (row) => {
      const ano = parseInt(row.Ano);
      const mes = parseInt(row["Mês"]) - 1;
      const dia = parseInt(row.Dia);

      const horaNum = parseInt(row.Hora);
      const minNum = parseInt(row.Min);
      const segNum = parseInt(row.Seg);

      const momentData = moment({ year: ano, month: mes, day: dia });
      const data = momentData.isValid()
        ? momentData.format("YYYY-MM-DD")
        : null;

      const momentHora = moment({
        hour: horaNum,
        minute: minNum,
        second: segNum,
      });
      const hora = momentHora.isValid() ? momentHora.format("HH:mm:ss") : null;

      return {
        t_com: parseNumber(row.T_Comp),
        t_amb: parseNumber(row.T_Amb),
        u_amb: parseNumber(row.U_Amb),
        tensao: parseNumber(row["Tensão"]),
        data,
        hora,
      };
    };

    if (file.originalname.endsWith(".csv")) {
      fs.createReadStream(uploadPath)
        .pipe(csv({ separator: "\t" }))
        .on("data", (row) => {
          console.log("Linha lida (CSV):", row);
          const registro = parseRow(row);
          if (
            registro.t_com !== null &&
            registro.data !== null &&
            registro.hora !== null
          ) {
            registros.push(registro);
          } else {
            logError(
              "Linha CSV ignorada por conter data ou hora inválida",
              row
            );
          }
        })
        .on("end", async () => {
          if (registros.length > 0) {
            await Registro.bulkCreate(registros);
            res.send({ message: "Dados CSV inseridos com sucesso." });
          } else {
            res.status(400).send("Nenhum registro válido encontrado.");
          }
        });
    } else if (file.originalname.endsWith(".xlsx")) {
      const ExcelJS = require("exceljs");
      const workbook = new ExcelJS.stream.xlsx.WorkbookReader(uploadPath);

      const BATCH_SIZE = 500;
      let batch = [];
      let isHeaderRow = true;

      for await (const worksheet of workbook) {
        for await (const row of worksheet) {
          if (isHeaderRow) {
            isHeaderRow = false;
            continue;
          }

          const registro = parseRow({
            T_Comp: row.getCell(1).value,
            T_Amb: row.getCell(2).value,
            U_Amb: row.getCell(3).value,
            Tensão: row.getCell(4).value,
            Ano: row.getCell(5).value,
            Mês: row.getCell(6).value,
            Dia: row.getCell(7).value,
            Hora: row.getCell(8).value,
            Min: row.getCell(9).value,
            Seg: row.getCell(10).value,
          });

          if (
            registro.t_com !== null &&
            registro.data !== null &&
            registro.hora !== null
          ) {
            batch.push(registro);
          } else {
            logError(
              "Linha XLSX ignorada por conter data ou hora inválida",
              row.values
            );
          }

          if (batch.length >= BATCH_SIZE) {
            await Registro.bulkCreate(batch);
            batch = [];
          }
        }
      }

      if (batch.length > 0) {
        await Registro.bulkCreate(batch);
      }

      res.send({ message: "Dados XLSX inseridos com sucesso." });
    } else {
      res.status(400).send("Formato de arquivo não suportado.");
    }
  } catch (err) {
    logError("Erro ao processar o arquivo", err);
    res.status(500).send("Erro ao processar o arquivo.");
  }
};
