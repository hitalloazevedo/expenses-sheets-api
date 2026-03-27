import { PostgresExpenseRepository } from "../expense.postgres.js";
import { createExpenseDtoSchema, type Expense } from "../expense.schema.js";
import { err, ok, type Result } from "../result.js";

export class ExpenseUseCase {

    public constructor(
        private readonly expenseRepository: PostgresExpenseRepository
    ) {}

    async create(expense: unknown): Promise<Result<Expense, string>> {

        const parsed = createExpenseDtoSchema.safeParse(expense);

        if (!parsed.success) return err("VALIDATION_ERROR");
        
        const data = parsed.data;
        const date = data.date ?? new Date().toISOString().slice(0, 10)

        const savedExpense = await this.expenseRepository.save({
            amount: data.amount,
            category: data.category,
            date,
            description: data.description
        })

        if (!savedExpense.success) return err('DATABASE_ERROR')
        
        return savedExpense
    }

    async findAll() {
        const expenses = await this.expenseRepository.findAll();
        return expenses;
    }
}

export type CreateExpenseError = "VALIDATION_ERROR" | "DATABASE_ERROR";
export type CreateExpenseResult = Result<Expense, CreateExpenseError>;