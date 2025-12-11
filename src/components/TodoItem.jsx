import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export default function TodoItem({
  task,
  toggleComplete,
  editTask,
  deleteTask,
  dragHandleProps,
  dragging
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.text);

  const saveEdit = () => {
    if (value.trim()) editTask(task.id, value.trim());
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-center gap-4 px-4 py-3 
        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
        rounded-lg shadow-sm transition-all duration-150
        ${dragging ? "shadow-2xl" : ""}
      `}
    >
      <div
        {...dragHandleProps}
        className="cursor-grab p-1 text-gray-500 hover:text-gray-700"
      >
        <DragIndicatorIcon fontSize="small" />
      </div>

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
        className="w-5 h-5"
      />

      <span
        className={`flex-1 truncate ${
          task.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {task.text}
      </span>

      <button onClick={() => setIsEditing(true)}>
        <EditIcon fontSize="small" />
      </button>

      <button onClick={() => deleteTask(task.id)}>
        <DeleteIcon fontSize="small" className="text-red-600" />
      </button>
    </div>
  );
}
