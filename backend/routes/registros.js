const express = require('express');
const router = express.Router();
const registrosController = require('../controllers/registrosController');

router.get('/', registrosController.getAll);

module.exports = router;
