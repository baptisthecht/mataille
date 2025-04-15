import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine et optimise les classes CSS avec Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Génère un slug à partir d'un texte
 */
export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/**
 * Formate un nom d'utilisateur valide
 */
export function formatUsername(username: string) {
  return username
    .toLowerCase()
    .trim()
    .replace(/[^\w\-\.]/g, "")
    .replace(/\.+/g, ".")
    .replace(/\-+/g, "-");
}

/**
 * Obtient les initiales d'un nom
 */
export function getInitials(name: string) {
  if (!name) return "";
  const words = name.split(" ");
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}