import { filesData } from "@/data/temp";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userIdParam = searchParams.get("userId");

  if (!userIdParam) {
    return NextResponse.json(
      { success: false, message: "userId requis" },
      { status: 400 }
    );
  }

  const userId = Number(userIdParam);
  if (Number.isNaN(userId)) {
    return NextResponse.json(
      { success: false, message: "userId invalide" },
      { status: 400 }
    );
  }

  const myDocs = filesData.filter((f) => f.userId === userId);

  return NextResponse.json({
    success: true,
    items: myDocs,
    count: myDocs.length,
  });
}
