import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDbConnection } from '../../db/db';
import { categories, sharedTodos, tags, todoTags, todos } from '../../db/schema';
import { authProcedure, router } from '../trpc';

async function executeDbOperation(operation: () => Promise<any>, errorMsg: string) {
	try {
		const result = await operation();
		return result;
	} catch (error) {
		console.error(error);
		throw new TRPCError({
			code: 'INTERNAL_SERVER_ERROR',
			message: errorMsg,
			cause: error,
		});
	}
}

export const todoRouter = router({
	// Get all todos for the current user
	list: authProcedure.query(async ({ ctx }) => {
		if (!ctx.user?.id) {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
		}

		return executeDbOperation(
			() =>
				getDbConnection()
					.db.select()
					.from(todos)
					.where(eq(todos.user_id, ctx.user.id))
					.leftJoin(categories, eq(todos.category_id, categories.id))
					.leftJoin(todoTags, eq(todos.id, todoTags.todo_id))
					.leftJoin(tags, eq(todoTags.tag_id, tags.id)),
			'Failed to fetch todos',
		);
	}),

	// Get a single todo by ID
	get: authProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		if (!ctx.user?.id) {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
		}

		return executeDbOperation(
			() =>
				getDbConnection()
					.db.select()
					.from(todos)
					.where(and(eq(todos.id, input.id), eq(todos.user_id, ctx.user.id)))
					.leftJoin(categories, eq(todos.category_id, categories.id))
					.leftJoin(todoTags, eq(todos.id, todoTags.todo_id))
					.leftJoin(tags, eq(todoTags.tag_id, tags.id)),
			'Failed to fetch todo',
		);
	}),

	// Create a new todo
	create: authProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string().optional(),
				status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
				priority: z.enum(['low', 'medium', 'high']).default('medium'),
				due_date: z.string().optional(),
				category_id: z.string().optional(),
				tag_ids: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.user?.id) {
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
			}

			const { tag_ids, ...todoData } = input;

			return executeDbOperation(async () => {
				const { db } = getDbConnection();
				const [todo] = await db
					.insert(todos)
					.values({
						...todoData,
						user_id: ctx.user.id,
					})
					.returning();

				if (tag_ids?.length) {
					await db.insert(todoTags).values(
						tag_ids.map((tag_id) => ({
							todo_id: todo.id,
							tag_id,
						})),
					);
				}

				return todo;
			}, 'Failed to create todo');
		}),

	// Update an existing todo
	update: authProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().optional(),
				description: z.string().optional(),
				status: z.enum(['pending', 'in_progress', 'completed']).optional(),
				priority: z.enum(['low', 'medium', 'high']).optional(),
				due_date: z.string().optional(),
				category_id: z.string().optional(),
				tag_ids: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.user?.id) {
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
			}

			const { id, tag_ids, ...updateData } = input;

			return executeDbOperation(async () => {
				const { db } = getDbConnection();
				const [todo] = await db
					.update(todos)
					.set(updateData)
					.where(and(eq(todos.id, id), eq(todos.user_id, ctx.user.id)))
					.returning();

				if (tag_ids) {
					// Delete existing tags
					await db.delete(todoTags).where(eq(todoTags.todo_id, id));
					// Insert new tags
					if (tag_ids.length) {
						await db.insert(todoTags).values(
							tag_ids.map((tag_id) => ({
								todo_id: id,
								tag_id,
							})),
						);
					}
				}

				return todo;
			}, 'Failed to update todo');
		}),

	// Delete a todo
	delete: authProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		if (!ctx.user?.id) {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
		}

		return executeDbOperation(
			() =>
				getDbConnection()
					.db.delete(todos)
					.where(and(eq(todos.id, input.id), eq(todos.user_id, ctx.user.id)))
					.returning(),
			'Failed to delete todo',
		);
	}),

	// Share a todo with another user
	share: authProcedure
		.input(
			z.object({
				todo_id: z.string(),
				shared_with_user_id: z.string(),
				can_edit: z.boolean().default(false),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.user?.id) {
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
			}

			return executeDbOperation(
				() =>
					getDbConnection()
						.db.insert(sharedTodos)
						.values({
							...input,
							created_at: new Date().toISOString(),
						})
						.returning(),
				'Failed to share todo',
			);
		}),
});
