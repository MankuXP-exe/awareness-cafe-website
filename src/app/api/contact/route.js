import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  message: z.string().min(5).max(500),
});

// POST — save contact form submission
export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const supabase = createAdminClient();
    const order_number = `BKG-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    
    // Using the 'orders' table to store bookings autonomously to bypass manual DDL SQL schema creation
    const { error } = await supabase.from("orders").insert({
      order_number,
      customer_name: parsed.data.name,
      customer_phone: parsed.data.phone,
      notes: parsed.data.message,
      customer_address: "Table Booking",
      customer_pincode: "000000",
      items: [{ id: "booking", name: "Table Booking / Query", price: 0, quantity: 1 }],
      subtotal: 0,
      delivery_fee: 0,
      total: 0,
      is_custom_order: true,
      status: "pending", // we'll treat 'pending' as unread, 'confirmed' as read
    });

    if (error) {
      console.error("Contact save error:", error.message);
      return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Message sent! We'll get back to you soon." });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
