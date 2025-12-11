import React, { useState, useCallback } from "react";

export default function AddTask({ addTask, adding }) {
  const [text, setText] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!text.trim()) return;
      addTask(text.trim());
      setText("");
    },
    [text, addTask]
  );

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new task"
        className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:outline-none"
      />

      <button
        type="submit"
        disabled={adding}
        className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold 
                   hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center"
      >
        {adding ? (
          <div style={{
            width: 20,
            height: 20,
            border: "3px solid white",
            borderTop: "3px solid transparent",
            borderRadius: "50%",
            animation: "spinAnim 0.7s linear infinite",
          }} />
        ) : (
          "Add"
        )}
      </button>
    </form>
  );
}
