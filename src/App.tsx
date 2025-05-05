import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import noDataImage from "@/assets/images/undraw_no-data.svg";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import TodoDetail from "./components/TodoDetail";
import TodoList from "./components/TodoList";
import { Input } from "./components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { TodoService } from "./services/todo.services";
import { Todo, UpdateTodoBody } from "./types/todo.type";

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [ongoingTodos, setOngoingTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [inputTitle, setInputTitle] = useState<string>("");
  const [addingTodos, setAddingTodos] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTodoId, setSelectedTodoId] = useState<string>("");

  const selectedTodo = useMemo(() => todoList.find((todo) => todo._id === selectedTodoId), [todoList, selectedTodoId]);

  const fetchTodos = async () => {
    const response = await TodoService.getTodoList();

    if (!response.success) {
      console.error(response.error);
      toast.error(response.error);
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
    const res = await TodoService.deleteTodo(id);

    if (res.success) {
      fetchTodos();
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
      fetchTodos();
    } else {
      console.error(res.error);
      toast.error(res.error);
    }
  };

  useEffect(() => {
    setLoading(true);

    (async () => {
      await fetchTodos();
    })();

    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-[600px]">
          <DotLottieReact src="assets/loading.lottie" loop autoplay />
        </div>
      </div>
    );

  return (
    <>
      <div className="h-screen">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={60} minSize={20}>
            <div className="grid gap-5 p-5">
              <div className="flex gap-3">
                <Input
                  type="text"
                  value={inputTitle}
                  onChange={(e) => setInputTitle(e.target.value)}
                  placeholder="Add Todo..."
                />
                <button onClick={addTodos}>{addingTodos ? "Adding..." : "Submit"}</button>
              </div>

              {ongoingTodos.length > 0 && (
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
              )}

              {completedTodos.length > 0 && (
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
              )}

              {ongoingTodos.length === 0 && completedTodos.length === 0 && (
                <div className="flex flex-col gap-6 justify-center items-center mt-20 text-gray-600">
                  <img className="max-w-[120px]" src={noDataImage} alt="No Data" />
                  <div className="flex flex-col gap-2 text-center">
                    <span className="text-md font-bold">No Task</span>
                    <span className="text-sm font-light">Add task on the input above</span>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={40} minSize={20}>
            <div className="p-5">
              <TodoDetail key={selectedTodo?._id} todo={selectedTodo} updateTodo={updateTodo} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <Toaster />
    </>
  );
}

export default App;
