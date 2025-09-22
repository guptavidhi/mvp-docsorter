"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="min-h-dvh flex" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Overlay for small screens */}
      {open && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-30"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      {/* Sidebar in normal flow so content shifts, not overlaps */}
      <div style={{ width: open ? 256 : 0, transition: "width 280ms cubic-bezier(0.22, 1, 0.36, 1)" }} />
      <div className="fixed inset-y-0 left-0 z-40" style={{ transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)" }}>
        <div className="h-full" style={{ boxShadow: open ? "0 10px 30px rgba(0,0,0,0.15)" : "none" }}>
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 w-full">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3" style={{ background: "color-mix(in oklab, var(--surface), transparent 20%)", borderColor: "var(--border)" }}>
          <button
            aria-label={open ? "Close sidebar" : "Open sidebar"}
            onClick={() => setOpen((v) => !v)}
            className="relative inline-flex items-center justify-center h-10 w-10 rounded-lg"
            style={{ border: "1px solid var(--border)", background: "transparent" }}
          >
            <span aria-hidden="true" className="block w-5">
              <span
                style={{
                  display: "block",
                  height: "2px",
                  width: "20px",
                  background: "currentColor",
                  borderRadius: "2px",
                  transition: "transform 200ms ease, opacity 200ms ease",
                  transform: open ? "translateY(6px) rotate(45deg)" : "translateY(0) rotate(0deg)",
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "2px",
                  width: "20px",
                  background: "currentColor",
                  borderRadius: "2px",
                  marginTop: "6px",
                  marginBottom: "6px",
                  transition: "opacity 200ms ease",
                  opacity: open ? 0 : 1,
                }}
              />
              <span
                style={{
                  display: "block",
                  height: "2px",
                  width: "20px",
                  background: "currentColor",
                  borderRadius: "2px",
                  transition: "transform 200ms ease",
                  transform: open ? "translateY(-6px) rotate(-45deg)" : "translateY(0) rotate(0deg)",
                }}
              />
            </span>
          </button>
          <span className="font-medium">DocSorter</span>
        </header>
        <main style={{ transition: "margin-left 280ms cubic-bezier(0.22, 1, 0.36, 1)", marginLeft: open ? 0 : 0 }}>{children}</main>
      </div>
    </div>
  );
}


