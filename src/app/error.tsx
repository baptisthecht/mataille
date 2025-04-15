'use client';

import { MeasuringTapeIcon } from '@/components/shared/icons';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Journalisation des erreurs côté client
    console.error(error);
  }, [error]);

  return (
    <div className="container flex h-screen flex-col items-center justify-center gap-6 text-center">
      <MeasuringTapeIcon className="h-16 w-16 text-primary" />
      
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">Une erreur est survenue</h1>
        <p className="text-muted-foreground">
          {"Nous sommes désolés, quelque chose s'est mal passé."}
        </p>
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={reset}>
          Réessayer
        </Button>
        <Button asChild>
          <Link href="/">{"Retour à l'accueil"}</Link>
        </Button>
      </div>
    </div>
  );
}