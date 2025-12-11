import { useEffect, useState } from "react";
import SunIcon from "../assets/icons/sun.png";
import MoonIcon from "../assets/icons/moon.png";

function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative w-16 h-9 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center p-1 transition"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute bg-white w-7 h-7 rounded-full shadow transform transition
          ${isDark ? "translate-x-7" : "translate-x-0"}`}
      />

      <img
        src={SunIcon}
        alt="sun"
        className={`w-5 h-5 absolute left-2 transition-opacity pointer-events-none ${isDark ? "opacity-0" : "opacity-100"}`}
      />

      <img
        src={MoonIcon}
        alt="moon"
        className={`w-5 h-5 absolute right-2 transition-opacity pointer-events-none ${isDark ? "opacity-100" : "opacity-0"}`}
      />
    </button>
  );
}

export default ThemeToggle;
