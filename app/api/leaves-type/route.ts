import { leavesTypeData } from "@/data/temp";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    items: leavesTypeData,
    count: leavesTypeData.length,
  });
}