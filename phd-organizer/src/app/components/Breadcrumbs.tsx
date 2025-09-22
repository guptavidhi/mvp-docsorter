"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);

  const segments = ["/", ...parts.map((_, i) => "/" + parts.slice(0, i + 1).join("/"))];

  function labelFor(part: string) {
    if (!part) return "Home";
    return part
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm" style={{ color: "var(--foreground)" }}>
      {segments.map((href, i) => {
        const part = href === "/" ? "" : parts[i - 1] || "";
        const isLast = i === segments.length - 1;
        return (
          <span key={href}>
            {i > 0 && <span className="opacity-60"> / </span>}
            {isLast ? (
              <span className="opacity-80">{labelFor(part)}</span>
            ) : (
              <Link href={href} className="hover:underline" style={{ color: "var(--foreground)" }}>
                {labelFor(part)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}


