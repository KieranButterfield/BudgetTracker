const express = require('express');
const router = express.Router();
const pool = require('../db');

// Budgets Get endpoint
router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM budgets");
    res.send(result.rows);
  } catch (err) {
    console.error("Error fetching budgets: ", err);
    res.status(500).send('Something went wrong');
  }
});

// Budgets Post endpoint
router.post('/', async (req, res) => {
  try{
  const {category_id, limit_cents, month} = req.body;
  const result = await pool.query(
    'INSERT INTO budgets (category_id, limit_cents, month) VALUES ($1, $2, $3) RETURNING *',
  [category_id, limit_cents, month]
  );
  res.json(result.rows[0]);
} catch (err) {
  console.error('Error adding budget: ', err);
  res.status(500).send('Something went wrong');
}
  });

 // Budgets Delete endpoint
router.delete('/:id', async (req, res) => {
  try{
  const {id} = req.params;
  const result = await pool.query(
    'DELETE FROM budgets WHERE id = $1', [id]
  );
  res.status(204).send();
} catch (err) {
  console.error('Error deleting budgets: ', err);
  res.status(500).send('Something went wrong');
}
  });
 
  // Budgets Put endpoint
router.put('/:id', async (req, res) => {
  try{
  const { id } = req.params;
  const {category_id, limit_cents, month} = req.body;
  const result = await pool.query(
    'UPDATE budgets SET category_id = $1, limit_cents = $2, month = $3 WHERE id = $4 RETURNING *', 
    [category_id, limit_cents, month, id]
  );
  res.json(result.rows[0]);
} catch (err) {
  console.error('Error updating budget: ', err);
  res.status(500).send('Something went wrong');
}
  });

  module.exports = router;