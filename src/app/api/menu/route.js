import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { menuData } from "@/lib/data";

// GET: Public — fetch all available menu items
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      // Fallback to static data
      return NextResponse.json({ items: menuData, source: "static" });
    }

    // Group by category
    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.category]) grouped[item.category] = { category: item.category, emoji: item.emoji || "🍽️", items: [] };
      grouped[item.category].items.push(item);
    });

    return NextResponse.json({ items: Object.values(grouped), source: "supabase" });
  } catch {
    return NextResponse.json({ items: menuData, source: "static" });
  }
}
