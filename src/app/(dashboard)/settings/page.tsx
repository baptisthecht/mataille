// src/app/(dashboard)/settings/page.tsx
import { UserSettingsForm } from "@/components/profile/user-settings-form";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Récupérer les informations utilisateur
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      customLink: true,
      image: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Paramètres du profil</h1>
        <p className="text-muted-foreground">
          Personnalisez vos informations et paramètres de compte.
        </p>
      </div>

      <UserSettingsForm user={user} />
    </div>
  );
}