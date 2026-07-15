import {
  Building02Icon,
  DashboardSquare02Icon,
  UserGroupIcon,
  UserCircleIcon,
  File02Icon,
  FolderLibraryIcon,
  CalendarUserIcon,
  ComputerUserIcon,
  File01Icon,
  UserSquareIcon,
  CheckListIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIconProps } from "@hugeicons/react";

export const PUBLIC_ROUTES = ["/connexion", "/recuperation-compte"];
export const PROTECTED_ROUTES = ["/tableau-de-bord"];

interface SidebarLinkProps {
  href: string;
  title: string;
  icon: HugeiconsIconProps["icon"];
  badge?: number;
}

// ============================================
// GROUPE 1: HOLDING
// ============================================
export const HOLDING_ROUTES: Array<SidebarLinkProps> = [
  {
    href: "/tableau-de-bord",
    title: "Tableau de bord",
    icon: DashboardSquare02Icon,
  },
  {
    href: "/tableau-de-bord/societes",
    title: "Sociétés",
    icon: Building02Icon,
  },
  {
    href: "/tableau-de-bord/utilisateurs",
    title: "Utilisateurs",
    icon: UserGroupIcon,
  },
  {
    href: "/tableau-de-bord/referentiels",
    title: "Référentiels",
    icon: FolderLibraryIcon,
  },
];

// ============================================
// GROUPE 2: COMPAGNIE
// ============================================
export const COMPAGNIE_ROUTES: Array<SidebarLinkProps> = [
  {
    href: "/tableau-de-bord/employes",
    title: "Employés",
    icon: UserCircleIcon,
  },
  {
    href: "/tableau-de-bord/conges-absences",
    title: "Congés & Absences",
    icon: CalendarUserIcon,
    badge: 8
  },
  {
    href: "/tableau-de-bord/presences",
    title: "Présences",
    icon: ComputerUserIcon,
  },
  {
    href: "/tableau-de-bord/paie-dipe",
    title: "Paie (DIPE)",
    icon: File02Icon,
  },
  {
    href: "/tableau-de-bord/recrutement",
    title: "Recrutement",
    icon: UserGroupIcon,
    badge: 30
  },
  {
    href: "/tableau-de-bord/rapports",
    title: "Rapports",
    icon: File01Icon,
  },
  {
    href: "/tableau-de-bord/documents",
    title: "Documents",
    icon: FolderLibraryIcon,
  },
];

// ============================================
// GROUPE 3: MON PROFIL
// ============================================
export const MON_PROFIL_ROUTES: Array<SidebarLinkProps> = [
  {
    href: "/tableau-de-bord/mon-profil",
    title: "Mon Profil",
    icon: UserSquareIcon,
  },
  {
    href: "/tableau-de-bord/mes-presences",
    title: "Mes présences",
    icon: CheckListIcon,
  },
  {
    href: "/tableau-de-bord/mes-conges",
    title: "Mes congés",
    icon: CalendarUserIcon,
  },
  {
    href: "/tableau-de-bord/mes-bulletins",
    title: "Mes bulletins de paie",
    icon: File01Icon,
  },
  {
    href: "/tableau-de-bord/mes-documents",
    title: "Mes documents",
    icon: FolderLibraryIcon,
  },
  {
    href: "/tableau-de-bord/informations-personnelles",
    title: "Informations personnelles",
    icon: UserSquareIcon,
  },
];

// ============================================
// BASE_ROUTES avec les 3 groupes
// ============================================
export const BASE_ROUTES: Array<SidebarLinkProps> = [
  ...HOLDING_ROUTES,
  ...COMPAGNIE_ROUTES,
  ...MON_PROFIL_ROUTES,
];
