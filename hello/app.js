require('dotenv').config();
console.log('PASSWORD LOADED AS:', process.env.DB_PASSWORD);
const { Pool } = require('pg');
const express = require('express');

const app = express();
app.use(express.json());
const port = 8080;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  connectionTimeoutMillis: 5000,
});

// Transaction Get endpoint
app.get('/transactions', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions");
    res.send(result.rows);
  } catch (err) {
    console.error("Error fetching transactions: ", err);
    res.status(500).send('Something went wrong');
  }
});

// Transaction Post endpoint
app.post('/transactions', async (req, res) => {
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

 // Transaction Delete endpoint
app.delete('/transactions/:id', async (req, res) => {
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
 
  // Transaction Put endpoint
app.put('/transactions/:id', async (req, res) => {
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




  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  })