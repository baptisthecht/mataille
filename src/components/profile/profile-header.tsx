// src/components/profile/profile-header.tsx
"use client";

import { CopyIcon, EditIcon, ShareIcon } from "@/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    image: string | null;
    customLink: string | null;
  };
  publicProfileUrl: string;
}

export function ProfileHeader({ user, publicProfileUrl }: ProfileHeaderProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicProfileUrl);
    setIsCopied(true);
    toast({
      title: "Lien copié !",
      description: "Le lien de votre profil a été copié dans le presse-papier.",
    });
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <Avatar className="h-20 w-20 border-2 border-primary/10">
          <AvatarImage src={user.image || undefined} alt={user.name || ""} />
          <AvatarFallback className="text-lg">{getInitials(user.name || "")}</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">@{user.username || user.customLink}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <CopyIcon className="mr-2 h-4 w-4" />
                {isCopied ? "Copié !" : "Copier le lien"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copier le lien de votre profil public</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Link href="/profile/share">
          <Button variant="default" size="sm">
            <ShareIcon className="mr-2 h-4 w-4" />
            Partager mon profil
          </Button>
        </Link>

        <Link href="/settings">
          <Button variant="ghost" size="sm">
            <EditIcon className="mr-2 h-4 w-4" />
            Modifier le profil
          </Button>
        </Link>
      </div>
    </Card>
  );
}