// app/api/leaves/mine/route.ts
import { leavesData } from "@/data/temp";
import { NextResponse } from "next/server";

/**
 * ⚠️ Simulation user connecté
 * Plus tard tu remplaceras par auth() / session / token
 */
const MOCK_USER_ID = 1;

export async function GET() {
  const myLeaves = leavesData.filter(
    (l) => l.userId === MOCK_USER_ID
  );

  return NextResponse.json({
    success: true,
    items: myLeaves,
    count: myLeaves.length,
  });
}
