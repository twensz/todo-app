export type Todo = {
  _id: string;
  title: string;
  completed: boolean;
  order: number;
};

export type UpdateTodoBody = {
  _id?: string;
  title?: string;
  completed?: boolean;
};
