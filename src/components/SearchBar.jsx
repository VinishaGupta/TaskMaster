import React from "react";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar({ searchText, setSearch }) {
  return (
    <div className="relative w-full">
      <SearchIcon
        fontSize="small"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
      />

      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 
                   focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {searchText && (
        <button
          onClick={() => setSearch("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ClearIcon fontSize="small" />
        </button>
      )}
    </div>
  );
}
