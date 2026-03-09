import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ items: [] });
    }
    const items = await MenuItem.find().sort({ category: 1, order: 1 });
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Fetch menu error:", error);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = requireAuth(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const body = await request.json();
    const item = await MenuItem.create({
      name: body.name,
      price: body.price,
      desc: body.desc || "",
      category: body.category,
      image: body.image || "",
      available: body.available !== false,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Create menu item error:", error);
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}
