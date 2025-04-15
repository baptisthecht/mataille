// src/app/not-found.tsx
import { MeasuringTapeIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center gap-6 text-center">
      <MeasuringTapeIcon className="h-16 w-16 text-primary" />
      
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">Page non trouvée</h1>
        <p className="text-muted-foreground">
          {"Oups ! La page que vous recherchez n'existe pas ou a été déplacée."}
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/">{"Retour à l'accueil"}</Link>
        </Button>
        <Button asChild>
          <Link href="/profile">Mon profil</Link>
        </Button>
      </div>
    </div>
  );
}