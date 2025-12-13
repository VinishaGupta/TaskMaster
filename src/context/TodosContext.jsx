import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { taskReducer, initialState } from "../reducers/taskReducer";
import * as api from "../services/mockApi";

export const TodosContext = createContext();

export function TodosProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  /* -----------------------------
     ERROR HANDLERS (SIMPLE & SAFE)
  ------------------------------*/
  const fireError = useCallback((msg) => {
    dispatch({ type: "FETCH_ERROR", payload: msg });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  /* -----------------------------
     FETCH ALL TASKS
  ------------------------------*/
  useEffect(() => {
    let mounted = true;
    dispatch({ type: "FETCH_START" });

    api
      .fetchTodos()
      .then((res) => {
        if (!mounted) return;
        const list = Array.isArray(res) ? res : res.data;
        dispatch({ type: "FETCH_SUCCESS", payload: list });
      })
      .catch(() => {
        if (mounted) fireError("Failed to load tasks");
      });

    return () => {
      mounted = false;
    };
  }, [fireError]);

  /* -----------------------------
     ADD TASK
  ------------------------------*/
  const addTodo = useCallback(
    async (text) => {
      dispatch({ type: "ADD_START" });

      try {
        const res = await api.addTodo({ text });
        const newTodo = res?.data || res;
        dispatch({ type: "ADD_TODO", payload: newTodo });
      } catch {
        fireError("Failed to add task");
      } finally {
        dispatch({ type: "ADD_END" });
      }
    },
    [fireError]
  );

  /* -----------------------------
     DELETE TASK
  ------------------------------*/
  const deleteTodo = useCallback(
    async (id) => {
      const deleted = state.todos.find((t) => t.id === id);

      dispatch({ type: "DELETE_TODO", payload: { id, deleted } });

      try {
        await api.deleteTodo(id);
      } catch {
        dispatch({ type: "RESTORE_DELETED" });
        fireError("Failed to delete task");
      }
    },
    [state.todos, fireError]
  );

  const restoreDeleted = useCallback(() => {
    dispatch({ type: "RESTORE_DELETED" });
  }, []);

  /* -----------------------------
     TOGGLE COMPLETE
  ------------------------------*/
  const toggleTodo = useCallback(
    (id) => {
      dispatch({ type: "TOGGLE_INSTANT", payload: id });

      api.toggleTodo(id).catch(() => {
        dispatch({ type: "TOGGLE_INSTANT", payload: id }); // revert
        fireError("Failed to update task status");
      });
    },
    [fireError]
  );

  /* -----------------------------
     EDIT TASK
  ------------------------------*/
  const editTodo = useCallback(
    async (id, text) => {
      try {
        const res = await api.editTodo(id, text);
        const updated = res?.data || res;
        dispatch({ type: "EDIT_TODO", payload: updated });
      } catch {
        fireError("Failed to edit task");
      }
    },
    [fireError]
  );

  /* -----------------------------
     REORDER TASKS
  ------------------------------*/
  const reorderTodos = useCallback(
    (fromIndex, toIndex) => {
      dispatch({
        type: "REORDER_TODOS",
        payload: { from: fromIndex, to: toIndex },
      });

      try {
        const current = JSON.parse(
          localStorage.getItem("tm_tasks_v1") || "[]"
        );
        const next = [...current];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        localStorage.setItem("tm_tasks_v1", JSON.stringify(next));
      } catch {
        fireError("Failed to reorder tasks");
      }
    },
    [fireError]
  );

  /* -----------------------------
     PROVIDER
  ------------------------------*/
  return (
    <TodosContext.Provider
      value={{
        todos: state.todos,
        loading: state.loading,
        error: state.error,
        adding: state.adding,
        lastDeleted: state.lastDeleted,

        addTodo,
        deleteTodo,
        restoreDeleted,
        toggleTodo,
        editTodo,
        reorderTodos,
        clearError,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}
