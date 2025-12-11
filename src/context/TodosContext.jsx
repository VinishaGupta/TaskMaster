import React, { createContext, useReducer, useEffect, useCallback } from "react";
import { taskReducer, initialState } from "../reducers/taskReducer";
import * as api from "../services/mockApi";

export const TodosContext = createContext();

export function TodosProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    let mounted = true;
    dispatch({ type: "FETCH_START" });

    api.fetchTodos()
      .then((data) => mounted && dispatch({ type: "FETCH_SUCCESS", payload: data }))
      .catch((err) => mounted && dispatch({ type: "FETCH_ERROR", payload: err.message }));

    return () => (mounted = false);
  }, []);

  const addTodo = useCallback(async (text) => {
    dispatch({ type: "ADD_START" });
    try {
      const newTodo = await api.addTodo({ text });
      dispatch({ type: "ADD_TODO", payload: newTodo });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message || String(err) });
    } finally {
      dispatch({ type: "ADD_END" });
    }
  }, []);

  const deleteTodo = useCallback(
    async (id) => {
      const deleted = state.todos.find((t) => t.id === id);
      // optimistic remove
      dispatch({ type: "DELETE_TODO", payload: { id, deleted } });

      try {
        await api.deleteTodo(id);
      } catch (err) {
        // revert and show error
        dispatch({ type: "RESTORE_DELETED" });
        dispatch({ type: "FETCH_ERROR", payload: err.message || String(err) });
      }
    },
    [state.todos]
  );

  const restoreDeleted = useCallback(() => {
    dispatch({ type: "RESTORE_DELETED" });
  }, []);

  const toggleTodo = useCallback((id) => {
    // optimistic toggle
    dispatch({ type: "TOGGLE_INSTANT", payload: id });
    api.toggleTodo(id).catch((err) => {
      // revert on failure by toggling back
      dispatch({ type: "TOGGLE_INSTANT", payload: id });
      dispatch({ type: "FETCH_ERROR", payload: err.message || String(err) });
    });
  }, []);

  const editTodo = useCallback(async (id, text) => {
    try {
      const updated = await api.editTodo(id, text);
      dispatch({ type: "EDIT_TODO", payload: updated });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: err.message || String(err) });
    }
  }, []);

  // NEW: reorder (drag & drop)
  const reorderTodos = useCallback((fromIndex, toIndex) => {
    // update UI immediately
    dispatch({ type: "REORDER_TODOS", payload: { from: fromIndex, to: toIndex } });

    // persist order to localStorage (mock persistence)
    try {
      const current = JSON.parse(localStorage.getItem("tm_tasks_v1") || "[]");
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      localStorage.setItem("tm_tasks_v1", JSON.stringify(next));
    } catch (e) {
      // ignore persistence errors
    }
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
        reorderTodos, // <- exposed
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}
