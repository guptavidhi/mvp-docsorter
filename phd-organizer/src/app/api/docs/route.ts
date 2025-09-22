import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";

// Node-friendly PDF parsing using pdfjs-dist
async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist");
    
    // Configure for Node.js environment with canvas support
    const loadingTask = pdfjsLib.getDocument({
      data: buffer,
      useSystemFonts: true,
      disableFontFace: false,
      disableRange: false,
      disableStream: false,
    });
    
    const pdf = await loadingTask.promise;
    let text = "";
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      text += pageText + "\n";
    }
    
    return text.trim();
  } catch (err) {
    console.error("PDF parsing error:", err);
    throw new Error("Failed to parse PDF file");
  }
}

// DOCX extraction
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const mod: any = await import("mammoth");
    const mammoth = mod?.default ?? mod;
    const result = await mammoth.convertToHtml({ buffer });
    const text = result.value
      .replace(/<[^>]+>/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();
    return text;
  } catch (err) {
    console.error("DOCX parsing error:", err);
    throw new Error("Failed to parse DOCX file");
  }
}

// Truncate/sanitize
function sanitizeAndTruncate(input: string, maxChars = 20000): string {
  const cleaned = input.replace(/\s+/g, " ").trim();
  return cleaned.length > maxChars ? cleaned.slice(0, maxChars) : cleaned;
}

export async function POST(req: NextRequest) {
  try {
    console.log("Starting PDF/DOCX processing...");
    
    const form = await req.formData();
    const file = form.get("file");
    const topic = (form.get("topic") as string) || "";

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = (file as File).name;
    console.log("Processing file:", fileName);
    
    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("File size:", buffer.length, "bytes");

    let text = "";
    const lower = fileName.toLowerCase();
    if (lower.endsWith(".pdf")) {
      console.log("Extracting text from PDF...");
      try {
        text = await extractTextFromPdf(buffer);
      } catch (pdfErr) {
        console.error("PDF parsing failed:", pdfErr);
        // For now, suggest using DOCX instead
        return NextResponse.json({
          error: "PDF parsing is currently unavailable. Please convert your PDF to DOCX format and try again, or use a DOCX file directly.",
        }, { status: 422 });
      }
    } else if (lower.endsWith(".docx")) {
      console.log("Extracting text from DOCX...");
      text = await extractTextFromDocx(buffer);
    } else {
      return NextResponse.json({
        error: "Unsupported file type. Upload PDF or DOCX.",
      }, { status: 415 });
    }

    console.log("Extracted text length:", text.length);
    const content = sanitizeAndTruncate(text);
    if (!content) {
      return NextResponse.json({
        error: "Failed to extract text from document."
      }, { status: 422 });
    }

    const systemPrompt = `You are an assistant that summarizes academic papers. Return concise outputs in JSON.
Fields:
- title: string (best-guess from content)
- tl;dr: string (2-3 sentences)
- key_points: string[] (3-6 bullets)
- relevance: string (2-4 sentences explaining relevance to the user's topic)
Write valid JSON only.`;

    const userPrompt = `User topic: ${topic || "(none specified)"}
Document content:
"""
${content}
"""`;

    console.log("Calling OpenAI...");
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const raw = response.choices?.[0]?.message?.content || "";
    console.log("OpenAI response received");
    
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { summary_text: raw };
    }

    console.log("Processing complete, returning result");
    return NextResponse.json({ fileName, topic, result: parsed });
  } catch (err: any) {
    console.error("/api/docs error", err);
    return NextResponse.json({ error: `Server error: ${err.message}` }, { status: 500 });
  }
}
