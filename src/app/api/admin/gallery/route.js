import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

// GET — fetch gallery images
export async function GET(request) {
  const supabase = createAdminClient();
  const { data } = await supabase.from("gallery_images").select("*").order("sort_order", { ascending: true });
  return NextResponse.json({ images: data || [] });
}

// POST — upload image to storage + save record
export async function POST(request) {
  try {
    const user = requireAuth(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file");
    const title = formData.get("title") || "";
    const category = formData.get("category") || "food";

    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const supabase = createAdminClient();
    const ext = file.name.split(".").pop();
    const fileName = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Convert File to Buffer — required for Supabase Storage on Vercel serverless
    const arrayBuf = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuf);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage.from("gallery").upload(fileName, fileBuffer, {
      contentType: file.type, upsert: true,
    });

    if (uploadError) {
      console.error("Gallery upload error:", uploadError);
      return NextResponse.json({ error: "Upload failed: " + uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    const { error: dbError } = await supabase.from("gallery_images").insert({
      title, category, image_url: imageUrl,
    });

    if (dbError) return NextResponse.json({ error: "DB save failed: " + dbError.message }, { status: 500 });
    return NextResponse.json({ success: true, url: imageUrl }, { status: 201 });
  } catch (err) {
    console.error("Gallery POST error:", err);
    return NextResponse.json({ error: "Server error: " + (err.message || "Unknown") }, { status: 500 });
  }
}

// DELETE — remove image
export async function DELETE(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, image_url } = await request.json();
  const supabase = createAdminClient();

  // Delete from storage if it's a Supabase URL
  if (image_url?.includes("supabase.co")) {
    const path = image_url.split("/storage/v1/object/public/gallery/")[1];
    if (path) await supabase.storage.from("gallery").remove([path]);
  }

  if (id) await supabase.from("gallery_images").delete().eq("id", id);
  return NextResponse.json({ success: true });
}
