import { Category } from "@prisma/client";

/**
 * Extension des types NextAuth pour inclure l'ID utilisateur
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      image: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
  }
}

/**
 * Type pour les tailles avec la marque associée
 */
export interface SizeWithBrand {
  id: string;
  userId: string;
  brandId: string | null;
  category: Category;
  value: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  brand: {
    id: string;
    name: string;
    category: Category;
  } | null;
}

/**
 * Type pour les informations utilisateur publiques
 */
export interface PublicUserProfile {
  id: string;
  username: string;
  name: string | null;
  image: string | null;
  customLink: string | null;
  sizes: SizeWithBrand[];
}

/**
 * Type pour la création/mise à jour d'une taille
 */
export interface SizeFormData {
  category: Category;
  brandId: string | null;
  value: string;
  notes?: string;
}