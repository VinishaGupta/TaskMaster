import React from "react";

export default function LoadingSpinner({ size = 36 }) {
  return (
    <div
      className="flex justify-center py-4"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div
        style={{
          width: size,
          height: size,
          border: "3px solid #cbd5e1",
          borderTop: "3px solid #1d4ed8",
          borderRadius: "50%",
          animation: "spinAnim 0.7s linear infinite",
        }}
      />
    </div>
  );
}
