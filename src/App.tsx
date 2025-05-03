import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import TodoList from './components/TodoList';
import { Input } from './components/ui/input';
import { TodoService } from './services/todo.services';
import { Todo, UpdateTodoBody } from './types/todo.type';

function App() {
  const [ongoingTodos, setOngoingTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [inputTitle, setInputTitle] = useState<string>("");
  const [addingTodos, setAddingTodos] = useState<boolean>(false);
  const [selectedTodoId, setSelectedTodoId] = useState<string>("");

  const fetchTodos = async () => {
    const response = await TodoService.getTodoList();

    if (!response.success) {
      console.error(response.error);
      toast.error(response.error);
      return;
    }

    const todoList: Todo[] = response.data;
    const sorted = todoList.sort((a, b) => a.order - b.order);

    setOngoingTodos(sorted.filter((todo) => !todo.completed));
    setCompletedTodos(sorted.filter((todo) => todo.completed));
  };

  const addTodos = async () => {
    setAddingTodos(true);

    const res = await TodoService.addTodo(inputTitle);

    if (res.success) {
      fetchTodos();
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
      fetchTodos();
    } else {
      console.error(res.error);
      toast.error(res.error);
    }
  };

  const toggleTodo = async (id: string, currentStatus: boolean) => {
    const res = await TodoService.toggleTodo(id, currentStatus);

    if (res.success) {
      fetchTodos();
    } else {
      console.error(res.error);
      toast.error(res.error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("❗ Server returned error:", response.status);
        return;
      }

      fetchTodos();
    } catch (error) {
      console.error("🔌 Network error:", error);
    }
  };

  const updateOrderTodos = async (updatedTodoList: Todo[]) => {
    try {
      const updatedOrder = updatedTodoList.map((todo, index) => ({
        _id: todo._id, // Keep the _id
        order: index + 1, // Assign order based on the new position
      }));

      const response = await fetch(`/api/todos/update-order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updatedOrder,
        }),
      });

      if (!response.ok) {
        console.error("❗ Server returned error:", response.status);
        return;
      }

      fetchTodos();
    } catch (error) {
      console.error("🔌 Network error:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <div className="p-10">
        <div className="grid gap-5">
          <div className="flex flex-col gap-2">
            <h1 className="text-md font-bold">Ongoing Task</h1>
            <TodoList
              listId="ongoing"
              todos={ongoingTodos}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              updateOrderTodos={updateOrderTodos}
              updateTodo={updateTodo}
              selectedTodoId={selectedTodoId}
              setSelectedTodoId={setSelectedTodoId}
              setTodos={setOngoingTodos}
            />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-md font-bold">Completed Task</h1>
            <TodoList
              listId="completed"
              todos={completedTodos}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              updateOrderTodos={updateOrderTodos}
              updateTodo={updateTodo}
              selectedTodoId={selectedTodoId}
              setSelectedTodoId={setSelectedTodoId}
              setTodos={setCompletedTodos}
            />
          </div>

          <div className="flex gap-3">
            <Input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              placeholder="Add Todo..."
            />
            <button onClick={addTodos}>{addingTodos ? "Adding..." : "Submit"}</button>
          </div>
        </div>
      </div>

      <Toaster />
    </>
  );
}

export default App;
