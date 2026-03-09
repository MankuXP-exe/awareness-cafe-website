import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import MenuItem from "@/models/MenuItem";
import { requireAuth } from "@/lib/auth";

export async function PUT(request, { params }) {
  const auth = requireAuth(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { id } = await params;
    const body = await request.json();
    const item = await MenuItem.findByIdAndUpdate(id, body, { new: true });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Update menu item error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const auth = requireAuth(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const conn = await connectDB();
    if (!conn) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const { id } = await params;
    const item = await MenuItem.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete menu item error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
