// app/api/presences/route.ts
import { NextResponse } from "next/server";
import { demoPresenceRecords } from "@/data/presence"; // adapte le chemin si besoin

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  if (!userIdParam) {
    return NextResponse.json(
      { success: false, message: "Paramètre requis : userId" },
      { status: 400 }
    );
  }

  const userId = Number(userIdParam);
  if (Number.isNaN(userId)) {
    return NextResponse.json(
      { success: false, message: "userId doit être un nombre" },
      { status: 400 }
    );
  }

  // filtre de base par utilisateur
  let items = demoPresenceRecords.filter((p) => p.userId === userId);

  // filtre par période si fourni
  let fromDate: Date | undefined;
  let toDate: Date | undefined;

  if (fromParam) {
    const d = new Date(fromParam);
    if (!Number.isNaN(d.getTime())) {
      fromDate = d;
    }
  }

  if (toParam) {
    const d = new Date(toParam);
    if (!Number.isNaN(d.getTime())) {
      toDate = d;
    }
  }

  if (fromDate) {
    items = items.filter((p) => p.date >= fromDate!);
  }

  if (toDate) {
    items = items.filter((p) => p.date <= toDate!);
  }

  // tri par date (du plus récent au plus ancien)
  items.sort((a, b) => b.date.getTime() - a.date.getTime());

  return NextResponse.json({
    success: true,
    items,
    count: items.length,
  });
}
