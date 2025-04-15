// src/components/profile/add-size-button.tsx
"use client";

import { PlusIcon } from "@/components/shared/icons";
import { Button, ButtonProps } from "@/components/ui/button";
import Link from "next/link";

export function AddSizeButton({
  variant = "outline",
  ...props
}: ButtonProps) {
  return (
    <Button variant={variant} asChild {...props}>
      <Link href="/profile/add-size">
        <PlusIcon className="mr-2 h-4 w-4" />
        Ajouter une taille
      </Link>
    </Button>
  );
}