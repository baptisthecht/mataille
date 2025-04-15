// src/app/(main)/[username]/page.tsx
import { PublicSizesList } from "@/components/profile/public-sizes-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getInitials } from "@/lib/utils";
import { Category } from "@prisma/client";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    username: string;
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = params;

  // Rechercher l'utilisateur par nom d'utilisateur ou lien personnalisé
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { customLink: username },
      ],
    },
    include: {
      sizes: {
        include: {
          brand: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Organiser les tailles par catégorie - en utilisant des types explicites
  const clothingSizes = user.sizes.filter(size => size.category === Category.CLOTHING);
  const shoesSizes = user.sizes.filter(size => size.category === Category.SHOES);
  const pantsSizes = user.sizes.filter(size => size.category === Category.PANTS);
  const shirtsSizes = user.sizes.filter(size => size.category === Category.SHIRTS);
  const watchesSizes = user.sizes.filter(size => size.category === Category.WATCHES);
  const otherSizes = user.sizes.filter(size => 
    size.category !== Category.CLOTHING && 
    size.category !== Category.SHOES && 
    size.category !== Category.PANTS && 
    size.category !== Category.SHIRTS && 
    size.category !== Category.WATCHES
  );

  // Créer un objet pour les catégories et leurs tailles
  const categoriesWithSizes = [
    { key: "clothing", label: "Vêtements", sizes: clothingSizes },
    { key: "shoes", label: "Chaussures", sizes: shoesSizes },
    { key: "pants", label: "Pantalons", sizes: pantsSizes },
    { key: "shirts", label: "Chemises/Hauts", sizes: shirtsSizes },
    { key: "watches", label: "Montres", sizes: watchesSizes },
    { key: "other", label: "Autres", sizes: otherSizes },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || undefined} alt={user.name || ""} />
              <AvatarFallback className="text-lg">{getInitials(user.name || "")}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-center text-2xl sm:text-left">
                {user.name}
              </CardTitle>
              <p className="text-center text-muted-foreground sm:text-left">
                Les tailles de {user.name || "cet utilisateur"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {categoriesWithSizes.map(
              ({ key, label, sizes }) =>
                sizes.length > 0 && (
                  <div key={key} className="space-y-4">
                    <h3 className="font-medium capitalize">{label}</h3>
                    <PublicSizesList sizes={sizes} />
                  </div>
                )
            )}

            {user.sizes.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium">
                  Aucune taille disponible
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {user.name || "Cet utilisateur"} {"n'a pas encore ajouté de tailles à son profil."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}