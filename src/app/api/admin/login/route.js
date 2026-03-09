import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

    // Check username
    if (username !== adminUser) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    // For simplicity, compare plaintext from env (in production, store hashed)
    // We hash the env password and compare
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const isValid = await bcrypt.compare(password, hashedPassword);

    if (!isValid) {
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
