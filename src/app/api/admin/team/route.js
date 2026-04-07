import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Helper to get current team
async function getTeamMembers(supabase) {
  const { data } = await supabase.from("admin_settings").select("value").eq("key", "team_members").single();
  if (data && data.value) {
    try { return JSON.parse(data.value); } catch { return []; }
  }
  return [];
}

// GET — fetch team
export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const supabase = createAdminClient();
  const team = await getTeamMembers(supabase);
  return NextResponse.json({ team });
}

// POST — upload individual image + update/add member
export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const id = formData.get("id"); // if provided, it's an update
  const name = formData.get("name") || "";
  const role = formData.get("role") || "";
  const desc = formData.get("desc") || "";
  const file = formData.get("file");

  const supabase = createAdminClient();
  let imageUrl = formData.get("existing_image_url") || "";

  // If a new file is provided, upload it
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop();
    const fileName = `team/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const fileBuffer = await file.arrayBuffer();

    const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, fileBuffer, {
      contentType: file.type, upsert: false,
    });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed: " + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  // Get current team list
  let team = await getTeamMembers(supabase);

  if (id) {
    // Update existing member
    const index = team.findIndex(m => m.id === id);
    if (index !== -1) {
      team[index] = { ...team[index], name, role, desc, image_url: imageUrl };
    } else {
      team.push({ id, name, role, desc, image_url: imageUrl });
    }
  } else {
    // Create new member
    const newId = crypto.randomUUID();
    team.push({ id: newId, name, role, desc, image_url: imageUrl });
  }

  // Save back to admin_settings
  const { error: updateError } = await supabase.from("admin_settings").upsert({
    key: "team_members", value: JSON.stringify(team), updated_at: new Date().toISOString()
  });

  if (updateError) return NextResponse.json({ error: "Failed to save to database" }, { status: 500 });

  return NextResponse.json({ success: true, team });
}

// DELETE — remove a team member
export async function DELETE(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  const supabase = createAdminClient();

  let team = await getTeamMembers(supabase);
  team = team.filter(m => m.id !== id);

  const { error: updateError } = await supabase.from("admin_settings").upsert({
    key: "team_members", value: JSON.stringify(team), updated_at: new Date().toISOString()
  });

  if (updateError) return NextResponse.json({ error: "Failed to update database" }, { status: 500 });

  return NextResponse.json({ success: true, team });
}
