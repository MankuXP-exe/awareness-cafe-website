import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

// GET — fetch all contact submissions
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ contacts: [] });
    }
    return NextResponse.json({ contacts: data || [] });
  } catch {
    return NextResponse.json({ contacts: [] });
  }
}
