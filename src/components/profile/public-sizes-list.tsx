// src/components/profile/public-sizes-list.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SizeWithBrand } from "@/types";

interface PublicSizesListProps {
  sizes: SizeWithBrand[];
}

export function PublicSizesList({ sizes }: PublicSizesListProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {sizes.map((size) => (
        <Card key={size.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div>
              <h4 className="font-medium">
                {size.brand ? size.brand.name : "Taille générique"}
              </h4>
              <p className="text-2xl font-semibold">{size.value}</p>
              {size.notes && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {size.notes}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}