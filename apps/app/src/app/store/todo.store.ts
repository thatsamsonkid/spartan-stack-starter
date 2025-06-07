import { SupabaseClientService } from '@agora/supabase/core';
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { TrpcClient } from '../../trpc-client';
import type {
	Category,
	CreateCategoryInput,
	CreateTagInput,
	CreateTodoInput,
	ShareTodoInput,
	Tag,
	Todo,
	UpdateCategoryInput,
	UpdateTagInput,
	UpdateTodoInput,
} from '../core/types/todo.types';
import { withLogger } from './utils';

interface TodoState {
	todos: Todo[];
	categories: Category[];
	tags: Tag[];
	loading: boolean;
	error: string | null;
}

const initialState: TodoState = {
	todos: [],
	categories: [],
	tags: [],
	loading: false,
	error: null,
};

export const TodoStore = signalStore(
	{ providedIn: 'root' },
	withLogger('todo'),
	withState<TodoState>(initialState),
	withComputed(({ todos }) => ({
		pendingTodos: computed(() => todos().filter((todo) => todo.status === 'pending')),
		inProgressTodos: computed(() => todos().filter((todo) => todo.status === 'in_progress')),
		completedTodos: computed(() => todos().filter((todo) => todo.status === 'completed')),
		highPriorityTodos: computed(() => todos().filter((todo) => todo.priority === 'high')),
		todosByCategory: computed(() => {
			const result: Record<string, Todo[]> = {};
			todos().forEach((todo) => {
				if (todo.category_id) {
					if (!result[todo.category_id]) {
						result[todo.category_id] = [];
					}
					result[todo.category_id].push(todo);
				}
			});
			return result;
		}),
	})),
	withMethods((store, trpc = inject(TrpcClient), supabase = inject(SupabaseClientService)) => {
		// const supabase = inject(SupabaseClientService);

		return {
			// Todo methods
			async loadTodos() {
				patchState(store, { loading: true });
				try {
					//  const { data, error } = await supabase.client
					// 		.from('todos')
					// 		.select('*, category:categories(*), tags:todo_tags(tag:tags(*))')
					// 		.order('created_at', { ascending: false });
					const { data, error } = await firstValueFrom(trpc.todo.list.query());
					console.log('data', data);
					if (error) throw error;
					patchState(store, { todos: data as unknown as Todo[] });
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to load todos' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			async createTodo(input: CreateTodoInput) {
				patchState(store, { loading: true });
				try {
					const { data, error } = await firstValueFrom(trpc.todo.create.mutate(input));

					if (error) throw error;
					await this.loadTodos();
					return data;
				} catch (error) {
					console.log('error', error);
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to create todo' });
					return null;
				} finally {
					patchState(store, { loading: false });
				}
			},

			async updateTodo(input: UpdateTodoInput) {
				patchState(store, { loading: true });
				try {
					const { error } = await supabase.client.from('todos').update(input).eq('id', input.id);

					if (error) throw error;

					if (input.tag_ids) {
						// Delete existing tags
						await supabase.client.from('todo_tags').delete().eq('todo_id', input.id);

						// Insert new tags
						if (input.tag_ids.length) {
							const tagInserts = input.tag_ids.map((tag_id) => ({
								todo_id: input.id,
								tag_id,
							}));

							const { error: tagError } = await supabase.client.from('todo_tags').insert(tagInserts);

							if (tagError) throw tagError;
						}
					}

					await this.loadTodos();
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to update todo' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			async deleteTodo(id: string) {
				patchState(store, { loading: true });
				try {
					const { error } = await supabase.client.from('todos').delete().eq('id', id);

					if (error) throw error;
					await this.loadTodos();
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to delete todo' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			async shareTodo(input: ShareTodoInput) {
				patchState(store, { loading: true });
				try {
					const { error } = await supabase.client.from('shared_todos').insert(input);

					if (error) throw error;
					await this.loadTodos();
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to share todo' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			// Category methods
			async loadCategories() {
				patchState(store, { loading: true });
				try {
					const { data, error } = await supabase.client.from('categories').select().order('name');

					if (error) throw error;
					patchState(store, { categories: data });
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to load categories' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			async createCategory(input: CreateCategoryInput) {
				patchState(store, { loading: true });
				try {
					const { data, error } = await supabase.client.from('categories').insert(input).select().single();

					if (error) throw error;
					patchState(store, (state) => ({ categories: [...state.categories, data] }));
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to create category' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			async updateCategory(input: UpdateCategoryInput) {
				patchState(store, { loading: true });
				try {
					const { error } = await supabase.client.from('categories').update(input).eq('id', input.id);

					if (error) throw error;
					await this.loadCategories();
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to update category' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			async deleteCategory(id: string) {
				patchState(store, { loading: true });
				try {
					const { error } = await supabase.client.from('categories').delete().eq('id', id);

					if (error) throw error;
					await this.loadCategories();
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to delete category' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			// Tag methods
			async loadTags() {
				patchState(store, { loading: true });
				try {
					const { data, error } = await supabase.client.from('tags').select().order('name');

					if (error) throw error;
					patchState(store, { tags: data });
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to load tags' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			async createTag(input: CreateTagInput) {
				patchState(store, { loading: true });
				try {
					const { data, error } = await supabase.client.from('tags').insert(input).select().single();

					if (error) throw error;
					patchState(store, (state) => ({ tags: [...state.tags, data] }));
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to create tag' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			async updateTag(input: UpdateTagInput) {
				patchState(store, { loading: true });
				try {
					const { error } = await supabase.client.from('tags').update(input).eq('id', input.id);

					if (error) throw error;
					await this.loadTags();
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to update tag' });
				} finally {
					patchState(store, { loading: false });
				}
			},

			async deleteTag(id: string) {
				patchState(store, { loading: true });
				try {
					const { error } = await supabase.client.from('tags').delete().eq('id', id);

					if (error) throw error;
					await this.loadTags();
				} catch (error) {
					patchState(store, { error: error instanceof Error ? error.message : 'Failed to delete tag' });
				} finally {
					patchState(store, { loading: false });
				}
			},
		};
	}),
);
