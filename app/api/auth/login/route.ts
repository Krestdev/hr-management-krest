// app/api/auth/login/route.ts
import { User } from "@/types/types";
import { NextResponse } from "next/server";

// --- Base d'utilisateurs fictifs ---
const demoUsers: Array<User & { password: string }> = [
  {
    id: 1,
    firstName: "Jean",
    lastName: "Dupont",
    email: "admin@example.com",
    password: "admin123", // 👈 mot de passe démo
    gender: "Homme",
    birthDate: new Date("1990-05-12"),
    nationality: "Camerounaise",
    country: "Cameroun",
    address: "Douala - Akwa",
    phone: "+237650000000",
    maritalStatus: "Célibataire",
    childrenCount: 0,
    emergencyContact: "+237699999999",
    cnpsNumber: "CNPS123456",
    idType: "CNI",
    idNumber: "123456789",
    idIssueDate: new Date("2015-06-01"),
    idExpiryDate: new Date("2030-06-01"),
    idIssuePlace: "Douala",
    position: "Administrateur RH",
    department: "Ressources humaines",
    supervisorId: null,
    category: "A",
    level: "Cadre",
    startDate: new Date("2022-01-01"),
    contractType: "CDI",
    baseSalary: 450000,
    paymentMode: "Virement bancaire",
    workLocation: "Siège",
    leaveDays: 24,
    attachments: [],
    createdAt: new Date(),
    photo: "/avatar-admin.png",
  },
  {
    id: 2,
    firstName: "Marie",
    lastName: "Nkem",
    email: "employee@example.com",
    password: "employee123",
    gender: "Femme",
    birthDate: new Date("1995-10-25"),
    nationality: "Camerounaise",
    country: "Cameroun",
    address: "Yaoundé - Bastos",
    phone: "+237690111222",
    maritalStatus: "Marié",
    childrenCount: 2,
    emergencyContact: "+237699888777",
    idType: "CNI",
    idNumber: "987654321",
    idIssueDate: new Date("2017-08-10"),
    idExpiryDate: new Date("2032-08-10"),
    idIssuePlace: "Yaoundé",
    position: "Comptable",
    department: "Finance",
    supervisorId: 1,
    category: "B",
    level: "Chargée",
    contractType: "CDD",
    startDate: new Date("2023-03-01"),
    endDate: new Date("2025-03-01"),
    baseSalary: 300000,
    paymentMode: "Mobile Money",
    workLocation: "Agence",
    leaveDays: 22,
    attachments: [],
    createdAt: new Date(),
    photo: "/avatar-employee.png",
  },
];

// --- API LOGIN ---

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    const user = demoUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Identifiants incorrects" },
        { status: 401 }
      );
    }

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: "fake-jwt-token-" + user.id, // 👉 tu pourras remplacer par un vrai token plus tard
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}
