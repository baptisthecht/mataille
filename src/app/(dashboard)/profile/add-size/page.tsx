// src/app/(dashboard)/profile/add-size/page.tsx
import { AddSizeForm } from "@/components/profile/add-size-form";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Brand, Category } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function AddSizePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Récupérer toutes les marques pour les options du formulaire
  const brands = await prisma.brand.findMany({
    orderBy: {
      name: "asc",
    },
  });

  // Organiser les marques par catégorie
const brandsByCategory: Record<Category, Brand[]> = brands.reduce(
  (acc, brand) => {
    if (!acc[brand.category]) {
      acc[brand.category] = [];
    }
    acc[brand.category].push(brand);
    return acc;
  },
  {} as Record<Category, Brand[]>
);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ajouter une nouvelle taille</h1>
        <p className="text-muted-foreground">
          Remplissez le formulaire ci-dessous pour ajouter une nouvelle taille à votre profil.
        </p>
      </div>

      <AddSizeForm
        userId={session.user.id}
        brandsByCategory={brandsByCategory}
      />
    </div>
  );
}