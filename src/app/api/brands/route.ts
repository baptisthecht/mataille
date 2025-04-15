// src/app/api/brands/route.ts
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
    const { name, category, isCustom = true } = body;

    // Vérifier si la marque existe déjà
    const existingBrand = await prisma.brand.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive", // Recherche insensible à la casse
        },
      },
    });

    if (existingBrand) {
      return NextResponse.json(existingBrand, { status: 200 });
    }

    // Créer une nouvelle marque
    const newBrand = await prisma.brand.create({
      data: {
        name,
        category: category as Category,
        isCustom,
      },
    });

    return NextResponse.json(newBrand, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la marque:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors de la création de la marque" }),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    
    // Construire la requête
    const where: Record<string, string | Category | {contains: string, mode: string}> = {};
    
    if (category) {
      where.category = category as Category;
    }
    
    if (query) {
      where.name = {
        contains: query,
        mode: "insensitive", // Recherche insensible à la casse
      };
    }

    // Récupérer les marques
    const brands = await prisma.brand.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(brands, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des marques:", error);
    return new NextResponse(
      JSON.stringify({ error: "Erreur lors de la récupération des marques" }),
      { status: 500 }
    );
  }
}