"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import DarkModeToggle from "./DarkModeToggle";

export default function Sidebar() {
  const [papersOpen, setPapersOpen] = useState<boolean>(true);

  return (
    <aside className="h-dvh w-64 border-r flex flex-col" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="px-4 py-3 border-b dark:border-neutral-800">
        <span className="font-semibold">DocSorter</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1 text-sm">
        <NavItem href="/">Home</NavItem>
        <NavItem href="/thesis">Thesis</NavItem>

        <div>
          <button
            onClick={() => setPapersOpen((v) => !v)}
            className="w-full text-left px-2 py-2 rounded flex items-center justify-between"
            style={{ background: "transparent" }}
          >
            <span>Papers</span>
            <span className="text-xs opacity-60">{papersOpen ? "▾" : "▸"}</span>
          </button>
          {papersOpen && (
            <div className="ml-3 mt-1 space-y-1">
              <NavItem href="/papers/all">All</NavItem>
              <NavItem href="/papers/reading">Reading</NavItem>
              <NavItem href="/papers/to-read">To Read</NavItem>
              <NavItem href="/papers/starred">Starred</NavItem>
            </div>
          )}
        </div>

        <NavItem href="/docs">PDFs/Docs</NavItem>
        <NavItem href="/notes">Notes</NavItem>
        <NavItem href="/finished">Finished</NavItem>
        <NavItem href="/playground">Playground</NavItem>
        <NavItem href="/napkin">Napkin</NavItem>
      </nav>

      <div className="p-3 border-t" style={{ borderColor: "var(--border)" }}>
        <DarkModeToggle />
      </div>
    </aside>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link href={href} className="block px-2 py-2 rounded font-medium" style={{
      background: active ? "var(--hover-bg)" : "transparent",
      color: "var(--foreground)",
    }}>
      <span style={{ opacity: active ? 1 : 0.85 }}>{children}</span>
    </Link>
  );
}


