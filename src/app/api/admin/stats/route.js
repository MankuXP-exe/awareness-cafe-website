import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAuth } from "@/lib/auth";

export async function GET(request) {
  const user = requireAuth(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();

  try {
    // Total orders
    const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true });
    // Delivered
    const { count: deliveredOrders } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "delivered");
    // Cancelled
    const { count: cancelledOrders } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "cancelled");
    // Revenue
    const { data: revenueData } = await supabase.from("orders").select("total").eq("status", "delivered");
    const totalRevenue = (revenueData || []).reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

    // Today's orders
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const { data: todayData } = await supabase.from("orders").select("total").gte("created_at", today.toISOString());
    const todayOrders = todayData?.length || 0;
    const todayRevenue = (todayData || []).reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

    // Most ordered item
    const { data: allOrders } = await supabase.from("orders").select("items");
    const itemCounts = {};
    (allOrders || []).forEach(order => {
      (order.items || []).forEach(item => {
        const name = item.name;
        itemCounts[name] = (itemCounts[name] || 0) + (item.qty || 1);
      });
    });
    const sorted = Object.entries(itemCounts).sort((a, b) => b[1] - a[1]);
    const mostOrderedItem = sorted.length > 0 ? { name: sorted[0][0], count: sorted[0][1] } : null;

    return NextResponse.json({
      totalOrders: totalOrders || 0, deliveredOrders: deliveredOrders || 0,
      cancelledOrders: cancelledOrders || 0, totalRevenue: Math.round(totalRevenue),
      todayOrders, todayRevenue: Math.round(todayRevenue), mostOrderedItem,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
