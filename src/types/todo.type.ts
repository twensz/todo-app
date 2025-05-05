export type Todo = {
  _id: string;
  title: string;
  completed: boolean;
  description: string;
  order: number;
};

export type UpdateTodoBody = {
  _id?: string;
  title?: string;
  completed?: boolean;
  description?: string;
};
