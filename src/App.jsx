import React, { useMemo, useState, useCallback, useEffect } from "react";
import useTodos from "./hooks/useTodos";
import { useSearch } from "./hooks/useSearch";

import SearchBar from "./components/SearchBar";
import AddTask from "./components/AddTask";
import TodoList from "./components/TodoList";
import SortDropdown from "./components/SortDropdown";
import FilterTabs from "./components/FilterTabs";
import ThemeToggle from "./components/ThemeToggle";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const {
    todos,
    loading,
    error,
    adding,
    lastDeleted,
    addTodo,
    deleteTodo,
    restoreDeleted,
    editTodo,
    toggleTodo,
    reorderTodos,
  } = useTodos();

  const { search, setSearch, debouncedSearch } = useSearch("");

  const [sortType, setSortType] = useState("newest");
  const [filterType, setFilterType] = useState("all");
  const [snack, setSnack] = useState({ open: false, message: "" });
  const [isDragging, setIsDragging] = useState(false);

  // prevent page from scrolling (important)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (lastDeleted) {
      setSnack({ open: true, message: "Task deleted" });
      const t = setTimeout(() => setSnack({ open: false, message: "" }), 2500);
      return () => clearTimeout(t);
    }
  }, [lastDeleted]);

  const handleUndo = () => {
    restoreDeleted();
    setSnack({ open: false, message: "" });
  };

  const stableSetSearch = useCallback((v) => setSearch(v), [setSearch]);

  const visibleTasks = useMemo(() => {
    let list = todos || [];

    if (filterType === "active") list = list.filter((t) => !t.completed);
    else if (filterType === "completed") list = list.filter((t) => t.completed);

    const q = debouncedSearch.trim().toLowerCase();
    if (q) list = list.filter((t) => t.text.toLowerCase().includes(q));

    if (sortType !== "custom") {
      list = [...list].sort((a, b) =>
        sortType === "newest" ? b.id - a.id : a.id - b.id
      );
    }

    return list;
  }, [todos, filterType, debouncedSearch, sortType, isDragging]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">

      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">

        <div className="flex justify-between items-center mb-2">
          <h1 className="text-4xl font-extrabold">Task Master</h1>
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar searchText={search} setSearch={stableSetSearch} />
          </div>
          <FilterTabs filterType={filterType} setFilterType={setFilterType} />
          <SortDropdown sortType={sortType} setSortType={setSortType} />
        </div>

        <AddTask addTask={addTodo} adding={adding} />

        {loading && <LoadingSpinner size={42} />}

        {error && (
          <div className="py-3 px-4 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {/* TASK WINDOW ONLY IS SCROLLABLE */}
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow p-3"
          style={{
            height: "62vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <TodoList
            visibleTasks={visibleTasks}
            deleteTask={deleteTodo}
            editTask={editTodo}
            toggleComplete={toggleTodo}
            reorderTodos={reorderTodos}
            onDragStart={() => {
              setSortType("custom");
              setIsDragging(true);
            }}
            onDragEnd={() => setIsDragging(false)}
          />
        </div>
      </div>

      {snack.open && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2
            bg-white/95 dark:bg-gray-800/95
            px-5 py-3 rounded-xl shadow-lg animate-snackbar-slide z-50"
        >
          <div className="flex items-center gap-6">
            <span className="font-medium">{snack.message}</span>
            <button
              onClick={handleUndo}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              UNDO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
