import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required." },
        { status: 400 }
      );
    }

    // Verify credentials against env vars
    if (username !== adminUser || password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = createToken({ username, role: "admin" });

    const response = NextResponse.json({
      success: true,
      token,
      message: "Login successful",
    });

    // Set HTTP-only cookie as well
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
