import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { getDbConnection } from '../../db/db';
import { sharedTodos, todoTags, todos } from '../../db/schema';
import { authProcedure, router } from '../trpc';

type DbResult<T> = {
	data: T | null;
	error: string | null;
	success: boolean;
};

async function executeDbOperation<T>(operation: () => Promise<T>, errorMsg: string): Promise<DbResult<T>> {
	try {
		const result = await operation();
		return {
			data: result,
			error: null,
			success: true,
		};
	} catch (error) {
		console.error(error);
		return {
			data: null,
			error: errorMsg,
			success: false,
		};
	}
}

// Helper function to handle TRPC responses
function handleDbResult<T>(result: DbResult<T>): { data: T | null; error: string | null } {
	return {
		data: result.success ? result.data : null,
		error: result.success ? null : result.error,
	};
}

export const todoRouter = router({
	// Get all todos for the current user
	list: authProcedure.query(async ({ ctx }) => {
		if (!ctx.user?.id) {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
		}

		const result = await executeDbOperation(
			() =>
				getDbConnection()
					.db.select()
					.from(todos)
					.where(eq(todos.user_id, ctx?.user?.id ?? '')),
			// .leftJoin(categories, eq(todos.category_id, categories.id))
			// .leftJoin(todoTags, eq(todos.id, todoTags.todo_id))
			// .leftJoin(tags, eq(todoTags.tag_id, tags.id)),
			'Failed to fetch todos',
		);

		return handleDbResult(result);
	}),

	// Get a single todo by ID
	get: authProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
		if (!ctx.user?.id) {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
		}

		const result = await executeDbOperation(
			() =>
				getDbConnection()
					.db.select()
					.from(todos)
					.where(and(eq(todos.id, input.id), eq(todos.user_id, ctx?.user?.id ?? ''))),
			// .leftJoin(categories, eq(todos.category_id, categories.id))
			// .leftJoin(todoTags, eq(todos.id, todoTags.todo_id))
			// .leftJoin(tags, eq(todoTags.tag_id, tags.id)),
			'Failed to fetch todo',
		);

		return handleDbResult(result);
	}),

	// Create a new todo
	create: authProcedure
		.input(
			z.object({
				title: z.string(),
				description: z.string().optional(),
				status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
				priority: z.enum(['low', 'medium', 'high']).default('medium'),
				due_date: z.string().nullish(),
				category_id: z.string().nullish(),
				tagIds: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			console.log('ctx', ctx);
			if (!ctx.user?.id) {
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
			}

			const { tagIds, ...todoData } = input;

			const result = await executeDbOperation(async () => {
				const { db } = getDbConnection();
				const [todo] = await db
					.insert(todos)
					.values({
						...todoData,
						user_id: ctx?.user?.id ?? '',
					})
					.returning();

				if (tagIds?.length) {
					await db.insert(todoTags).values(
						tagIds.map((tagId) => ({
							todo_id: todo.id,
							tag_id: tagId,
						})),
					);
				}

				return todo;
			}, 'Failed to create todo');

			return handleDbResult(result);
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
				due_date: z.string().nullish(),
				category_id: z.string().nullish(),
				tagIds: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.user?.id) {
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
			}

			const { id, tagIds, ...updateData } = input;

			const result = await executeDbOperation(async () => {
				const { db } = getDbConnection();
				const [todo] = await db
					.update(todos)
					.set(updateData)
					.where(and(eq(todos.id, id), eq(todos.user_id, ctx?.user?.id ?? '')))
					.returning();

				if (tagIds) {
					// Delete existing tags
					await db.delete(todoTags).where(eq(todoTags.todo_id, id));
					// Insert new tags
					if (tagIds.length) {
						await db.insert(todoTags).values(
							tagIds.map((tagId) => ({
								todo_id: id,
								tag_id: tagId,
							})),
						);
					}
				}

				return todo;
			}, 'Failed to update todo');

			return handleDbResult(result);
		}),

	// Delete a todo
	delete: authProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
		if (!ctx.user?.id) {
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
		}

		const result = await executeDbOperation(
			() =>
				getDbConnection()
					.db.delete(todos)
					.where(and(eq(todos.id, input.id), eq(todos.user_id, ctx?.user?.id ?? '')))
					.returning(),
			'Failed to delete todo',
		);

		return handleDbResult(result);
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

			const result = await executeDbOperation(
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

			return handleDbResult(result);
		}),
});
