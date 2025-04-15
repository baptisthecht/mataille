// src/components/profile/user-settings-form.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useToast } from "@/components/ui/use-toast";
import { formatUsername } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface UserSettingsFormProps {
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    customLink: string | null;
    image: string | null;
  };
}

const formSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
    })
    .max(30, {
      message: "Le nom d'utilisateur ne peut pas dépasser 30 caractères",
    })
    .regex(/^[a-zA-Z0-9_.-]+$/, {
      message:
        "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, points, tirets et underscores",
    }),
  customLink: z
    .string()
    .min(3, {
      message: "Le lien personnalisé doit contenir au moins 3 caractères",
    })
    .max(30, {
      message: "Le lien personnalisé ne peut pas dépasser 30 caractères",
    })
    .regex(/^[a-zA-Z0-9_.-]+$/, {
      message:
        "Le lien personnalisé ne peut contenir que des lettres, chiffres, points, tirets et underscores",
    }),
});

export function UserSettingsForm({ user }: UserSettingsFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username || "",
      customLink: user.customLink || user.username || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formatUsername(values.username),
          customLink: formatUsername(values.customLink),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Une erreur est survenue");
      }

      toast({
        title: "Paramètres mis à jour",
        description: "Vos paramètres ont été mis à jour avec succès.",
      });

      // Actualiser la page pour refléter les changements
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du profil</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-secondary p-1">
                  <Image
                  width={64}
                  height={64}
                    src={user.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || "")}
                    alt={user.name || "Avatar"}
                    className="h-16 w-16 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{"Nom d'utilisateur"}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      {"Votre identifiant unique sur Sayz. Il sera utilisé dans l'URL de votre profil."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lien personnalisé</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      Personnalisez{" l'URL"} de votre profil public. Vous pourrez partager
                      votre profil via: mataille.com/{form.watch("customLink")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
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
                  "Enregistrer les modifications"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}