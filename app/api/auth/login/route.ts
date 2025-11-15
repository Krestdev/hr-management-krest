// app/api/auth/login/route.ts
import { demoUsers } from "@/data/temp";
import { NextResponse } from "next/server";

// --- API LOGIN ---

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const user = demoUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: "fake-jwt-token-" + user.id, // 👉 tu pourras remplacer par un vrai token plus tard
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}
