import React, { memo } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

function TodoItem({
  task,
  toggleComplete,
  editTask,
  deleteTask,
  dragHandleProps,
  dragging,
}) {
  return (
    <article
      className={`flex items-center gap-3 px-3 py-2 
      bg-white dark:bg-gray-800 
      border border-gray-200 dark:border-gray-700 
      rounded-xl shadow-sm
      ${dragging ? "shadow-xl scale-[1.01]" : ""}`}
    >
      {/* Drag handle */}
      <span
        {...dragHandleProps}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-500"
        aria-label="Drag task"
      >
        <DragIndicatorIcon fontSize="small" />
      </span>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
        className="w-4 h-4"
        aria-label="Toggle complete"
      />

      {/* Task text */}
      <span
        className={`flex-1 truncate text-[15px] ${
          task.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {task.text}
      </span>

      {/* Edit button */}
      <button
        onClick={() => editTask(task.id)}
        className="text-gray-700 dark:text-gray-200"
        aria-label="Edit task"
      >
        <EditIcon fontSize="small" className="text-gray-700 dark:text-gray-200" />
      </button>

      {/* Delete button — NOW black in light mode & white in dark mode */}
      <button
        onClick={() => deleteTask(task.id)}
        className="text-black dark:text-white"
        aria-label="Delete task"
      >
        <DeleteIcon
          fontSize="small"
          className="text-black dark:text-white"
        />
      </button>
    </article>
  );
}

export default memo(TodoItem);
