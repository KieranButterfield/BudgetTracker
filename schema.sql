CREATE TABLE categories (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL UNIQUE);

CREATE TABLE transactions (id SERIAL PRIMARY KEY, description VARCHAR(255), 
amount_cents INTEGER NOT NULL, transaction_date DATE NOT NULL, category_id INT REFERENCES categories(id));

CREATE TABLE budgets (id SERIAL PRIMARY KEY, category_id INT REFERENCES categories(id), limit_cents INTEGER NOT NULL, month DATE NOT NULL);

INSERT INTO categories (name) VALUES ('Groceries'), ('Dining'), ('Rent'), ('Utilities'), ('Entertainment'), ('Transportation'), ('Shopping'), ('Health'), ('Subscriptions'), ('Income'), ('Other'); 