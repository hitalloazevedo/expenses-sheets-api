import Fastify from 'fastify'

import { ExpenseUseCase } from './use-cases/expenses.usecase.js'
import { PostgresExpenseRepository } from './expense.postgres.js';
import { pool } from './infra/db.js';

const fastify = Fastify({
  logger: true
})

const expenseUseCase = new ExpenseUseCase(new PostgresExpenseRepository(pool));


fastify.post('/expenses', async function handler (request, reply) {
  
    const savedExpense = await expenseUseCase.create(request.body);

    if (!savedExpense.success) return reply.status(400).send({ message: 'error to create expense' })
    
    return savedExpense.data
})

try {
  await fastify.listen({ port: 3000, host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}