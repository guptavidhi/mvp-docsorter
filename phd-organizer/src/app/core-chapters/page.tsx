import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";

export default function CoreChaptersPage() {
  return (
    <div className="p-6">
      <Breadcrumbs />
      <h1 className="text-2xl font-semibold mb-4">Core Chapters</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <SectionCard href="/core-chapters/introductions" title="Introductions" />
        <SectionCard href="/core-chapters/literature-review" title="Literature review" />
        <SectionCard href="/core-chapters/methodology" title="Methodology" />
        <SectionCard href="/core-chapters/results" title="Results" />
        <SectionCard href="/core-chapters/discussion" title="Discussion" />
        <SectionCard href="/core-chapters/conclusion" title="Conclusion" />
      </div>
    </div>
  );
}

function SectionCard({ href, title }: { href: string; title: string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border p-6 md:p-8 h-36"
      style={{ background: "var(--surface)", borderColor: "var(--border)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}
    >
      <h2 className="text-lg md:text-xl font-medium" style={{ color: "var(--foreground)" }}>{title}</h2>
      <span className="text-sm opacity-70">Open →</span>
    </Link>
  );
}


