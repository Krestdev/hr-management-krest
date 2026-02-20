// app/api/leaves/[id]/route.ts
import { leavesData } from "@/data/temp";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  const { id } = await params;
  const numericId = Number(id);

  const leave = leavesData.find((l) => l.id === numericId);

  if (!leave) {
    return NextResponse.json(
      { success: false, message: "Leave not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    item: leave,
  });
}