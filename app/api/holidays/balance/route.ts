// app/api/holidays/balance/route.ts
import { demoLeaveBalances } from "@/data/temp";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");
  const yearParam = searchParams.get("year");

  if (!userIdParam) {
    return NextResponse.json(
      {
        success: false,
        message: "Paramètre requis : userId",
      },
      { status: 400 }
    );
  }

  const userId = Number(userIdParam);
  const year = yearParam ? Number(yearParam) : undefined;

  // Filtrer les soldes de l'utilisateur
  const balances = demoLeaveBalances.filter((b) => b.userId === userId);

  if (balances.length === 0) {
    return NextResponse.json(
      { success: false, message: "Aucun solde trouvé pour cet utilisateur" },
      { status: 404 }
    );
  }

  // 🎯 Si year non fourni → on prend le plus récent
  const selectedBalance =
    balances.find((b) => b.year === year) ??
    balances.reduce((latest, current) =>
      current.year > latest.year ? current : latest
    );

  return NextResponse.json({
    success: true,
    balance: selectedBalance,
  });
}
