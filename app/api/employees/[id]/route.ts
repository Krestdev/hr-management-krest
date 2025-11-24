import { demoUsers } from "@/data/temp";
import { NextResponse } from "next/server";


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json(
      { success: false, message: "ID invalide" },
      { status: 400 }
    );
  }

  const employee = demoUsers.find((e) => e.id === id);

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