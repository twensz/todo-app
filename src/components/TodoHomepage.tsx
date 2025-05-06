import noDataImage from "@/assets/images/undraw_no-data.svg";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import TodoDetail from "../components/TodoDetail";
import { useTodoContext } from "../context/TodoContext";
import TodoList from "./TodoList";
import { Input } from "./ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";

function TodoHomepage() {
  const {
    ongoingTodos,
    setOngoingTodos,
    completedTodos,
    setCompletedTodos,
    selectedTodo,
    loading,
    addingTodos,
    inputTitle,
    setInputTitle,
    addTodos,
  } = useTodoContext();

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
                  <TodoList listId="ongoing" todos={ongoingTodos} setTodos={setOngoingTodos} />
                </div>
              )}

              {completedTodos.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h1 className="text-md font-bold">Completed Task</h1>
                  <TodoList listId="completed" todos={completedTodos} setTodos={setCompletedTodos} />
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
              <TodoDetail key={selectedTodo?._id} todo={selectedTodo} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}

export default TodoHomepage;
