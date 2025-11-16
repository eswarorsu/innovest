import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, short_pitch } = await req.json();

    // If no key, return deterministic fallback
    if (!process.env.OPENAI_API_KEY) {
      const crude = Math.min(95, Math.max(60, 60 + (title?.length || 0) % 35));
      return NextResponse.json({ score: crude });
    }

    const prompt = `
You are a startup evaluator. Score the idea from 60 to 95.
Return just a number (no text).
Title: ${title}
Pitch: ${short_pitch}
Score:`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Return only a number." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 5,
      }),
    });

    if (!r.ok) {
      const crude = Math.min(95, Math.max(60, 60 + (title?.length || 0) % 35));
      return NextResponse.json({ score: crude });
    }

    const data = await r.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    const num = parseInt(String(text).replace(/\D/g, ""), 10);
    const score = Number.isFinite(num) ? Math.min(95, Math.max(60, num)) : 72;
    return NextResponse.json({ score });
  } catch {
    return NextResponse.json({ score: 72 });
  }
}
