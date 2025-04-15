// src/components/profile/add-size-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/text-area";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Brand {
  id: string;
  name: string;
  category: Category;
}

interface AddSizeFormProps {
  userId: string;
  brandsByCategory: Record<Category, Brand[]>;
}

// Schéma de validation du formulaire
const formSchema = z.object({
  category: z.nativeEnum(Category, {
    required_error: "Veuillez sélectionner une catégorie",
  }),
  brandId: z.string().optional(),
  customBrand: z.string().optional(),
  value: z.string().min(1, {
    message: "Veuillez entrer une valeur pour la taille",
  }),
  notes: z.string().optional(),
});

export function AddSizeForm({ userId, brandsByCategory }: AddSizeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [useCustomBrand, setUseCustomBrand] = useState(false);

  // Initialiser le formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: undefined,
      brandId: undefined,
      customBrand: "",
      value: "",
      notes: "",
    },
  });

  // Fonction pour soumettre le formulaire
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Créer l'objet de données à envoyer
      const data = {
        userId,
        category: values.category,
        value: values.value,
        notes: values.notes || null,
      };

      // Gérer le cas d'une marque personnalisée
      if (useCustomBrand && values.customBrand) {
        // Envoyer une requête pour créer une nouvelle marque
        const brandResponse = await fetch("/api/brands", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.customBrand,
            category: values.category,
            isCustom: true,
          }),
        });

        if (!brandResponse.ok) {
          throw new Error("Erreur lors de la création de la marque personnalisée");
        }

        const brandData = await brandResponse.json();
        // Utiliser l'ID de la nouvelle marque
        Object.assign(data, { brandId: brandData.id });
      } else if (values.brandId) {
        // Utiliser une marque existante
        Object.assign(data, { brandId: values.brandId });
      }

      // Envoyer la requête pour créer la taille
      const response = await fetch("/api/sizes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la taille");
      }

      toast({
        title: "Taille ajoutée avec succès",
        description: "Votre nouvelle taille a été ajoutée à votre profil.",
      });

      // Rediriger vers la page de profil
      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la taille.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer le changement de catégorie
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    form.setValue("brandId", undefined);
    setUseCustomBrand(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleCategoryChange(value as Category);
                }}
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={Category.CLOTHING}>Vêtements (général)</SelectItem>
                  <SelectItem value={Category.SHIRTS}>Hauts / T-shirts</SelectItem>
                  <SelectItem value={Category.PANTS}>Pantalons / Jeans</SelectItem>
                  <SelectItem value={Category.SHOES}>Chaussures</SelectItem>
                  <SelectItem value={Category.JACKETS}>Vestes / Manteaux</SelectItem>
                  <SelectItem value={Category.UNDERWEAR}>Sous-vêtements</SelectItem>
                  <SelectItem value={Category.HATS}>Chapeaux / Casquettes</SelectItem>
                  <SelectItem value={Category.WATCHES}>Montres</SelectItem>
                  <SelectItem value={Category.RINGS}>Bagues</SelectItem>
                  <SelectItem value={Category.OTHER}>Autre</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCategory && (
          <>
            <div className="flex items-center space-x-2">
              <FormLabel className="flex-none">Marque</FormLabel>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-xs"
                onClick={() => setUseCustomBrand(!useCustomBrand)}
              >
                {useCustomBrand
                  ? "Utiliser une marque existante"
                  : "Ajouter une marque personnalisée"}
              </Button>
            </div>

            {useCustomBrand ? (
              <FormField
                control={form.control}
                name="customBrand"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Nom de la marque personnalisée"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Entrez le nom de la marque que vous souhaitez ajouter.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une marque" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedCategory &&
                          brandsByCategory[selectedCategory]?.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id}>
                              {brand.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {"Sélectionnez la marque pour cette taille, ou ajoutez une marque personnalisée si elle n'est pas dans la liste."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taille</FormLabel>
                  <FormControl>
                    <Input placeholder="Exemple: XL, 42, 38" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormDescription>
                    Entrez la valeur de votre taille pour cette catégorie et cette marque.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informations supplémentaires concernant cette taille..."
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Ajoutez des informations supplémentaires si nécessaire (coupe slim,
                    préférence de taille, etc.).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading || !selectedCategory}>
            {isLoading ? (
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
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}