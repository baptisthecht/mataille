// src/app/(dashboard)/profile/page.tsx
import { AddSizeButton } from "@/components/profile/add-size-button";
import { ProfileHeader } from "@/components/profile/profile-header";
import { SizesList } from "@/components/profile/sizes-list";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatUsername } from "@/lib/utils";
import { Category } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Vérifier si l'utilisateur a déjà un nom d'utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
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
    redirect("/login");
  }

  // Si l'utilisateur n'a pas encore de nom d'utilisateur, en créer un
  if (!user.username) {
    // Générer un nom d'utilisateur à partir du nom complet ou de l'email
    let username = "";
    if (user.name) {
      username = formatUsername(user.name.replace(/\s+/g, "").toLowerCase());
    } else if (user.email) {
      username = formatUsername(user.email.split("@")[0].toLowerCase());
    }

    // Vérifier si le nom d'utilisateur existe déjà
    let existingUser = await prisma.user.findUnique({
      where: { username },
    });

    // Si le nom d'utilisateur existe déjà, ajouter un nombre à la fin
    if (existingUser) {
      let i = 1;
      while (existingUser) {
        const newUsername = `${username}${i}`;
        existingUser = await prisma.user.findUnique({
          where: { username: newUsername },
        });

        if (!existingUser) {
          username = newUsername;
          break;
        }
        i++;
      }
    }

    // Mettre à jour l'utilisateur avec le nouveau nom d'utilisateur
    await prisma.user.update({
      where: { id: user.id },
      data: { username },
    });

    // Mettre à jour également le customLink
    await prisma.user.update({
      where: { id: user.id },
      data: { customLink: username },
    });
  }

  // Organiser les tailles par catégorie
  const sizesByCategory = {
    clothing: user.sizes.filter((size) => size.category === Category.CLOTHING),
    shoes: user.sizes.filter((size) => size.category === Category.SHOES),
    pants: user.sizes.filter((size) => size.category === Category.PANTS),
    shirts: user.sizes.filter((size) => size.category === Category.SHIRTS),
    watches: user.sizes.filter((size) => size.category === Category.WATCHES),
    other: user.sizes.filter(
      (size) =>
        ![
          Category.CLOTHING,
          Category.SHOES,
          Category.PANTS,
          Category.SHIRTS,
          Category.WATCHES,
        ].includes(size.category)
    ),
  };

  const publicProfileUrl = `${process.env.NEXTAUTH_URL}/${user.username || user.customLink}`;

  return (
    <div className="space-y-6">
      <ProfileHeader
        user={user}
        publicProfileUrl={publicProfileUrl}
      />

      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Mes tailles</h2>
          <AddSizeButton />
        </div>

        {Object.entries(sizesByCategory).map(
          ([category, sizes]) =>
            sizes.length > 0 && (
              <div key={category} className="space-y-4">
                <h3 className="font-medium capitalize">
                  {category === "clothing"
                    ? "Vêtements"
                    : category === "shoes"
                    ? "Chaussures"
                    : category === "pants"
                    ? "Pantalons"
                    : category === "shirts"
                    ? "Chemises/Hauts"
                    : category === "watches"
                    ? "Montres"
                    : "Autres"}
                </h3>
                <SizesList sizes={sizes} />
              </div>
            )
        )}

        {user.sizes.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-medium">
             {" Vous n'avez pas encore ajouté de tailles"}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Ajoutez vos premières tailles pour les partager avec vos proches.
            </p>
            <AddSizeButton variant="default" />
          </div>
        )}
      </div>
    </div>
  );
}