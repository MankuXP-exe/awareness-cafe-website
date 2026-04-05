import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from("gallery_images").select("*").order("sort_order", { ascending: true });
    return NextResponse.json({ images: (data || []).map(i => ({ ...i, src: i.image_url, alt: i.title })) });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
