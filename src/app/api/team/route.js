import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("admin_settings").select("value").eq("key", "team_members").single();
    
    let members = [];
    if (data && data.value) {
      members = JSON.parse(data.value);
    }
    
    return NextResponse.json({ team: members });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json({ team: [] });
  }
}
