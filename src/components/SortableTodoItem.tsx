import { Check, Grip, Trash } from 'lucide-react';
import { HTMLAttributes } from 'react';

import { UpdateTodoBody } from '@/types/todo.type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Input } from './ui/input';

type Todo = {
  _id: string;
  title: string;
  completed: boolean;
};

type Props = {
  todo: Todo;
  updateTodo: (id: string, body: UpdateTodoBody) => void;
  toggleTodo: (id: string, status: boolean) => void;
  deleteTodo: (id: string) => void;
  selected: boolean;
} & HTMLAttributes<HTMLDivElement>;

const SortableTodoItem = ({ todo, updateTodo, toggleTodo, deleteTodo, selected, ...rest }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: todo._id });

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
          selected && "bg-gray-100 hover:bg-gray-100"
        }`}>
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

        <Input
          defaultValue={todo.title}
          className={`${todo.completed ? "text-gray-600" : ""} border-none focus-visible:ring-0 shadow-none`}
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
