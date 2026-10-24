const express = require('express');
const app = express();
app.use(express.json());
const port = 8080;

const makeCrudRouter = require('./routes/crudFactory');

app.use('/transactions', makeCrudRouter(
  'transactions',
  ['description', 'amount_cents', 'transaction_date', 'category_id'],
  ['amount_cents', 'transaction_date', 'category_id'
  ]
));

app.use('/budgets', makeCrudRouter('budgets', ['category_id', 'limit_cents', 'month']));

app.use('/categories', makeCrudRouter('categories', ['name']));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})