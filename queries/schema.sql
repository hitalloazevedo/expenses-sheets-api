CREATE TABLE transactions (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    amount INT NOT NULL,
    date DATE NOT NULL,
    correlation_id UUID UNIQUE,
    source VARCHAR(50)
);

CREATE TABLE expenses (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    id_transaction INT UNIQUE,
    CONSTRAINT fk_expense_transaction
        FOREIGN KEY (id_transaction)
        REFERENCES transactions(id)
        ON DELETE CASCADE
);

ALTER TABLE transactions
ADD COLUMN correlation_id UUID UNIQUE;

ALTER TABLE transactions
ADD COLUMN source VARCHAR(50);

-- CREATE TABLE expenses_categories (
--     id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
--     name VARCHAR(30) UNIQUE
-- );