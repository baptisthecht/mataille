// src/app/(dashboard)/profile/shoes/page.tsx
import { SizesList } from "@/components/profile/sizes-list";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Category } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ShoesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Récupérer les tailles de chaussures de l'utilisateur
  const shoesSizes = await prisma.size.findMany({
    where: {
      userId: session.user.id,
      category: Category.SHOES,
    },
    include: {
      brand: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mes chaussures</h1>
        <Button asChild variant="default">
          <Link href={`/profile/add-size?category=${Category.SHOES}`}>
            Ajouter une pointure
          </Link>
        </Button>
      </div>

      {shoesSizes.length > 0 ? (
        <SizesList sizes={shoesSizes} />
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">
           {"Vous n'avez pas encore ajouté de pointures"}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Ajoutez vos pointures pour que vos proches puissent vous offrir des chaussures à la bonne taille.
          </p>
          <Button asChild variant="default">
            <Link href={`/profile/add-size?category=${Category.SHOES}`}>
              Ajouter une pointure
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}