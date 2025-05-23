const Registro = require('../models/Registro');

exports.getAll = async (req, res) => {
  try {
    const registros = await Registro.findAll({
      order: [['id', 'DESC']], 
    });
    res.json(registros);
  } catch (error) {
    console.error('Erro ao buscar registros:', error);
    res.status(500).json({ error: 'Erro ao buscar registros' });
  }
};
