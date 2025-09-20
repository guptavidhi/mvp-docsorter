"use client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);

  async function saveNote() {
    await axios.post("/api/notes", { title, content });
    setTitle("");
    setContent("");
    fetchNotes();
  }

  async function fetchNotes() {
    try {
      const res = await axios.get("/api/notes");
      setNotes(res.data || []);
    } catch (err) {
      console.error("Error fetching notes:", err);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">PhD Organizer</h1>

      {/* Form */}
      <input
        className="border p-2 w-full my-2"
        placeholder="Note Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full my-2"
        placeholder="Note Content"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={saveNote} className="bg-blue-500 text-white px-4 py-2">
        Save Note
      </button>

      {/* Notes List */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Saved Notes</h2>
        {notes.map((note) => (
          <div key={note.id} className="border p-4 my-2 rounded">
            <h3 className="font-bold">{note.title}</h3>
            <p>{note.content}</p>
            <p className="text-sm text-gray-500">
              {new Date(note.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
