// src/app/api/users/route.ts
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatUsername } from "@/lib/utils";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Vérifier si l'utilisateur est authentifié
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    
    // Récupérer un utilisateur par son nom d'utilisateur
    if (username) {
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { customLink: username },
          ]
        },
        select: {
          id: true,
          name: true,
          username: true,
          customLink: true,
          image: true,
          createdAt: true,
        },
      });

      if (!user) {
        return new NextResponse(
          JSON.stringify({ error: "Utilisateur non trouvé" }),
          { status: 404 }
        );
      }

      return NextResponse.json(user, { status: 200 });
    }

    // Si aucun paramètre n'est fourni, retourner l'utilisateur actuel
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        customLink: true,
        image: true,
        createdAt: true,
      },
    });

    return NextResponse.json(currentUser, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors de la récupération de l'utilisateur" }),
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Vérifier si l'utilisateur est authentifié
    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Non autorisé" }),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { username, customLink } = body;

    // Vérifier si les champs requis sont présents
    if (!username && !customLink) {
      return new NextResponse(
        JSON.stringify({ error: "Aucune donnée à mettre à jour" }),
        { status: 400 }
      );
    }

    const updateData: Partial<User> = {};

    // Vérifier et formater le nom d'utilisateur
    if (username) {
      const formattedUsername = formatUsername(username);
      
      // Vérifier si le nom d'utilisateur est déjà pris
      const existingUser = await prisma.user.findFirst({
        where: {
          username: formattedUsername,
          id: { not: session.user.id },
        },
      });

      if (existingUser) {
        return new NextResponse(
          JSON.stringify({ error: "Ce nom d'utilisateur est déjà pris" }),
          { status: 400 }
        );
      }

      updateData.username = formattedUsername;
    }

    // Vérifier et formater le lien personnalisé
    if (customLink) {
      const formattedCustomLink = formatUsername(customLink);
      
      // Vérifier si le lien personnalisé est déjà pris
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { customLink: formattedCustomLink },
            { username: formattedCustomLink },
          ],
          id: { not: session.user.id },
        },
      });

      if (existingUser) {
        return new NextResponse(
          JSON.stringify({ error: "Ce lien personnalisé est déjà pris" }),
          { status: 400 }
        );
      }

      updateData.customLink = formattedCustomLink;
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        customLink: true,
        image: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors de la mise à jour de l'utilisateur" }),
      { status: 500 }
    );
  }
}