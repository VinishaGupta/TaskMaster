import React, { useEffect } from "react";

export default function Toast({ message, type = "error", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="
        fixed top-4 right-4 
        px-4 py-3 rounded-lg shadow-lg z-50
        text-white 
        animate-slide-in
      "
      style={{
        backgroundColor: type === "error" ? "#DC2626" : "#2563EB",
      }}
    >
      {message}
    </div>
  );
}
