import { useEffect, useRef } from "react";

export default function ErrorBox({ error, onClose }) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!error) return;

    // auto dismiss after 3s
    timerRef.current = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timerRef.current);
  }, [error, onClose]);

  if (!error) return null;

  return (
    <div className="relative py-3 px-4 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg mt-2">
      <span>{error}</span>

      <button
        type="button"
        onClick={onClose}
        className="
          absolute right-3 top-1/2 -translate-y-1/2
          text-red-500 hover:text-red-700
          text-lg font-bold
        "
        aria-label="Close error"
      >
        ×
      </button>
    </div>
  );
}
