import React from "react";

import { useTodoContext } from "@/context/TodoContext";
import { Todo } from "@/types/todo.type";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import SortableTodoItem from "./SortableTodoItem";

type TodoProps = {
  todos: Todo[];
  listId: string;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoList: React.FC<TodoProps> = ({ todos, setTodos, listId }) => {
  const { updateOrderTodos, selectTodo } = useTodoContext();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((todo) => todo._id === active.id);
    const newIndex = todos.findIndex((todo) => todo._id === over.id);

    const newTodos = arrayMove(todos, oldIndex, newIndex);
    setTodos(newTodos);
    updateOrderTodos(newTodos);
  };

  return (
    <>
      <DndContext id={listId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={todos.map((todo) => todo._id)} strategy={verticalListSortingStrategy}>
          <div className="grid">
            {todos.map((todo) => (
              <SortableTodoItem
                key={todo._id}
                todo={todo}
                onClick={(e) => {
                  e.stopPropagation();
                  selectTodo(todo._id);
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default TodoList;
