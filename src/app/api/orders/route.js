import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

const orderSchema = z.object({
  customer_name: z.string().min(2, "Name is required").max(100),
  customer_phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit phone required"),
  customer_address: z.string().min(5, "Address is required").max(500),
  customer_pincode: z.string().max(10).optional().default(""),
  items: z.array(z.object({
    name: z.string(), qty: z.number().min(1), price: z.number().optional(),
    numericPrice: z.number().optional(), customizations: z.string().optional(),
  })).min(1, "At least one item required"),
  subtotal: z.number().min(0),
  delivery_fee: z.number().min(0).default(0),
  total: z.number().min(0),
  notes: z.string().max(500).optional().default(""),
  is_custom_order: z.boolean().optional().default(false),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }
    const data = parsed.data;
    const supabase = createAdminClient();

    // Generate order number: AWC-YYYY-XXXX
    const year = new Date().getFullYear();
    const { count } = await supabase.from("orders").select("*", { count: "exact", head: true });
    const orderNum = `AWC-${year}-${String((count || 0) + 1).padStart(4, "0")}`;

    const { data: order, error } = await supabase.from("orders").insert({
      order_number: orderNum,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_address: data.customer_address,
      customer_pincode: data.customer_pincode,
      items: data.items,
      subtotal: data.subtotal,
      delivery_fee: data.delivery_fee,
      total: data.total,
      status: "pending",
      payment_method: "COD",
      notes: data.notes,
      is_custom_order: data.is_custom_order,
    }).select().single();

    if (error) {
      console.error("Order insert error:", error);
      return NextResponse.json({ error: "Failed to place order. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, order_number: orderNum, order_id: order.id }, { status: 201 });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
