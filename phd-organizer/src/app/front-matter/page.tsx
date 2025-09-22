import Link from "next/link";
import Breadcrumbs from "../components/Breadcrumbs";

export default function FrontMatterPage() {
  return (
    <div className="p-6">
      <Breadcrumbs />
      <h1 className="text-2xl font-semibold mb-4">Front Matter</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <SectionCard href="/front-matter/title-page" title="Title page" />
        <SectionCard href="/front-matter/abstract" title="Abstract" />
        <SectionCard href="/front-matter/acknowledgments" title="Acknowledgments" />
        <SectionCard href="/front-matter/table-of-contents" title="Table of contents" />
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


