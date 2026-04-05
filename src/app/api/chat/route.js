import { NextResponse } from "next/server";
import { AWABOT_SYSTEM_PROMPT } from "@/lib/chatbot-system-prompt";

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Simple in-memory rate limiter
const globalCache = global.rateLimitCache || new Map();
if (process.env.NODE_ENV !== 'production') global.rateLimitCache = globalCache;

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 requests per minute per IP

export async function POST(request) {
  try {
    // 1. IP-based Rate Limiting for security
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const now = Date.now();
    const rateRecord = globalCache.get(ip) || { count: 0, firstRequest: now };

    if (now - rateRecord.firstRequest > RATE_LIMIT_WINDOW_MS) {
      rateRecord.count = 1;
      rateRecord.firstRequest = now;
    } else {
      rateRecord.count++;
      if (rateRecord.count > MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json({
          message: "You're sending messages too fast! 🚦 Please wait a minute before sending another message.",
        }, { status: 429 });
      }
    }
    globalCache.set(ip, rateRecord);

    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    // Attempt 1: Gemini API
    const contents = [];
    for (const msg of messages) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    }

    let responseText = null;

    try {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: AWABOT_SYSTEM_PROMPT }] },
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: 0.7,
            },
          }),
        }
      );

      const geminiData = await geminiResponse.json();

      if (geminiResponse.ok && geminiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = geminiData.candidates[0].content.parts[0].text;
      } else {
        console.warn("Gemini API issue, falling back to OpenRouter:", geminiData);
      }
    } catch (gErr) {
      console.warn("Gemini API failed, falling back to OpenRouter:", gErr);
    }

    // Attempt 2: OpenRouter API Fallback
    if (!responseText && OPENROUTER_API_KEY) {
      const openRouterMessages = [
        { role: "system", content: AWABOT_SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ];

      const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": "The Awareness Cafe",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash", // Use gemini via OpenRouter ideally, or change to a free one if needed
          messages: openRouterMessages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      const orData = await orResponse.json();
      if (orResponse.ok && orData?.choices?.[0]?.message?.content) {
        responseText = orData.choices[0].message.content;
      } else {
        console.error("OpenRouter API issue:", orData);
      }
    }

    if (responseText) {
      return NextResponse.json({ message: responseText });
    }

    // If both failed
    return NextResponse.json({
      message: "I'm getting a lot of orders right now! 🔥 Please try again in a minute, or you can order directly from our menu page. Tap 'Order Online' at the top! 🛒",
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({
      message: "Oops! Something went wrong 😅 Please try again or call +91 87501 55505!",
    });
  }
}
