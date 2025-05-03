import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { Todo, UpdateTodoBody } from '@/types/todo.type';

type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const request = async <T>(url: string, config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<{ data: T }> = await api.request({ url, ...config });

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    let message = "Network Error";

    if (axios.isAxiosError(error)) {
      if (error.response?.data && typeof error.response.data === "object" && "message" in error.response.data) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
    }

    return { success: false, error: message };
  }
};

export const TodoService = {
  getTodoList: (): Promise<ApiResponse<Todo[]>> =>
    request<Todo[]>("/todos", {
      method: "GET",
    }),

  addTodo: (title: string): Promise<ApiResponse<null>> =>
    request<null>("/todos", {
      method: "POST",
      data: {
        title,
      },
    }),

  updateTodo: (id: string, body: UpdateTodoBody): Promise<ApiResponse<null>> =>
    request<null>(`/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(body),
    }),

  toggleTodo: (id: string, currentStatus: boolean): Promise<ApiResponse<null>> =>
    request<null>(`/todos/${id}`, {
      method: "PATCH",
      data: { completed: !currentStatus },
    }),

  deleteTodo: (id: string): Promise<ApiResponse<null>> =>
    request<null>(`/todos/${id}`, {
      method: "DELETE",
    }),

  reorderTodoList: (updatedOrder: UpdateTodoBody[]): Promise<ApiResponse<null>> =>
    request<null>("/todos/update-order", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ updatedOrder }),
    }),
};
