/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";

export default function NotesPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<any[]>([]);

  async function saveNote() {
    try {
      const res = await axios.post("/api/notes", { title, content });
      if (res.status === 200) {
        alert("Note saved!");
        setTitle("");
        setContent("");
        fetchNotes();
      }
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note.");
    }
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
      <Breadcrumbs />
      <h1 className="text-xl font-bold">Notes</h1>

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
              {note.created_at ? new Date(note.created_at).toLocaleString() : "No date"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


