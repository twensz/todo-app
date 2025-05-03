import { TodoBody, UpdateTodoBody } from '@/types/Todo.type';

type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

export const TodoService = {
  addTodo: async (title: string): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
        }),
      });

      if (!res.ok) {
        return { success: false, error: `Server error: ${res.status}` };
      }

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return { success: false, error: error.message || "Network error" };
    }
  },

  updateTodo: async (id: string, body: UpdateTodoBody): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        return { success: false, error: `Server error: ${res.status}` };
      }

      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return { success: false, error: error.message || "Network error" };
    }
  },

  toggleTodo: async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: id,
          completed: !currentStatus,
        }),
      });

      if (!res.ok) {
        console.error("❗ Server returned error:", res.status);
        return;
      }
    } catch (error) {
      console.error("🔌 Network error:", error);
      return null;
    }
  },

  deleteTodo: async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("❗ Server returned error:", res.status);
        return;
      }
    } catch (error) {
      console.error("🔌 Network error:", error);
      return null;
    }
  },
};
