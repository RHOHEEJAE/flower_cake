const router = require('express').Router();
const db = require('../database');

router.get('/', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
  res.json(categories);
});

module.exports = router;
