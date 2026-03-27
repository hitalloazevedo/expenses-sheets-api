import type { Pool } from "pg";
import type { ExpenseRepository } from "./expense.repository.js";
import type { Expense } from "./expense.schema.js";
import { err, ok, type Result } from "./result.js";

export class PostgresExpenseRepository implements ExpenseRepository {

  public constructor(private pool: Pool) { }

  async findAll(): Promise<Expense[]> {
    const result = await this.pool.query(
      `SELECT
        e.description,
        e.category,
        t.amount,
        t.date
      FROM expenses e
      JOIN transactions t ON e.id_transaction = t.id
      ORDER BY t.date DESC`
    );

    return result.rows.map(row => ({
      description: row.description,
      category: row.category,
      amount: Math.abs(row.amount),
      date: row.date.toISOString().split('T')[0]
    }));
  }

  async save(expense: Expense): Promise<Result<Expense, string>> {
    const client = await this.pool.connect();
    try {

      await client.query("BEGIN");

      const signedAmount = -Math.abs(expense.amount)

      // 1. cria transaction
      const txResult = await client.query(
        `INSERT INTO transactions (amount, date)
               VALUES ($1, $2)
               RETURNING id`,
        [signedAmount, expense.date]
      );

      const transactionId = txResult.rows[0].id;

      // 2. cria expense
      await client.query(
        `INSERT INTO expenses (description, category, id_transaction)
               VALUES ($1, $2, $3)`,
        [expense.description, expense.category, transactionId]
      );

      await client.query("COMMIT");

      return ok(expense);

    } catch (e) {
      console.error("ERRO REAL:", e);
      await client.query("ROLLBACK");
      return err("DATABASE_ERROR");
    } finally {
      client.release();
    }
  }
}