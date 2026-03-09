import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { requireAuth } from "@/lib/auth";

export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Fetch contacts error:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}
