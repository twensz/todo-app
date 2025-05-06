import { Grip, Trash } from "lucide-react";
import { HTMLAttributes, useMemo } from "react";

import { useTodoContext } from "@/context/TodoContext";
import { Todo } from "@/types/todo.type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import TodoToggle from "./TodoToggle";
import { Input } from "./ui/input";

type Props = {
  todo: Todo;
} & HTMLAttributes<HTMLDivElement>;

const SortableTodoItem = ({ todo, ...rest }: Props) => {
  const { updateTodo, deleteTodo, selectedTodo } = useTodoContext();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo._id });

  const isSelected = useMemo(() => todo._id === selectedTodo?._id, [todo._id, selectedTodo?._id]);

  const handleOnBlur = (value: string) => {
    if (value === todo.title) return;

    updateTodo(todo._id, {
      title: value,
    });
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      {...rest}
      {...attributes}
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[auto_1fr] items-center gap-3">
      <div
        {...listeners}
        className="cursor-grab text-gray-500 opacity-30 hover:opacity-100 duration-200 flex justify-center">
        <Grip size={13} />
      </div>

      <div
        className={`grid grid-cols-[auto_1fr_auto] items-center gap-1 border-b-1 border-gray-200 px-4 py-1 not-last:transition-transform duration-200 hover:bg-gray-50 ${
          isSelected && "bg-gray-100 hover:bg-gray-100"
        }`}>
        <TodoToggle key={todo._id} todo={todo} />

        <Input
          defaultValue={todo.title}
          className={`${todo.completed ? "text-gray-600" : ""} border-none focus-visible:ring-0 shadow-none`}
          placeholder="No Title"
          onBlur={(e) => handleOnBlur(e.target.value)}
        />
        <button
          className="cursor-pointer text-red-800"
          onClick={(e) => {
            e.stopPropagation();
            deleteTodo(todo._id);
          }}>
          <Trash size={15} />
        </button>
      </div>
    </div>
  );
};

export default SortableTodoItem;
