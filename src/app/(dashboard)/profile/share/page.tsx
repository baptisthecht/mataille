// src/app/(dashboard)/profile/share/page.tsx
import { ShareProfileCard } from "@/components/profile/share-profile-card";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function ShareProfilePage() {
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
      customLink: true,
      image: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Construire l'URL du profil public
  const profileLink = user.customLink || user.username;
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const profileUrl = `${baseUrl}/${profileLink}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Partager mon profil</h1>
        <p className="text-muted-foreground">
          {"Partagez votre profil Sayz avec vos proches pour qu'ils puissent voir vos tailles."}
        </p>
      </div>

      <ShareProfileCard user={user} profileUrl={profileUrl} />
    </div>
  );
}