const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const moment = require('moment');
const Registro = require('../models/Registro');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) return res.status(400).send('Nenhum arquivo enviado.');

    const file = req.files.file;
    const uploadPath = path.join(__dirname, '../uploads', file.name);
    await file.mv(uploadPath);

    let registros = [];

    const parseRow = (row) => {
      const data_hora = moment({
        year: parseInt(row.Ano),
        month: parseInt(row['Mês']) - 1, 
        day: parseInt(row.Dia),
        hour: parseInt(row.Hora),
        minute: parseInt(row.Min),
        second: parseInt(row.Seg),
      }).toDate();

      return {
        t_com: parseFloat(row.T_Comp),
        t_amb: parseFloat(row.T_Amb),
        u_amb: parseFloat(row.U_Amb),
        tensao: parseFloat(row['Tensão']),
        data_hora
      };
    };

    if (file.name.endsWith('.csv')) {
      fs.createReadStream(uploadPath)
        .pipe(csv())
        .on('data', (row) => {
          registros.push(parseRow(row));
        })
        .on('end', async () => {
          await Registro.bulkCreate(registros);
          res.send('Dados inseridos com sucesso.');
        });
    } else if (file.name.endsWith('.xlsx')) {
      const workbook = xlsx.readFile(uploadPath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet);

      registros = rows.map(row => parseRow(row));
      await Registro.bulkCreate(registros);
      res.send('Dados inseridos com sucesso.');
    } else {
      res.status(400).send('Formato de arquivo não suportado.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao processar o arquivo.');
  }
};
