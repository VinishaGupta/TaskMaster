import React, {
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";

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
    clearError,
  } = useTodos();

  const { search, setSearch, debouncedSearch } = useSearch("");

  const [sortType, setSortType] = useState("newest");
  const [filterType, setFilterType] = useState("all");
  const [snack, setSnack] = useState({ open: false, message: "" });
  const [isDragging, setIsDragging] = useState(false);

  /* ---------------- DELETE UNDO SNACKBAR ---------------- */
  useEffect(() => {
    if (lastDeleted) {
      setSnack({ open: true, message: "Task deleted" });

      const t = setTimeout(
        () => setSnack({ open: false, message: "" }),
        2500
      );

      return () => clearTimeout(t);
    }
  }, [lastDeleted]);

  const handleUndo = () => {
    restoreDeleted();
    setSnack({ open: false, message: "" });
  };

  const stableSetSearch = useCallback((v) => setSearch(v), [setSearch]);

  /* ---------------- FILTER + SEARCH + SORT ---------------- */
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
    <>
      {/* ----------------------- ERROR BOX ----------------------- */}
      {error && (
        <div className="relative py-3 px-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg mt-2">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700 text-lg font-bold"
          >
            ×
          </button>
        </div>
      )}

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">

          {/* HEADER */}
          <header className="flex justify-between items-center mb-2">
            <h1 className="text-4xl font-extrabold">Task Master</h1>
            <ThemeToggle />
          </header>

          {/* SEARCH / FILTER / SORT */}
          <section className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar searchText={search} setSearch={stableSetSearch} />
            </div>

            <FilterTabs
              filterType={filterType}
              setFilterType={setFilterType}
            />

            <SortDropdown
              sortType={sortType}
              setSortType={setSortType}
            />
          </section>

          {/* ADD TASK */}
          <section>
            <AddTask addTask={addTodo} adding={adding} />
          </section>

          {/* ---------------- TASK WINDOW ---------------- */}
          <main>
            <div
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow p-3"
              style={{ height: "62vh" }}
            >
              {/* LOADING SPINNER INSIDE TASK WINDOW */}
              {loading && (
  <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 z-10">
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
)}


              {/* TASK LIST */}
              {!loading && (
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
              )}
            </div>
          </main>
        </div>

        {/* ---------------- UNDO SNACKBAR ---------------- */}
        {snack.open && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-gray-800/95 px-5 py-3 rounded-xl shadow-lg z-50">
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
    </>
  );
}
