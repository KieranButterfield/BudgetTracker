const express = require('express');
const router = express.Router();
const pool = require('../db');

// Transactions Get endpoint
router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions");
    res.send(result.rows);
  } catch (err) {
    console.error("Error fetching transactions: ", err);
    res.status(500).send('Something went wrong');
  }
});

// Transactions Post endpoint
router.post('/', async (req, res) => {
  try{
  const {description, amount_cents, transaction_date, category_id} = req.body;
  const result = await pool.query(
    'INSERT INTO transactions (description, amount_cents, transaction_date, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
  [description, amount_cents, transaction_date, category_id]
  );
  res.json(result.rows[0]);
} catch (err) {
  console.error('Error adding transaction: ', err);
  res.status(500).send('Something went wrong');
}
  });

 // Transactions Delete endpoint
router.delete('/:id', async (req, res) => {
  try{
  const {id} = req.params;
  const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1', [id]
  );
  res.status(204).send();
} catch (err) {
  console.error('Error deleting transaction: ', err);
  res.status(500).send('Something went wrong');
}
  });
 
  // Transactions Put endpoint
router.put('/:id', async (req, res) => {
  try{
  const { id } = req.params;
  const {description, amount_cents, transaction_date, category_id} = req.body;
  const result = await pool.query(
    'UPDATE transactions SET description = $1, amount_cents = $2, transaction_date = $3, category_id = $4 WHERE id = $5 RETURNING *', 
    [description, amount_cents, transaction_date, category_id, id]
  );
  res.json(result.rows[0]);
} catch (err) {
  console.error('Error updating transaction: ', err);
  res.status(500).send('Something went wrong');
}
  });

  module.exports = router;