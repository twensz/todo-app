export type Todo = {
  _id: string;
  title: string;
  completed: boolean;
};

export type TodoBody = {
  title: string;
  completed: boolean;
  order: number;
};

export type UpdateTodoBody = {
  title?: string;
  completed?: boolean;
};
