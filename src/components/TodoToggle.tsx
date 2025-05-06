import { Check } from "lucide-react";

import { useTodoContext } from "@/context/TodoContext";
import { Todo } from "@/types/todo.type";

type ToggleTodoProps = {
  todo: Todo;
};

const TodoToggle: React.FC<ToggleTodoProps> = ({ todo }) => {
  const { toggleTodo } = useTodoContext();

  return (
    <div
      className={`${
        todo.completed ? "bg-gray-200 border-gray-300" : "bg-white border-gray-500"
      } border rounded-sm group p-[1px] relative min-w-4 min-h-4 flex items-center justify-center`}>
      <input
        type="checkbox"
        className="absolute opacity-0 cursor-pointer z-10 w-full h-full"
        onChange={() => toggleTodo(todo._id, todo.completed)}
      />
      <Check
        size={14}
        className={`${todo.completed ? "opacity-100" : "opacity-0 group-hover:opacity-40"} duration-150`}
      />
    </div>
  );
};

export default TodoToggle;
