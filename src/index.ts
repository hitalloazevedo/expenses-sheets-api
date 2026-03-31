import Fastify from 'fastify'

import { ExpenseUseCase } from './use-cases/expenses.usecase.js'
import { PostgresExpenseRepository } from './expense.postgres.js';
import { pool } from './infra/db.js';
import { getEnv } from './get-env.js';

const fastify = Fastify({
  logger: true
})

const expenseUseCase = new ExpenseUseCase(new PostgresExpenseRepository(pool));

fastify.post('/expenses', async function handler (request, reply) {
  
    const correlationId = request.headers['x-correlation-id'] as string | undefined;
    const source = request.headers['x-source'] as string | undefined;

    if (!correlationId) {
        return reply.status(400).send({ message: 'Missing X-Correlation-Id header' });
    }

    if (typeof request.body !== 'object' || request.body === null) {
        return reply.status(400).send({ message: 'Invalid request body' });
    }

    const savedExpense = await expenseUseCase.create({ 
      ...request.body, 
      correlation_id: correlationId,
      source: source
    });

    if (!savedExpense.success) return reply.status(400).send({ message: 'error to create expense' })
    
    return savedExpense.data
})

try {
  await fastify.listen({ port: Number.parseInt(getEnv('PORT')), host: '0.0.0.0' })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}