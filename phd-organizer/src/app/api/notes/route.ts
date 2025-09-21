'use server';

import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/** Define a Note type */
type Note = {
  id: string;
  title: string;
  content: string;
  project_id?: string;
  created_at: string | null;
  embedding?: number[];
};

/**
 * GET /api/notes
 * Fetch last 5 notes (newest first)
 */
export async function GET() {
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content, project_id, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const normalized: Note[] = (data ?? []).map((row: any) => ({
    ...row,
    created_at: row.created_at
      ? new Date(row.created_at).toISOString()
      : null,
  }));

  return NextResponse.json(normalized, { status: 200 });
}

/**
 * POST /api/notes
 * Create a new note
 */
export async function POST(req: Request) {
  const { title, content, project_id } = await req.json();

  // 1. Generate embedding with OpenAI
  const emb = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: content,
  });

  const embedding = emb.data[0].embedding;

  // 2. Save to Supabase
  const { data, error } = await supabase
    .from("notes")
    .insert([{ title, content, project_id, embedding }])
    .select("id, title, content, project_id, created_at"); // <-- add select to fetch back

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const normalized: Note[] = (data ?? []).map((row: any) => ({
    ...row,
    created_at: row.created_at
      ? new Date(row.created_at).toISOString()
      : null,
  }));

  return NextResponse.json(normalized, { status: 200 });
}
