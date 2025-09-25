const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const xlsx = require("xlsx");
const moment = require("moment");
const Registro = require("../models/Registro");

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
      const data = moment({
        year: parseInt(row.Ano),
        month: parseInt(row["Mês"]) - 1,
        day: parseInt(row.Dia),
      }).format("YYYY-MM-DD");

      const hora = moment({
        hour: parseInt(row.Hora),
        minute: parseInt(row.Min),
        second: parseInt(row.Seg),
      }).format("HH:mm:ss");

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
          console.log("Linha lida:", row);
          const registro = parseRow(row);
          if (registro.data && registro.hora) {
            registros.push(registro);
          } else {
            console.warn("Data ou hora inválidas para a linha:", row);
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

      for await (const worksheet of workbook) {
        for await (const row of worksheet) {
          const registro = parseRow({
            Ano: row.getCell("Ano").value || row.getCell(1).value,
            Mês: row.getCell("Mês").value || row.getCell(2).value,
            Dia: row.getCell("Dia").value || row.getCell(3).value,
            Hora: row.getCell("Hora").value || row.getCell(4).value,
            Min: row.getCell("Min").value || row.getCell(5).value,
            Seg: row.getCell("Seg").value || row.getCell(6).value,
            T_Comp: row.getCell("T_Comp").value || row.getCell(7).value,
            T_Amb: row.getCell("T_Amb").value || row.getCell(8).value,
            U_Amb: row.getCell("U_Amb").value || row.getCell(9).value,
            Tensão: row.getCell("Tensão").value || row.getCell(10).value,
          });

          if (registro.data && registro.hora) batch.push(registro);

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
    console.error("Erro ao processar o arquivo:", err);
    res.status(500).send("Erro ao processar o arquivo.");
  }
};
