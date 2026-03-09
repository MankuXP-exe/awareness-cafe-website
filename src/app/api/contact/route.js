import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

// Simple in-memory rate limiter
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimit.get(ip);

  if (!record) {
    rateLimit.set(ip, { count: 1, start: now });
    return true;
  }

  if (now - record.start > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { count: 1, start: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// Sanitize input
function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[<>]/g, "").trim();
}

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const name = sanitize(body.name);
    const phone = sanitize(body.phone);
    const message = sanitize(body.message);

    // Validation
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    if (name.length > 100 || phone.length > 15 || message.length > 500) {
      return NextResponse.json(
        { error: "Input exceeds maximum length." },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json(
        { error: "Database not configured. Please call us directly at +91 87501 55505." },
        { status: 503 }
      );
    }

    const contact = await Contact.create({ name, phone, message });

    return NextResponse.json(
      { success: true, message: "Message received! We'll get back to you soon.", id: contact._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
