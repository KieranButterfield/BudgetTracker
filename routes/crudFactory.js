const express = require('express');
const pool = require('../db');


function makeCrudRouter(tableName, columns, required = columns){
  const router = express.Router();
// Transactions Get endpoint
  router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    res.json(result.rows); // changed from .status to .json
  } catch (err) {
    console.error(`Error fetching ${tableName}: `, err);
    res.status(500).send('Something went wrong');
  }
});

// Transactions Post endpoint
router.post('/', async (req, res) => {
  try{
    const missing = required.filter(col => req.body[col] === undefined);
  if (missing.length > 0) {
      return res.status(400).json({error: `Missing required fields: ${missing.join(', ')}`});
  }
  const values = columns.map(col => req.body[col]);
  const placeholders = columns.map((col, i) => `$${i+1}`).join(', ');
  const result = await pool.query(
    `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`, values);
  res.json(result.rows[0]);
} catch (err) {
  console.error(`Error adding transaction: `, err);
  res.status(500).send('Something went wrong');
}
  });
 
  // Transactions Put endpoint
router.put('/:id', async (req, res) => {
  try{
    const missing = required.filter(col => req.body[col] === undefined);
    if (missing.length > 0){
      return res.status(400).json({error: `Missing required fields: ${missing.join(', ')}`});
    }
  const values = columns.map(col => req.body[col]);
  const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
  const result = await pool.query(
    `UPDATE ${tableName} SET ${setClause} WHERE id = $${columns.length + 1} RETURNING *`, [...values, req.params.id]);
  res.json(result.rows[0]);
} catch (err) {
  console.error(`Error updating ${tableName}:`, err);
  res.status(500).send('Something went wrong');
}
});

   // Transactions Delete endpoint
router.delete('/:id', async (req, res) => {
  try{
  const result = await pool.query(
    `DELETE FROM ${tableName} WHERE id = $1`, [req.params.id]);
  if (result.rowCount === 0) return res.status(404).json({error: 'Not found'});
  res.status(204).send();
} catch (err) {
  console.error(`Error deleting from ${tableName}:`, err);
  res.status(500).send('Something went wrong');
}
  });
  return router;
}
module.exports = makeCrudRouter;