// src/app/api/sizes/route.ts
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Category } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { userId, category, brandId, value, notes } = body;

    // Vérifier que l'utilisateur ne crée des tailles que pour lui-même
    if (userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé à créer des tailles pour cet utilisateur" }),
        { status: 403 }
      );
    }

    // Vérifier si une taille avec cette combinaison existe déjà
    const existingSize = await prisma.size.findFirst({
      where: {
        userId,
        brandId,
        category: category as Category,
      },
    });

    if (existingSize) {
      // Mettre à jour la taille existante
      const updatedSize = await prisma.size.update({
        where: { id: existingSize.id },
        data: { value, notes },
      });

      return NextResponse.json(updatedSize, { status: 200 });
    }

    // Créer une nouvelle taille
    const newSize = await prisma.size.create({
      data: {
        userId,
        brandId,
        category: category as Category,
        value,
        notes,
      },
    });

    return NextResponse.json(newSize, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la taille:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors de la création de la taille" }),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ error: "ID utilisateur requis" }),
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur ne récupère que ses propres tailles
    if (userId !== session.user.id) {
      // Si ce n'est pas l'utilisateur lui-même, vérifier si le profil est public
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user || !user.customLink) {
        return new NextResponse(
          JSON.stringify({ error: "Profil non trouvé ou privé" }),
          { status: 404 }
        );
      }
    }

    // Construire la requête
    const where: Record<string, string | Category> = { userId };
    if (category) {
      where.category = category as Category;
    }

    // Récupérer les tailles avec les informations de marque
    const sizes = await prisma.size.findMany({
      where,
      include: {
        brand: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(sizes, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des tailles:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors de la récupération des tailles" }),
      { status: 500 }
    );
  }
}