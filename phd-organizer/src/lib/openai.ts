import OpenAI from "openai";

// Initialize the OpenAI client with your API key from .env.local
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
