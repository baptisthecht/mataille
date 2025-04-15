// src/components/profile/share-profile-card.tsx
"use client";

import { CopyIcon, ShareIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useState } from "react";

interface ShareProfileCardProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    customLink: string | null;
    image: string | null;
  };
  profileUrl: string;
}

export function ShareProfileCard({ user, profileUrl }: ShareProfileCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setIsCopied(true);
    toast({
      title: "Lien copié !",
      description: "Le lien de votre profil a été copié dans le presse-papier.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleShareLink = () => {
    // Vérifier si l'API de partage Web est disponible
    if (navigator.share) {
      navigator.share({
        title: `Tailles de ${user.name || "un utilisateur"} sur MaTaille`,
        text: `Consultez mes tailles sur MaTaille pour ne plus offrir de cadeaux de la mauvaise taille !`,
        url: profileUrl,
      })
      .then(() => {
        toast({
          title: "Partage réussi",
          description: "Votre profil a été partagé avec succès.",
        });
      })
      .catch((error) => {
        console.error("Erreur lors du partage:", error);
      });
    } else {
      // Sinon, copier simplement le lien
      handleCopyLink();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lien de profil public</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={profileUrl}
            readOnly
            className="flex-1 font-mono text-sm"
            onClick={(e) => e.currentTarget.select()}
          />
          <Button variant="outline" onClick={handleCopyLink}>
            <CopyIcon className="mr-2 h-4 w-4" />
            {isCopied ? "Copié !" : "Copier"}
          </Button>
        </div>

        <div className="rounded-md bg-muted p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1 space-y-1">
              <h3 className="font-medium">Partagez votre profil</h3>
              <p className="text-sm text-muted-foreground">
                {"Envoyez ce lien à vos proches avant un anniversaire ou une fête pour qu'ils puissent voir vos tailles."}
              </p>
            </div>
            <Button onClick={handleShareLink}>
              <ShareIcon className="mr-2 h-4 w-4" />
              Partager
            </Button>
          </div>
        </div>

        <div className="rounded-md bg-primary/10 p-4">
          <h3 className="mb-2 font-medium text-primary">{"Comment l'utiliser ?"}</h3>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>Partagez votre lien avec vos amis et votre famille</li>
            <li>Ils pourront voir toutes vos tailles sans avoir à créer de compte</li>
            <li>Plus besoin de deviner les tailles pour les cadeaux !</li>
            <li>{"Mettez à jour vos tailles régulièrement pour qu'elles restent précises"}</li>
          </ul>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            Votre lien personnel: <strong>{profileUrl.split("/").pop()}</strong>
          </p>
          <p className="mt-1">
            Vous pouvez modifier ce lien dans les{" "}
            <Link href="/settings" className="text-primary underline">
              paramètres de votre compte
            </Link>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  );
}