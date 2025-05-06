export type Todo = {
  _id: string;
  title: string;
  completed: boolean;
  description: string;
  order: number;
  dueDate: string;
};

export type UpdateTodoBody = {
  _id?: string;
  title?: string;
  completed?: boolean;
  description?: string;
  dueDate?: Date;
};
