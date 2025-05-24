const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const moment = require('moment');
const Registro = require('../models/Registro');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('Nenhum arquivo enviado.');

    const file = req.file;
    const uploadPath = file.path;
    let registros = [];

    const parseNumber = (value) => {
      if (typeof value === 'string') {
        value = value.replace(',', '.').trim();
      }
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    };

    const parseRow = (row) => {
      const data_hora = moment({
        year: parseInt(row.Ano),
        month: parseInt(row['Mês']) - 1,
        day: parseInt(row.Dia),
        hour: parseInt(row.Hora),
        minute: parseInt(row.Min),
        second: parseInt(row.Seg),
      });

      return {
        t_com: parseNumber(row.T_Comp),
        t_amb: parseNumber(row.T_Amb),
        u_amb: parseNumber(row.U_Amb),
        tensao: parseNumber(row['Tensão']),
        data_hora: data_hora.isValid() ? data_hora.toDate() : null
      };
    };

    if (file.originalname.endsWith('.csv')) {
      fs.createReadStream(uploadPath)
        .pipe(csv())
        .on('data', (row) => {
          registros.push(parseRow(row));
        })
        .on('end', async () => {
          await Registro.bulkCreate(registros);
          res.send({ message: 'Dados CSV inseridos com sucesso.' });
        });
    } else if (file.originalname.endsWith('.xlsx')) {
      const workbook = xlsx.readFile(uploadPath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet);
      registros = rows.map(row => parseRow(row));
      await Registro.bulkCreate(registros);
      res.send({ message: 'Dados XLSX inseridos com sucesso.' });
    } else {
      res.status(400).send('Formato de arquivo não suportado.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao processar o arquivo.');
  }
};
