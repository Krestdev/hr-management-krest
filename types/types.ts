
export type Employee = {
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

export interface User extends Employee {
  id: number;
  updatedAt?: Date;
  createdAt: Date;
  photo?:string;
}