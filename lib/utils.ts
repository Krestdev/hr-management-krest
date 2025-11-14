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