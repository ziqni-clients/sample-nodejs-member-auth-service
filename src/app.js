const express = require('express');
require('dotenv').config();
const competitionController = require('./controllers/competitionController');
const validateParams = require('./middlewares/validationMiddleware');
const extractTokenAndApiKey = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get(
  '/check-competitions',
  extractTokenAndApiKey,
  validateParams,
  competitionController.checkCompetitions
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
