// app/api/leaves/user/[id]/route.ts
import { leavesData } from "@/data/temp";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;  // Must be 'id' because the folder is [id]
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { id } = await params;
  const userId = Number(id);  // The URL parameter is 'id' but we're using it as userId

  console.log("Utilisateur", userId);

  // ✅ filtrer par userId
  const leaves = leavesData.filter((l) => l.userId === userId);

  if (!leaves.length) {
    return NextResponse.json(
      {
        success: false,
        message: "No leaves found for this user",
        items: [],
        count: 0,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    items: leaves,
    count: leaves.length,
  });
}