"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const res = await axios.get("/api/notes");
      setNotes(res.data || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }

  async function saveNote() {
    try {
      setLoading(true);
      await axios.post("/api/notes", { title, content });
      setTitle("");
      setContent("");
      await fetchNotes(); // refresh notes after saving
      alert("✅ Note saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save note");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">PhD Organizer</h1>

      {/* Form */}
      <input
        className="border p-2 w-full mb-2 rounded"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border p-2 w-full mb-2 rounded"
        placeholder="Note Content"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        onClick={saveNote}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Note"}
      </button>

      {/* Notes List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Saved Notes</h2>
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((note) => (
              <li key={note.id} className="border rounded p-3 bg-gray-50">
                <h3 className="font-bold">{note.title}</h3>
                <p className="text-gray-700">{note.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
