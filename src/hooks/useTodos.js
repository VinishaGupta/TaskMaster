import { useContext } from "react";
import { TodosContext } from "../context/TodosContext";

export default function useTodos() {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error("useTodos must be used inside TodosProvider");
  }

  const {
    todos,
    loading,
    error,
    adding,
    lastDeleted,

    addTodo,
    deleteTodo,
    restoreDeleted,
    toggleTodo,
    editTodo,
    reorderTodos,
    clearError,
  } = context;

  return {
    todos,
    loading,
    error,
    adding,
    lastDeleted,

    addTodo,
    deleteTodo,
    restoreDeleted,
    toggleTodo,
    editTodo,
    reorderTodos,
    clearError,
  };
}
