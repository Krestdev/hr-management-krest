// app/api/holidays/requests/route.ts
import { demoHolidayRequests, demoHolidayTypes } from "@/data/temp";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");
  const yearParam = searchParams.get("year");

  let filtered = demoHolidayRequests;

  if (userIdParam) {
    const userId = Number(userIdParam);
    if (!isNaN(userId)) {
      filtered = filtered.filter((r) => r.userId === userId);
    }
  }

  // éventuellement filtrer par année (sur la date de début)
  if (yearParam) {
    const year = Number(yearParam);
    if (!isNaN(year)) {
      filtered = filtered.filter(
        (r) => r.startDate.getFullYear() === year
      );
    }
  }

  // on join les types pour faciliter l'affichage
  const withType = filtered.map((r) => {
    const type = demoHolidayTypes.find((t) => t.id === r.typeId);
    return {
      ...r,
      typeLabel: type?.label ?? "Type inconnu",
      typeCode: type?.code,
    };
  });

  return NextResponse.json({
    success: true,
    items: withType,
    count: withType.length,
  });
}
