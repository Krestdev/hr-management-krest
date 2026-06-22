import { demoUsers } from "@/data/temp";
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

  if (isNaN(numericId)) {
    return NextResponse.json(
      { success: false, message: "ID invalide" },
      { status: 400 }
    );
  }

  const employee = demoUsers.find((e) => e.uuid === id);

  if (!employee) {
    return NextResponse.json(
      { success: false, message: "Employé introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    user: employee,
  });
}