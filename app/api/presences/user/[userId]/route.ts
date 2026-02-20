// app/api/presences/user/[userId]/route.ts
import { presencesData } from "@/data/temp";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    userId: string;  // The parameter name matches the folder [userId]
  }>;
};

export async function GET(
  request: NextRequest,  // Use NextRequest instead of Request
  { params }: Params
) {
  const { userId } = await params;  // Await the params Promise
  const numericUserId = Number(userId);

  console.log("Utilisateur", numericUserId);

  // Filtrer par userId
  const presences = presencesData.filter((p) => p.userId === numericUserId);

  if (!presences.length) {
    return NextResponse.json(
      {
        success: false,
        message: "No presences found for this user",
        items: [],
        count: 0,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    items: presences,
    count: presences.length,
  });
}