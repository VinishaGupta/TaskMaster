import { useContext } from "react";
import { TodosContext } from "../context/TodosContext";

export default function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error("useTodos must be used inside TodosProvider");

  return {
    todos: ctx.todos,
    loading: ctx.loading,
    error: ctx.error,
    adding: ctx.adding,
    lastDeleted: ctx.lastDeleted,
    addTodo: ctx.addTodo,
    deleteTodo: ctx.deleteTodo,
    restoreDeleted: ctx.restoreDeleted,
    toggleTodo: ctx.toggleTodo,
    editTodo: ctx.editTodo,
    reorderTodos: ctx.reorderTodos, // <- new
  };
}
