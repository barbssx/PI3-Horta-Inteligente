const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const Registro = require('../models/Registro');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || !req.files.file) return res.status(400).send('Nenhum arquivo enviado.');

    const file = req.files.file;
    const uploadPath = path.join(__dirname, '../uploads', file.name);
    await file.mv(uploadPath);

    let registros = [];

    if (file.name.endsWith('.csv')) {
      fs.createReadStream(uploadPath)
        .pipe(csv())
        .on('data', row => registros.push({
          T_Comp: parseFloat(row.T_Comp),
          T_Amb: parseFloat(row.T_Amb),
          U_Amb: parseFloat(row.U_Amb),
          Tensao: parseFloat(row['Tensão']),
          Ano: parseInt(row.Ano),
          Mes: parseInt(row['Mês']),
          Dia: parseInt(row.Dia),
          Hora: parseInt(row.Hora),
          Min: parseInt(row.Min),
          Seg: parseInt(row.Seg)
        }))
        .on('end', async () => {
          await Registro.bulkCreate(registros);
          res.send('Dados inseridos com sucesso.');
        });
    } else if (file.name.endsWith('.xlsx')) {
      const workbook = xlsx.readFile(uploadPath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = xlsx.utils.sheet_to_json(sheet);
      registros = rows.map(row => ({
        T_Comp: parseFloat(row.T_Comp),
        T_Amb: parseFloat(row.T_Amb),
        U_Amb: parseFloat(row.U_Amb),
        Tensao: parseFloat(row['Tensão']),
        Ano: parseInt(row.Ano),
        Mes: parseInt(row['Mês']),
        Dia: parseInt(row.Dia),
        Hora: parseInt(row.Hora),
        Min: parseInt(row.Min),
        Seg: parseInt(row.Seg)
      }));
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
