import React from "react";
import { createPortal } from "react-dom";

export default function Snackbar({ message, onUndo }) {
  return createPortal(
    <div
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        bg-white/95 dark:bg-gray-800/95 
        text-gray-900 dark:text-gray-100 
        px-5 py-3 rounded-xl shadow-lg
        animate-snackbar-slide flex items-center gap-6
        z-50
      "
    >
      <span className="font-medium">{message}</span>

      <button
        onClick={onUndo}
        className="text-blue-500 hover:text-blue-400 font-semibold"
      >
        UNDO
      </button>
    </div>,
    document.getElementById("snackbar-root")
  );
}
