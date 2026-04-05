import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { testimonials } from "@/lib/data";

const reviewSchema = z.object({
  customer_name: z.string().min(2).max(100),
  rating: z.number().min(1).max(5),
  review_text: z.string().min(20, "Review must be at least 20 characters").max(1000),
  customer_phone: z.string().optional().default(""),
});

// GET: Public — fetch approved reviews + hardcoded
export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    const dbReviews = (data || []).map((r) => ({
      id: r.id, name: r.customer_name, rating: r.rating, text: r.review_text,
      avatar: r.customer_name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2),
      date: r.created_at,
    }));

    const hardcoded = testimonials.map((t, i) => ({ id: `hc-${i}`, ...t, date: "2025-01-01" }));

    return NextResponse.json({ reviews: [...dbReviews, ...hardcoded] });
  } catch {
    return NextResponse.json({ reviews: testimonials.map((t, i) => ({ id: `hc-${i}`, ...t })) });
  }
}

// POST: Public — submit a review (pending approval)
export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const supabase = createAdminClient();
    const { error } = await supabase.from("reviews").insert({
      customer_name: parsed.data.customer_name,
      rating: parsed.data.rating,
      review_text: parsed.data.review_text,
      is_approved: false,
    });
    if (error) {
      console.error("Review insert error:", error);
      return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Review submitted! It will appear after approval." });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
