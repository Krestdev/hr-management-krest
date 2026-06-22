import { string, uuid } from "zod";

export type Employee = {
  uuid: string;
  employeeId?: string;
  updatedAt?: string;
  createdAt?: string;
  photo?: string;
  password?: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
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
  id: number;
  userId: string;
  date: string;
  statut: PresenceFlag[];
  createdAt: string;
  updatedAt?: string;
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
