"use client";

import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "theme";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Initialize from localStorage or system preference
    const stored = typeof window !== "undefined" ? localStorage.getItem(THEME_STORAGE_KEY) : null;
    if (stored === "dark" || stored === "light") {
      setIsDark(stored === "dark");
      document.documentElement.classList.toggle("dark", stored === "dark");
      return;
    }

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(prefersDark);
    document.documentElement.classList.toggle("dark", prefersDark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
  document.documentElement.classList.toggle("dark", next);
  document.documentElement.classList.toggle("light", !next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-full border rounded px-3 py-2 text-sm transition-colors flex items-center gap-2"
      style={{ borderColor: "var(--border)", background: "transparent" }}
      aria-label="Toggle dark mode"
    >
      <span aria-hidden="true" style={{ display: "inline-flex", width: 18, height: 18 }}>
        {isDark ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.8 1.8-1.8zM1 13h3v-2H1v2zm10-9h-2v3h2V4zm7.03 1.05l-1.8-1.79-1.79 1.79 1.79 1.8 1.8-1.8zM17 11v2h3v-2h-3zm-5 7h2v-3h-2v3zm4.24 1.16l1.79 1.8 1.8-1.8-1.8-1.79-1.79 1.79zM4.22 18.36l1.79 1.8 1.8-1.8-1.8-1.79-1.79 1.79z"/></svg>
        )}
      </span>
      <span>{isDark ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}


