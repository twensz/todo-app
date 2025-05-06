import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { TodoService } from "@/services/todo.services";
import { Todo, UpdateTodoBody } from "@/types/todo.type";

type TodoContextType = {
  todoList: Todo[];
  ongoingTodos: Todo[];
  completedTodos: Todo[];
  inputTitle: string;
  loading: boolean;
  addingTodos: boolean;
  setOngoingTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setCompletedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  selectTodo: (id: string) => void;
  selectedTodo: Todo | undefined;
  setInputTitle: (val: string) => void;
  fetchTodos: () => Promise<void>;
  addTodos: () => Promise<void>;
  updateTodo: (id: string, body: UpdateTodoBody) => Promise<void>;
  toggleTodo: (id: string, currentStatus: boolean) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  updateOrderTodos: (updatedTodoList: Todo[]) => Promise<void>;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [ongoingTodos, setOngoingTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [inputTitle, setInputTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingTodos, setAddingTodos] = useState(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string | undefined>(undefined);

  const selectedTodo = useMemo(() => todoList.find((todo) => todo._id === selectedTodoId), [todoList, selectedTodoId]);

  const selectTodo = (id: string) => setSelectedTodoId(id);

  const fetchTodos = async () => {
    const response = await TodoService.getTodoList();

    if (!response.success) {
      console.error(response.error);
      toast.error(response.error);
      setLoading(false);
      return;
    }

    const todoList: Todo[] = response.data;
    const sorted = todoList.sort((a, b) => a.order - b.order);

    setTodoList(sorted);
    setOngoingTodos(sorted.filter((todo) => !todo.completed));
    setCompletedTodos(sorted.filter((todo) => todo.completed));
  };

  const addTodos = async () => {
    if (!inputTitle) return;
    setAddingTodos(true);

    const res = await TodoService.addTodo(inputTitle);

    if (res.success) {
      await fetchTodos();
      setInputTitle("");
    } else {
      console.error(res.error);
      toast.error(res.error);
    }

    setAddingTodos(false);
  };

  const updateTodo = async (id: string, body: UpdateTodoBody) => {
    const res = await TodoService.updateTodo(id, body);
    if (res.success) {
      await fetchTodos();
    } else {
      console.error(res.error);
      toast.error(res.error);
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    const res = await TodoService.toggleTodo(id, currentStatus);
    if (res.success) {
      await fetchTodos();
    } else {
      console.error(res.error);
      toast.error(res.error);
    }
  };

  const deleteTodo = async (id: string) => {
    const res = await TodoService.deleteTodo(id);
    if (res.success) {
      await fetchTodos();
    } else {
      console.error(res.error);
      toast.error(res.error);
    }
  };

  const updateOrderTodos = async (updatedTodoList: Todo[]) => {
    const updatedOrder = updatedTodoList.map((todo, index) => ({
      _id: todo._id,
      order: index + 1,
    }));

    const res = await TodoService.reorderTodoList(updatedOrder);

    if (res.success) {
      await fetchTodos();
    } else {
      console.error(res.error);
      toast.error(res.error);
    }
  };

  useEffect(() => {
    setLoading(true);
    (async () => await fetchTodos())();
    setLoading(false);
  }, []);

  return (
    <TodoContext.Provider
      value={{
        todoList,
        ongoingTodos,
        completedTodos,
        inputTitle,
        loading,
        addingTodos,
        setOngoingTodos,
        setCompletedTodos,
        setInputTitle,
        fetchTodos,
        addTodos,
        updateTodo,
        toggleTodo,
        deleteTodo,
        updateOrderTodos,
        selectTodo,
        selectedTodo,
      }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error("useTodoContext must be used inside TodoProvider");
  return ctx;
};
