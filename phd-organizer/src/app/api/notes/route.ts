import { supabase } from "@/lib/supabaseClient";

import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * GET /api/notes
 * Fetch all notes
 */
export async function GET() {
  const { data, error } = await supabase
    .from("notes")
    .select("id, title, content")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], { status: 200 });
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
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
