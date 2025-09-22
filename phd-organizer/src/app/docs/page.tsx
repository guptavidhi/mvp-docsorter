"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

type SummaryResult = {
  fileName: string;
  topic: string;
  result: any;
};

export default function DocsPage() {
  const [isOver, setIsOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [topic, setTopic] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SummaryResult | null>(null);

  useEffect(() => {
    const onDocPrevent = (e: DragEvent) => {
      e.preventDefault();
    };
    window.addEventListener("dragover", onDocPrevent);
    window.addEventListener("drop", onDocPrevent);
    return () => {
      window.removeEventListener("dragover", onDocPrevent);
      window.removeEventListener("drop", onDocPrevent);
    };
  }, []);

  const onDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    setError(null);
    setResult(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  }, [topic]);

  const onSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  }, [topic]);

  async function uploadFile(file: File) {
    setUploading(true);
    setError(null);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("topic", topic);
      const res = await fetch("/api/docs", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const dropLabel = useMemo(() => {
    if (uploading) return "Uploading and summarising…";
    if (isOver) return "Release to upload";
    return "Drag & drop PDF/DOCX here, or click to choose";
  }, [isOver, uploading]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-3">PDFs / Docs</h1>
      <p className="text-sm opacity-80 mb-4">Drag a PDF or DOCX anywhere on the page, or use the box below. Provide a topic so the summary includes relevance.</p>

      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_300px]">
        <div>
          <DropZone
            isOver={isOver}
            setIsOver={setIsOver}
            label={dropLabel}
            disabled={uploading}
            onDrop={onDrop}
            onSelect={onSelect}
          />
        </div>
        <div className="rounded-xl border p-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <label className="block text-sm font-medium mb-2">Topic (for relevance)</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Renewable energy policy"
            className="w-full rounded border px-3 py-2"
            style={{ background: "transparent", borderColor: "var(--border)" }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border p-3 text-sm" style={{ borderColor: "#ef4444", color: "#ef4444" }}>{error}</div>
      )}

      {result && <SummaryCard data={result} />}
    </div>
  );
}

function DropZone({
  isOver,
  setIsOver,
  label,
  disabled,
  onDrop,
  onSelect,
}: {
  isOver: boolean;
  setIsOver: (v: boolean) => void;
  label: string;
  disabled: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      onDragEnter={() => setIsOver(true)}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true); }}
      onDragLeave={() => setIsOver(false)}
      onDrop={onDrop}
      className="rounded-xl border p-8 text-center cursor-pointer"
      style={{
        background: "var(--surface)",
        borderColor: isOver ? "#3b82f6" : "var(--border)",
        boxShadow: isOver ? "0 0 0 4px rgba(59,130,246,0.15)" : "0 4px 20px rgba(0,0,0,0.06)",
      }}
    >
      <input type="file" accept=".pdf,.docx" onChange={onSelect} disabled={disabled} className="hidden" id="file-input" />
      <label htmlFor="file-input" className="block select-none">
        <div className="text-lg font-medium mb-2">{label}</div>
        <div className="text-sm opacity-70">Supported: PDF, DOCX</div>
      </label>
    </div>
  );
}

function SummaryCard({ data }: { data: SummaryResult }) {
  const { fileName, topic, result } = data;
  const title = result?.title || fileName;
  const tldr = result?.["tl;dr"] || result?.tldr || result?.summary_text || "No summary";
  const keyPoints: string[] = Array.isArray(result?.key_points) ? result.key_points : [];
  const relevance: string = result?.relevance || "";

  return (
    <div className="mt-6 rounded-xl border p-6" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      <div className="mb-2 text-xs opacity-70">File: {fileName} {topic ? `· Topic: ${topic}` : ""}</div>
      <h2 className="text-xl font-semibold mb-2" style={{ color: "var(--foreground)" }}>{title}</h2>
      <p className="mb-3">{tldr}</p>
      {keyPoints.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium mb-1">Key points</div>
          <ul className="list-disc pl-5 space-y-1">
            {keyPoints.map((kp, i) => (<li key={i}>{kp}</li>))}
          </ul>
        </div>
      )}
      {relevance && (
        <div>
          <div className="text-sm font-medium mb-1">Relevance</div>
          <p>{relevance}</p>
        </div>
      )}
    </div>
  );
}


