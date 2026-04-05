import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

// GET — fetch reviews (with optional filter)
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const supabase = createAdminClient();

  let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
  if (filter === "pending") query = query.eq("is_approved", false);
  if (filter === "approved") query = query.eq("is_approved", true);

  const { data } = await query;
  return NextResponse.json({ reviews: data || [] });
}

// PATCH — approve/reject review
export async function PATCH(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, is_approved } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  await supabase.from("reviews").update({ is_approved }).eq("id", id);
  return NextResponse.json({ success: true });
}

// DELETE — delete review
export async function DELETE(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const supabase = createAdminClient();
  await supabase.from("reviews").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
