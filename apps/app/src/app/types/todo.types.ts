import { InferSelectModel } from 'drizzle-orm';
import { todoPriorityEnum, todos, todoStatusEnum } from '../../server/db/schema';

// These can be inferred from the enums in the schema
export type TodoStatus = (typeof todoStatusEnum.enumValues)[number];
export type TodoPriority = (typeof todoPriorityEnum.enumValues)[number];

// This infers the type from the todos table schema
export type Todo = InferSelectModel<typeof todos>;
