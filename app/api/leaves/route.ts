// app/api/leaves/route.ts
import { leavesData } from "@/data/temp";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    items: leavesData,
    count: leavesData.length,
  });
}
