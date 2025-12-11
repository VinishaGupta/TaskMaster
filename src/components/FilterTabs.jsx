import React from "react";

export default function FilterTabs({ filterType, setFilterType }) {
  const tabs = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((tab) => {
        const active = filterType === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${active ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
