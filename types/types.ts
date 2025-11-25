
export type Employee = {
  id: number;
  updatedAt?: Date;
  createdAt: Date;
  photo?:string;
  password?:string;
  role:"MANAGER"| "HR" | "USER"
  //Form
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  gender: "Homme" | "Femme";
  nationality: string;
  country: string;
  address: string;
  phone: string;
  maritalStatus: "Célibataire" | "Marié"; // | "Divorcé" | "Veuf"
  childrenCount: number;
  emergencyContact: string;
  // -----------------------------
  // 2️⃣ Informations administratives
  // -----------------------------
  cnpsNumber?: string;
  idType: string; // CNI, Passeport, Permis...
  idNumber: string;
  idIssueDate: Date;
  idExpiryDate: Date;
  idIssuePlace: string;
  idDocumentFile?: File | string; // fichier uploadé ou URL (si déjà stocké
  // -----------------------------
  // 3️⃣ Informations professionnelles
  // -----------------------------
  position: string; // poste occupé
  department: string; // département / service
  supervisorId?: number | null; // employé supérieur hiérarchique
  category: string; // catégorie professionnelle
  level: string; // grade
  startDate: Date; // date d'entrée
  endDate?: Date; // date de fin (si CDD)
  contractType: "CDI" | "CDD" | "Stage" | "Prestation" | "Essai";
  baseSalary: number;
  paymentMode:
    | "Virement bancaire"
    | "Espèces"
    | "Mobile Money"
    | "Chèque"
    | string;
  workLocation:
    | "Siège"
    | "Agence"
    | "Chantier"
    | "Télétravail"
    | "Autre"
    | string;
  workLocationName?: string; // si lieu = "Autre"
  leaveDays: number; // droit de congé annuel
  attachments?: File[] | string[]; // fichiers joints (contrat, etc.)
};
export type HolidayRequestStatus =
  | "PENDING_MANAGER"   // en attente du supérieur
  | "PENDING_HR"        // validé sup, en attente RH
  | "ACCEPTED"
  | "REJECTED";

  export interface HolidayType {
  id: number;
  label: string; // affichage UI
  code: string;  // identifiant technique (ex: "ANNUAL")
  requiresDocument?: boolean;
  subtractFromBalance: boolean; // impact sur solde ?
  maxDaysPerYear?: number;
}

export interface HolidayRequest {
  id: number;
  userId: number;
  typeId: number;
  typeLabel?: string;
  startDate: Date;
  endDate: Date;
  requestedDays: number;
  status: HolidayRequestStatus;
  justificationFile?: string;
  reason?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface EmployeeLeaveBalance {
  userId: number;
  year: number;
  earnedDays: number; // acquis
  usedDays: number; // consommés
  remainingDays: number; // solde
}

export type PresenceFlag =
  | "PRESENT"
  | "LATE"
  | "ABSENT"
  | "EXCEPTIONAL"
  | "FIELD"
  | "ON_LEAVE";

export interface PresenceRecord {
  id: number;
  userId: number;

  date: Date;

  flags: PresenceFlag[]; // plusieurs états possibles

  checkIn?: string;

  justificationFile?: string;
  comment?: string;

  createdAt: Date;
  updatedAt?: Date;
}

//bulletin de paie
export type Payslip = {
  id: number;
  month: number; // 1-12
  year: number;
  downloads: number;
  fileUrl: string;
  createdAt: Date; // pour le filtrage
};

export type Notification = {
  id: number;
  statusType: "info"|"success"|"warning"|"error";
  type?: "DEFAULT"| "LEAVE_REQUEST" | "IS_AWAY";
  status: "UNREAD"| "READ";
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
}
