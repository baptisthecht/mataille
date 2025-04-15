// src/app/(dashboard)/profile/clothes/page.tsx
import { AddSizeButton } from "@/components/profile/add-size-button";
import { SizesList } from "@/components/profile/sizes-list";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Category } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ClothesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Récupérer les tailles de vêtements de l'utilisateur
  const clothingSizes = await prisma.size.findMany({
    where: {
      userId: session.user.id,
      category: {
        in: [Category.CLOTHING, Category.SHIRTS, Category.PANTS, Category.JACKETS],
      },
    },
    include: {
      brand: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Organiser les tailles par catégorie
  const sizesByCategory = {
    [Category.CLOTHING]: clothingSizes.filter(size => size.category === Category.CLOTHING),
    [Category.SHIRTS]: clothingSizes.filter(size => size.category === Category.SHIRTS),
    [Category.PANTS]: clothingSizes.filter(size => size.category === Category.PANTS),
    [Category.JACKETS]: clothingSizes.filter(size => size.category === Category.JACKETS),
  };

const categoryLabels = {
  [Category.CLOTHING]: "Vêtements (général)",
  [Category.SHIRTS]: "Hauts / T-shirts",
  [Category.PANTS]: "Pantalons / Jeans",
  [Category.SHOES]: "Chaussures",
  [Category.JACKETS]: "Vestes / Manteaux",
  [Category.UNDERWEAR]: "Sous-vêtements",
  [Category.HATS]: "Chapeaux / Casquettes",
  [Category.WATCHES]: "Montres",
  [Category.RINGS]: "Bagues",
  [Category.DRESSES]: "Robes",
  [Category.GLOVES]: "Gants",
  [Category.SOCKS]: "Chaussettes",
  [Category.BRACELETS]: "Bracelets",
  [Category.NECKLACES]: "Colliers",
  [Category.OTHER]: "Autre",
};


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes vêtements</h1>
        <AddSizeButton />
      </div>

      {Object.entries(sizesByCategory).map(([category, sizes]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold">{categoryLabels[category as Category]}</h2>
          
          {sizes.length > 0 ? (
            <SizesList sizes={sizes} />
          ) : (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="mb-4 text-muted-foreground">
                {"Vous n'avez pas encore ajouté de tailles pour cette catégorie."}
              </p>
              <Button asChild>
                <Link href="/profile/add-size">Ajouter une taille</Link>
              </Button>
            </div>
          )}
        </div>
      ))}

      {clothingSizes.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">
            {"Vous n'avez pas encore ajouté de tailles de vêtements"}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Ajoutez vos premières tailles pour les partager avec vos proches.
          </p>
          <AddSizeButton variant="default" />
        </div>
      )}
    </div>
  );
}