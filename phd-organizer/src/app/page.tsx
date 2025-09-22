import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <HomeCard href="/front-matter" title="Front Matter" description="Title page, Abstract, Acknowledgments, Table of contents" />
        <HomeCard href="/core-chapters" title="Core Chapters" description="Introductions, Literature review, Methodology, Results, Discussion, Conclusion" />
        <HomeCard href="/back-matter" title="Back Matter" description="References (Bibliography), Appendices" />
      </div>
    </div>
  );
}

function HomeCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border p-6 md:p-8 h-40 md:h-56"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <div className="flex h-full flex-col justify-between">
        <h2 className="text-xl md:text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{title}</h2>
        <p className="text-sm opacity-80">{description}</p>
        <span className="text-sm opacity-70">Open →</span>
      </div>
    </Link>
  );
}
