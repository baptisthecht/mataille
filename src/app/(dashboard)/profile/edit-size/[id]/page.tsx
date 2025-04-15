// src/app/(dashboard)/profile/edit-size/[id]/page.tsx
import { EditSizeForm } from "@/components/profile/edit-size-form";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function EditSizePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  // Récupérer la taille à éditer
  const size = await prisma.size.findUnique({
    where: { id },
    include: {
      brand: true,
    },
  });

  // Vérifier que la taille existe et appartient à l'utilisateur connecté
  if (!size || size.userId !== session.user.id) {
    notFound();
  }

  // Récupérer toutes les marques pour les options du formulaire
  const brands = await prisma.brand.findMany({
    where: {
      category: size.category,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Modifier la taille</h1>
        <p className="text-muted-foreground">
          Mettez à jour les informations de taille pour {size.brand?.name || "cette marque"}.
        </p>
      </div>

      <EditSizeForm size={size} brands={brands} />
    </div>
  );
}