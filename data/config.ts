import {
  CalendarUserIcon,
  CheckListIcon,
  ComputerUserIcon,
  DashboardSquare02Icon,
  File01Icon,
  File02Icon,
  FolderLibraryIcon,
  Notification01Icon,
  UserGroupIcon,
  UserSquareIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIconProps } from "@hugeicons/react";

export const PUBLIC_ROUTES = ["/connexion", "/recuperation-compte"];
export const PROTECTED_ROUTES = ["/tableau-de-bord"];

interface sidebarLinkProps {
  href: string;
  title: string;
  icon: HugeiconsIconProps["icon"];
  isAdmin?: boolean;
}

export const BASE_ROUTES: Array<sidebarLinkProps> = [
  // Dashboard
  {
    href: "/tableau-de-bord",
    title: "Tableau de bord",
    icon: DashboardSquare02Icon,
  },

  // ----------------------------
  // Administration
  // ----------------------------
  {
    href: "/tableau-de-bord/employes",
    title: "Gestion des employés",
    icon: UserGroupIcon,
    isAdmin: true,
  },
  {
    href: "/tableau-de-bord/conges",
    title: "Gestion des congés",
    icon: CalendarUserIcon,
    isAdmin: true,
  },
  {
    href: "/tableau-de-bord/presences",
    title: "Gestion des présences",
    icon: ComputerUserIcon,
    isAdmin: true,
  },
  {
    href: "/tableau-de-bord/dipe",
    title: "DIPE",
    icon: File02Icon,
    isAdmin: true,
  },
  {
    href: "/tableau-de-bord/documents",
    title: "Documents",
    icon: FolderLibraryIcon,
    isAdmin: true,
  },

  // ----------------------------
  // Employé (staff)
  // ----------------------------
  {
    href: "/tableau-de-bord/mes-conges",
    title: "Mes congés",
    icon: CalendarUserIcon,
  },
  {
    href: "/tableau-de-bord/mes-presences",
    title: "Mes présences",
    icon: CheckListIcon,
  },
  {
    href: "/tableau-de-bord/mes-bulletins",
    title: "Mes bulletins de paie",
    icon: File01Icon,
  },
  {
    href: "/tableau-de-bord/profil",
    title: "Mon profil",
    icon: UserSquareIcon,
  },
  {
    href: "/tableau-de-bord/notifications",
    title: "Notifications",
    icon: Notification01Icon,
  },
  {
    href: "/tableau-de-bord/mes-documents",
    title: "Mes documents",
    icon: FolderLibraryIcon,
  }
];
