import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

export default function SortDropdown({ sortType, setSortType }) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
  ];

  return (
    <nav className="relative select-none" aria-label="Sort Tasks">
      {/* BUTTON */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center justify-between gap-2
                   px-4 py-2 w-32
                   bg-white dark:bg-gray-800
                   text-gray-800 dark:text-gray-200
                   rounded-xl border border-gray-300 dark:border-gray-700
                   shadow-sm"
      >
        Sort
        <IoChevronDown className="text-gray-500 text-lg" />
      </button>

      {/* DROPDOWN MENU */}
      {open && (
        <div
          role="menu"
          className="absolute left-0 mt-2 w-44
                     bg-white dark:bg-gray-800
                     border border-gray-300 dark:border-gray-700
                     rounded-xl shadow-lg z-50 overflow-hidden"
        >
          {options.map((o) => (
            <button
              role="menuitem"
              key={o.value}
              onClick={() => {
                setSortType(o.value);
                setOpen(false);
              }}
              className={`text-left w-full px-4 py-2 cursor-pointer
                          hover:bg-blue-600 hover:text-white
                          ${
                            sortType === o.value
                              ? "bg-blue-50 dark:bg-gray-700"
                              : ""
                          }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
