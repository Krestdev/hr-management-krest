import { string, uuid } from "zod";

export type UserRole = "COMPANY_ADMIN" | "SUPER_ADMIN" | "ADMIN" | "EMPLOYEE";

export type Employee = {
  uuid: string;
  employeeId?: string;
  updatedAt?: string;
  createdAt?: string;
  photo?: string;
  password?: string;
  role: UserRole;
  status: string;
  isActive: boolean;
  //Form
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  gender: "MALE" | "FEMALE";
  nationality: string;
  countryOfResidence: string;
  address: string;
  phoneNumber: string;
  matrimonial_status: number; // 0 = célibataire, 1 = marié(e)
  number_of_children: number;
  EmergencyContactPhone?: string;
  // -----------------------------
  // 2️⃣ Informations administratives
  // -----------------------------
  CNPSNumber?: string;
  idDocumentType: string; // CNI, Passeport, Permis...
  idDocumentNumber: string;
  idDocumentIssueDate: Date;
  idDocumentExpiryDate: Date;
  idDocumentIssuePlace: string;
  idDocumentFileUrl?: File | string;
  contracts?: {
    baseSalary: number;
    contract_type: string
  }[];
  user: {
    uuid: string
    email: string
  };
  // -----------------------------
  // 3️⃣ Informations professionnelles
  // -----------------------------
  companyId: string;
  position: string[]; // poste occupé
  department: string[]; // département / service
  supervisorId?: string | null; // employé supérieur hiérarchique
  category: string; // catégorie professionnelle
  grade: string; // Échelon
  hireDate: Date; // date d'entrée
  endDate: Date; // date de fin (si CDD)
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
  autorizedLeaves: number[]; // type de congés autorisés
  attachments?: File[] | string[]; // fichiers joints (contrat, etc.)
};
export type HolidayRequestStatus = "PENDING_MANAGER" | "PENDING_HR" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export interface HolidayType {
  id: number;
  label: string; // affichage UI
  code: string; // identifiant technique (ex: "ANNUAL")
  requiresDocument?: boolean;
  subtractFromBalance: boolean; // impact sur solde ?
  maxDaysPerYear?: number;
}

export interface HolidayRequest {
  id: number;
  userId: string;
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
  userId: string;
  year: number;
  earnedDays: number; // acquis
  usedDays: number; // consommés
  remainingDays: number; // solde
}

export type PresenceFlag =
  | "PRESENT"
  | "ABSENT"
  | "LATE"
  | "ON_LEAVE"
  | "FIELD"
  | "EXCEPTIONAL"
  | "VALID"
  | "EXCUSED";

export interface PresenceRecord {
  id: number;
  userId: string;

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
  statusType: "info" | "success" | "warning" | "error";
  type?: "DEFAULT" | "LEAVE_REQUEST" | "IS_AWAY";
  status: "UNREAD" | "READ";
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
};

export type Files = {
  id: number;
  title: string;
  url: string;
  userId: string;
  createdAt: string;
  updatedAt?: string;
};

type Montant = {
  montant: number;
  type: "INDEMNITE" | "PRIME" | "AVANTAGE";
  est_taxable: boolean;
  est_cotisable: boolean;
};

export type Salarial = {
  id: number;
  userId: string;
  salaire_base: Montant;
  indem_transport: Montant;
  indem_representation: Montant;
  prime_outil: Montant;
  prime_responsable: Montant;
  prime_gestion: Montant;
  logement: Montant;
  nourriture: Montant;
  vehicule: Montant;
  domestique: Montant;
  electricite: Montant;
  eau: Montant;
  carburant: Montant;
  telephone: Montant;
  gardiennage: Montant;
  internet: Montant;
};

export type LeavesType = {
  id: number;
  label: string;
  value: number;
  code:
  | "ANNUAL"
  | "SICK"
  | "ERRAND"
  | "MATERNITY"
  | "PATERNITY"
  | "MARRIAGE"
  | "BREAST-FEEDING"
  | "BEREAVEMENT";
  createdAt: Date;
  updatedAt?: Date;
};

export type Leaves = {
  id: number;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "IN PROGRESS";
  type: LeavesType["code"];
  days: number;
  reason: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt?: Date;
};

export type Presence = {
  uuid: string;
  checkIn: string;
  checkOut?: string | null;
  latitude?: number;
  longitude?: number;
  workedHour?: number;
  overtimes?: number;
  status: PresenceFlag[];
  location?: string | null;
  mission?: string | null;
  observations?: string | null;
  createdAt: string;
  updatedAt?: string;
  employeeId: string;
  payrollUuid?: string | null;
  employee?: {
    uuid: string;
    firstName: string;
    lastName: string;
    position: string;
    user: {
      email: string;
    };
  };
};

export type Department = {
  uuid: string;
  name: string;
  description?: string;
  isActive: boolean;
  companyId: string;
  employees?: Employee;
  createdAt?: Date;
  updatedAt?: Date;
}

export type Position = {
  uuid: string;
  title: string;
  description?: string;
  level: number;
  departmentUuid: string;
  employeeUuid?: Employee;
  permissionUuids?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type Contracts = {
  uuid: string;
  startDate: string;
  endDate: string;
  contract_type: string;
  status: string;
  baseSalary: string;
  currency: string;
  terminationReason: number;
  expiryAlertSent: boolean;
  employeeId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string
}

export type Company = {
  uuid: string;
  name: string;
  description: string;
  isActive: boolean;
  departments: Department[];
  contracts: Contracts[];
  employees: Employee[];
  createdAt: string;
  updatedAt: string
}

export type Recruitment = {
  uuid: string;
  title: string;
  description?: string;
  status: string;
  criteria: string[];
  tags: string[];
  companyId: string;
  imageUrl: string;
  place: string;
  deadline: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Candidacy {
  uuid?: string;

  fullName: string;
  phone: string;
  email: string;
  address: string;
  recruitmentUuid: string;

  identityCard: string;
  cv: string;
  degree?: string;
  coverLetter?: string;

  status?: "PENDING" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";

  createdAt?: Date;
  updatedAt?: Date;
}

export const roleColors: Record<string, string> = {
  "SUPER_ADMIN": "bg-purple-600 hover:bg-purple-700 text-white border-transparent",
  "ADMIN": "bg-purple-600 hover:bg-purple-700 text-white border-transparent",
  "COMPANY_ADMIN": "bg-blue-600 hover:bg-blue-700 text-white border-transparent",
  "EMPLOYEE": "bg-gray-100 hover:bg-gray-200 text-gray-800 border-transparent",
}

export const roleLabels: Record<string, string> = {
  "SUPER_ADMIN": "Super Admin",
  "ADMIN": "RH",
  "COMPANY_ADMIN": "Admin Société",
  "EMPLOYEE": "Employé",
}