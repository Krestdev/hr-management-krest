import { PresenceFlag } from "@/types/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name?: string): string {
  if (!name) return "?";

  // Normalize (remove accents) + trim spaces
  const cleaned = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  // Split words and filter empty parts
  const parts = cleaned.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "?";

  // Take first letter of first two words (or first if only one)
  const initials =
    parts.length === 1
      ? parts[0][0]
      : parts[0][0] + parts[1][0];

  return initials.toUpperCase();
}

export function formatDate(value: string | Date) {
  const d = value instanceof Date ? value : new Date(value);
  return d.toLocaleDateString("fr-FR");
}

export const PRESENCE_FLAGS: { value: PresenceFlag; label: string }[] = [
  { value: "PRESENT", label: "Présent" },
  { value: "LATE", label: "Retard" },
  { value: "ABSENT", label: "Absent" },
  { value: "EXCEPTIONAL", label: "Exceptionnelle" },
  { value: "FIELD", label: "Terrain" },
  { value: "ON_LEAVE", label: "Congé" },
];

export function getYearsOfService(startDate: Date | string): number {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  const years = diff / (1000 * 60 * 60 * 24 * 365.25);
  return Math.max(0, years);
}

export function formatSeniority(startDate: Date | string): string {
const years = getYearsOfService(startDate);

if (years < 1) return "Moins d'un an";
if (years < 2) return "1 an";
if (years < 3) return "2 ans";
if (years < 5) return `${Math.floor(years)} ans`;
if (years < 10) return "Entre 5 et 10 ans";
return "Plus de 10 ans";
}

export function formatSalary(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(amount);
}

