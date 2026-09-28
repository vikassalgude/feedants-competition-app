const express = require('express');
const router = express.Router();
const competitionController = require('../controllers/competitionController');

// GET all competitions
router.get('/', competitionController.getAllCompetitions);

// GET competition details
router.get('/:id', competitionController.getCompetitionDetails);

// POST register for competition (Atomic spot reservation)
router.post('/:id/register', competitionController.registerForCompetition);

// POST set spots remaining (Demo helper)
router.post('/:id/set-spots-left', competitionController.setSpotsLeft);

// POST submit entry
router.post('/:id/submit', competitionController.submitEntry);

// POST seed sample data
router.post('/seed', competitionController.seedDatabase);

module.exports = router;
