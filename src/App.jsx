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
  } = useTodos();

  const { search, setSearch, debouncedSearch } = useSearch("");

  const [sortType, setSortType] = useState("newest");
  const [filterType, setFilterType] = useState("all");

  // 🔥 Snackbar state
  const [snack, setSnack] = useState({ open: false, message: "" });

  // 🔥 Show snackbar when a task is deleted
  useEffect(() => {
    if (lastDeleted) {
      setSnack({ open: true, message: "Task deleted" });

      const t = setTimeout(() => setSnack({ open: false, message: "" }), 3000);
      return () => clearTimeout(t);
    }
  }, [lastDeleted]);

  const handleUndo = () => {
    restoreDeleted();
    setSnack({ open: false, message: "" });
  };

  const stableSetSearch = useCallback((v) => setSearch(v), [setSearch]);

  // 🔥 Filter + Sort + Search combined
  const visibleTasks = useMemo(() => {
    let list = todos || [];

    if (filterType === "active") list = list.filter((t) => !t.completed);
    else if (filterType === "completed") list = list.filter((t) => t.completed);

    const q = (debouncedSearch || "").trim().toLowerCase();
    if (q) list = list.filter((t) => t.text.toLowerCase().includes(q));

    list = [...list].sort((a, b) =>
      sortType === "newest" ? b.id - a.id : a.id - b.id
    );

    return list;
  }, [todos, filterType, debouncedSearch, sortType]);

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold">Task Master</h1>
          <ThemeToggle />
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchBar searchText={search} setSearch={stableSetSearch} />
          </div>
          <FilterTabs filterType={filterType} setFilterType={setFilterType} />
          <SortDropdown sortType={sortType} setSortType={setSortType} />
        </div>

        {/* ADD TASK */}
        <AddTask addTask={addTodo} adding={adding} />

        {/* LOADING */}
        {loading && <LoadingSpinner size={42} />}

        {/* ERROR */}
        {error && (
          <div className="py-3 px-4 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        {/* MAIN SCROLLING CONTAINER */}
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 overflow-y-auto"
          style={{ maxHeight: "60vh" }}
        >
          <TodoList
            visibleTasks={visibleTasks}
            deleteTask={deleteTodo}
            editTask={editTodo}
            toggleComplete={toggleTodo}
          />
        </div>
      </div>

      {/* 🔥 FIXED SNACKBAR (FINAL, NO MOVEMENT) */}
      {snack.open && (
        <div
          className="
            fixed
            bottom-6
            left-1/2
            -translate-x-1/2
            bg-white/95
            dark:bg-gray-800/95
            px-5 py-3
            rounded-xl
            shadow-lg
            animate-snackbar-slide
            z-50
          "
          style={{
            position: "fixed",
            bottom: "24px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
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
