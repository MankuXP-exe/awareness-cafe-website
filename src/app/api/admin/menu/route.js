import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET — fetch all menu items from Supabase
export async function GET(request) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("menu_items").select("*").order("sort_order", { ascending: true });
  if (error) return NextResponse.json({ items: [] });
  return NextResponse.json({ items: data || [] });
}

// POST — add new menu item
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const supabase = createAdminClient();
  const { error } = await supabase.from("menu_items").insert({
    name: body.name, description: body.description, category: body.category,
    emoji: body.emoji || "🍽️", price: body.price, image_url: body.image_url,
    is_available: body.is_available !== false, sort_order: body.sort_order || 0,
  });
  if (error) return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  return NextResponse.json({ success: true }, { status: 201 });
}

// PUT — update menu item
export async function PUT(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const updates = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;
  if (body.category !== undefined) updates.category = body.category;
  if (body.price !== undefined) updates.price = body.price;
  if (body.image_url !== undefined) updates.image_url = body.image_url;
  if (body.is_available !== undefined) updates.is_available = body.is_available;
  if (body.sort_order !== undefined) updates.sort_order = body.sort_order;

  const { error } = await supabase.from("menu_items").update(updates).eq("id", body.id);
  if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — remove menu item
export async function DELETE(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  return NextResponse.json({ success: true });
}
