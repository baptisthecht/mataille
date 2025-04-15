// src/app/api/sizes/[id]/route.ts
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Category } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401 }
      );
    }

    const id = params.id;
    
    // Récupérer la taille avec les informations de marque
    const size = await prisma.size.findUnique({
      where: { id },
      include: {
        brand: true,
        user: {
          select: {
            id: true,
            username: true,
            customLink: true,
          },
        },
      },
    });

    if (!size) {
      return new NextResponse(
        JSON.stringify({ error: "Taille non trouvée" }),
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur a le droit de voir cette taille
    if (size.userId !== session.user.id) {
      // Si ce n'est pas l'utilisateur lui-même, vérifier si le profil est public
      if (!size.user.customLink) {
        return new NextResponse(
          JSON.stringify({ error: "Profil non trouvé ou privé" }),
          { status: 404 }
        );
      }
    }

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la taille:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors de la récupération de la taille" }),
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401 }
      );
    }

    const id = params.id;
    const body = await req.json();
    const { category, brandId, value, notes } = body;

    // Vérifier que l'utilisateur est le propriétaire de cette taille
    const size = await prisma.size.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!size) {
      return new NextResponse(
        JSON.stringify({ error: "Taille non trouvée" }),
        { status: 404 }
      );
    }

    if (size.userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé à modifier cette taille" }),
        { status: 403 }
      );
    }

    // Mettre à jour la taille
    const updatedSize = await prisma.size.update({
      where: { id },
      data: {
        category: category as Category,
        brandId,
        value,
        notes,
      },
    });

    return NextResponse.json(updatedSize, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la taille:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors de la mise à jour de la taille" }),
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401 }
      );
    }

    const id = params.id;

    // Vérifier que l'utilisateur est le propriétaire de cette taille
    const size = await prisma.size.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!size) {
      return new NextResponse(
        JSON.stringify({ error: "Taille non trouvée" }),
        { status: 404 }
      );
    }

    if (size.userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé à supprimer cette taille" }),
        { status: 403 }
      );
    }

    // Supprimer la taille
    await prisma.size.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Erreur lors de la suppression de la taille:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors de la suppression de la taille" }),
      { status: 500 }
    );
  }
}