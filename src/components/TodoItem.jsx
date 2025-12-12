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
    <div
      className={`flex items-center gap-3 px-3 py-2 
      bg-white dark:bg-gray-800 
      border border-gray-200 dark:border-gray-700 
      rounded-xl shadow-sm
      ${dragging ? "shadow-xl scale-[1.01]" : ""}`}
    >
      <div
        {...dragHandleProps}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-500"
      >
        <DragIndicatorIcon fontSize="small" />
      </div>

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleComplete(task.id)}
        className="w-4 h-4"
      />

      <span
        className={`flex-1 truncate text-[15px] ${
          task.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {task.text}
      </span>

      <button
        onClick={() => editTask(task.id)}
        className="text-gray-700 dark:text-gray-200"
      >
        <EditIcon fontSize="small" />
      </button>

      <button
        onClick={() => deleteTask(task.id)}
        className="text-black dark:text-white"
      >
        <DeleteIcon fontSize="small" />
      </button>
    </div>
  );
}

export default memo(TodoItem);
