const express = require('express');
const app = express();
app.use(express.json());
const port = 8080;

const transactionsRouter = require('./routes/transactions');
app.use('/transactions', transactionsRouter);

const budgetsRouter = require('./routes/transactions');
app.use('/budgets', budgetsRouter);

const categoriesRouter = require('./routes/categories');
app.use('/categories', categoriesRouter);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})