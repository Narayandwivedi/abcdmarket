const express = require('express');
const router = express.Router();
const {
  getPublicHeroes,
  getAllHeroes,
  createHero,
  updateHero,
  deleteHero,
  reorderHeroes
} = require('../controllers/heroController');

router.get('/', getPublicHeroes);
router.get('/admin', getAllHeroes);
router.post('/', createHero);
router.patch('/reorder', reorderHeroes);
router.put('/:id', updateHero);
router.delete('/:id', deleteHero);

module.exports = router;
