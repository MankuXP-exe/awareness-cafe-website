import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

export async function POST(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const supabase = createAdminClient();
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Convert File to ArrayBuffer
  const fileBuffer = await file.arrayBuffer();

  // Upload to Supabase Storage 'menu-images' bucket
  const { error: uploadError } = await supabase.storage.from("menu-images").upload(fileName, fileBuffer, {
    contentType: file.type, upsert: false,
  });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return NextResponse.json({ error: "Upload failed: " + uploadError.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from("menu-images").getPublicUrl(fileName);
  
  return NextResponse.json({ success: true, url: urlData.publicUrl }, { status: 201 });
}
