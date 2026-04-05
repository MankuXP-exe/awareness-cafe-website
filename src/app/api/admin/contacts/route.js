import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  // Fetch ONLY items marked as Table Booking
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_address", "Table Booking")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  return NextResponse.json({ messages: data || [] });
}

// PATCH — update status (e.g., mark as read/resolved)
export async function PATCH(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, status } = await request.json(); // "pending" = New, "confirmed" = Read
  
  const supabase = createAdminClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — remove message
export async function DELETE(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  const supabase = createAdminClient();
  
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  return NextResponse.json({ success: true });
}
