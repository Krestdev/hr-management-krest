// app/api/salarial/[id]/route.ts
import { salarialData } from "@/data/temp";
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

  if (Number.isNaN(numericId)) {
    return NextResponse.json(
      { success: false, message: "ID invalide" },
      { status: 400 }
    );
  }

  const item = salarialData.find((s) => s.id === numericId);

  if (!item) {
    return NextResponse.json(
      { success: false, message: "Fiche salariale introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    item,
  });
}