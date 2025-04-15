// src/components/profile/sizes-list.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditIcon, TrashIcon } from "@/components/shared/icons";
import { SizeWithBrand } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SizesListProps {
  sizes: SizeWithBrand[];
}

export function SizesList({ sizes }: SizesListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDeleteSize = async (sizeId: string) => {
    setIsLoading(sizeId);
    try {
      const response = await fetch(`/api/sizes/${sizeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      toast({
        title: "Taille supprimée",
        description: "La taille a été supprimée avec succès.",
      });

      // Recharger la page pour actualiser les données
      window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer cette taille. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {sizes.map((size) => (
        <Card key={size.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium">
                  {size.brand ? size.brand.name : "Taille générique"}
                </h4>
                <p className="text-2xl font-semibold">
                  {size.value}
                </p>
                {size.notes && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {size.notes}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  asChild
                >
                  <a href={`/profile/edit-size/${size.id}`}>
                    <span className="sr-only">Modifier</span>
                    <EditIcon className="h-4 w-4" />
                  </a>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <span className="sr-only">Supprimer</span>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous sûr de vouloir supprimer cette taille ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Cette taille sera définitivement supprimée
                        de votre profil.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteSize(size.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isLoading === size.id ? (
                          <>
                            <svg
                              className="mr-2 h-4 w-4 animate-spin"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Suppression...
                          </>
                        ) : (
                          "Supprimer"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}