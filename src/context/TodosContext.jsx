import React, { createContext, useReducer, useEffect, useCallback } from "react";
import { taskReducer, initialState } from "../reducers/taskReducer";
import * as api from "../services/mockApi";

export const TodosContext = createContext();

export function TodosProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

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
        const list = Array.isArray(res) ? res : res.data; // ← FIXED
        dispatch({ type: "FETCH_SUCCESS", payload: list });
      })
      .catch((err) => {
        mounted &&
          dispatch({
            type: "FETCH_ERROR",
            payload: err.message || "Failed to fetch",
          });
      });

    return () => (mounted = false);
  }, []);

  /* -----------------------------
     ADD TASK
  ------------------------------*/
  const addTodo = useCallback(async (text) => {
    dispatch({ type: "ADD_START" });
    try {
      const res = await api.addTodo({ text });
      const newTodo = res.data || res; // ← FIXED
      dispatch({ type: "ADD_TODO", payload: newTodo });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message || String(err) });
    } finally {
      dispatch({ type: "ADD_END" });
    }
  }, []);

  /* -----------------------------
     DELETE TASK
  ------------------------------*/
  const deleteTodo = useCallback(
    async (id) => {
      const deleted = state.todos.find((t) => t.id === id);

      // optimistic UI
      dispatch({ type: "DELETE_TODO", payload: { id, deleted } });

      try {
        await api.deleteTodo(id);
      } catch (err) {
        // revert deletion
        dispatch({ type: "RESTORE_DELETED" });
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      }
    },
    [state.todos]
  );

  const restoreDeleted = useCallback(() => {
    dispatch({ type: "RESTORE_DELETED" });
  }, []);

  /* -----------------------------
     TOGGLE COMPLETE
  ------------------------------*/
  const toggleTodo = useCallback((id) => {
    dispatch({ type: "TOGGLE_INSTANT", payload: id });

    api.toggleTodo(id).catch((err) => {
      // revert
      dispatch({ type: "TOGGLE_INSTANT", payload: id });
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    });
  }, []);

  /* -----------------------------
     EDIT TASK
  ------------------------------*/
  const editTodo = useCallback(async (id, text) => {
    try {
      const res = await api.editTodo(id, text);
      const updated = res.data || res;
      dispatch({ type: "EDIT_TODO", payload: updated });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message });
    }
  }, []);

  /* -----------------------------
     DRAG & DROP REORDER
  ------------------------------*/
  const reorderTodos = useCallback((fromIndex, toIndex) => {
    dispatch({ type: "REORDER_TODOS", payload: { from: fromIndex, to: toIndex } });

    // persist order
    try {
      const current = JSON.parse(localStorage.getItem("tm_tasks_v1") || "[]");
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      localStorage.setItem("tm_tasks_v1", JSON.stringify(next));
    } catch {}
  }, []);

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
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}
