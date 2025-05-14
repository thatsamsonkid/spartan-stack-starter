export type TodoStatus = 'pending' | 'in_progress' | 'completed';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Category {
	id: string;
	name: string;
	color: string;
	user_id: string;
	created_at: string;
	updated_at: string;
}

export interface Tag {
	id: string;
	name: string;
	color: string;
	user_id: string;
	created_at: string;
	updated_at: string;
}

export interface Todo {
	id: string;
	title: string;
	description?: string;
	status: TodoStatus;
	priority: TodoPriority;
	due_date?: string;
	category_id?: string;
	user_id: string;
	created_at: string;
	updated_at: string;
	category?: Category;
	tags?: Tag[];
}

export interface SharedTodo {
	todo_id: string;
	shared_with_user_id: string;
	can_edit: boolean;
	created_at: string;
}

export interface CreateTodoInput {
	title: string;
	description?: string;
	status?: TodoStatus;
	priority?: TodoPriority;
	due_date?: string;
	category_id?: string;
	tag_ids?: string[];
}

export interface UpdateTodoInput extends Partial<CreateTodoInput> {
	id: string;
}

export interface CreateCategoryInput {
	name: string;
	color: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
	id: string;
}

export interface CreateTagInput {
	name: string;
	color: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> {
	id: string;
}

export interface ShareTodoInput {
	todo_id: string;
	shared_with_user_id: string;
	can_edit: boolean;
}
