const express = require('express');
const router = express.Router();
const pool = require('../db');

// Categories Get endpoint
router.get('/', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    res.send(result.rows);
  } catch (err) {
    console.error("Error fetching categories: ", err);
    res.status(500).send('Something went wrong');
  }
});

// Categories Post endpoint
router.post('/', async (req, res) => {
  try{
  const {name} = req.body;
  const result = await pool.query(
    'INSERT INTO categories (name) VALUES ($1) RETURNING *',
  [name]
  );
  res.json(result.rows[0]);
} catch (err) {
  console.error('Error adding category: ', err);
  res.status(500).send('Something went wrong');
}
  });

 // Categories Delete endpoint
router.delete('/:id', async (req, res) => {
  try{
  const {id} = req.params;
  const result = await pool.query(
    'DELETE FROM categories WHERE id = $1', [id]
  );
  res.status(204).send();
} catch (err) {
  console.error('Error deleting categories: ', err);
  res.status(500).send('Something went wrong');
}
  });
 
  // Categories Put endpoint
router.put('/:id', async (req, res) => {
  try{
  const { id } = req.params;
  const {name} = req.body;
  const result = await pool.query(
    'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *', 
    [name, id]
  );
  res.json(result.rows[0]);
} catch (err) {
  console.error('Error updating category: ', err);
  res.status(500).send('Something went wrong');
}
  });

  module.exports = router;