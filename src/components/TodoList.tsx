import React from 'react';

import { Todo, UpdateTodoBody } from '@/types/todo.type';
import {
    closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors
} from '@dnd-kit/core';
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy
} from '@dnd-kit/sortable';

import SortableTodoItem from './SortableTodoItem';

type TodoProps = {
  todos: Todo[];
  toggleTodo: (id: string, currentStatus: boolean) => void;
  updateTodo: (id: string, body: UpdateTodoBody) => void;
  deleteTodo: (id: string) => void;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  updateOrderTodos: (todos: Todo[]) => void;
  selectedTodoId: string;
  setSelectedTodoId: React.Dispatch<React.SetStateAction<string>>;
  listId: string;
};

const TodoList: React.FC<TodoProps> = ({
  todos,
  toggleTodo,
  updateTodo,
  deleteTodo,
  updateOrderTodos,
  setTodos,
  selectedTodoId,
  setSelectedTodoId,
  listId,
}) => {
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
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                updateTodo={updateTodo}
                selected={selectedTodoId === todo._id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTodoId(todo._id);
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
