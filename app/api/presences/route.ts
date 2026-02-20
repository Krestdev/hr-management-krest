import { NextResponse } from "next/server";
import { Presence } from "@/types/types";
import { presencesData } from "@/data/temp";

/* ✅ GET ALL PRESENCES */
export async function GET() {
  return NextResponse.json({
    success: true,
    items: presencesData,
    count: presencesData.length,
  });
}

/* ✅ CREATE PRESENCE */
export async function POST(req: Request) {
  try {
    const body: Omit<Presence, "id" | "createdAt"> = await req.json();

    const newPresence: Presence = {
      ...body,
      id: presencesData.length + 1,
      createdAt: (new Date()).toISOString(),
    };

    presencesData.push(newPresence);

    return NextResponse.json({
      success: true,
      item: newPresence,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la création de la présence",
      },
      { status: 500 }
    );
  }
}
