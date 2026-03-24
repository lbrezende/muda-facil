import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

type RouteParams = { params: Promise<{ mudancaId: string }> };

const cargaItemPositionSchema = z.object({
  itemId: z.string().cuid(),
  x: z.number().min(0),
  y: z.number().min(0),
  z: z.number().min(0),
  rotacao: z.number().int().min(0).max(360),
});

const saveCargaSchema = z.object({
  caminhaoId: z.string().cuid(),
  ocupacaoPercentual: z.number().min(0).max(100).optional(),
  itens: z.array(cargaItemPositionSchema),
});

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mudancaId } = await params;

  try {
    const mudanca = await db.mudanca.findUnique({
      where: { id: mudancaId },
      select: { userId: true },
    });

    if (!mudanca) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (mudanca.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cargaLayout = await db.cargaLayout.findUnique({
      where: { mudancaId },
      include: {
        caminhao: true,
        itens: {
          include: { item: true },
        },
      },
    });

    if (!cargaLayout) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(cargaLayout);
  } catch (error) {
    console.error(`GET /api/mudancas/${mudancaId}/carga error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mudancaId } = await params;

  try {
    const mudanca = await db.mudanca.findUnique({
      where: { id: mudancaId },
      select: { userId: true },
    });

    if (!mudanca) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (mudanca.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = saveCargaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const { caminhaoId, ocupacaoPercentual = 0, itens } = parsed.data;

    // Upsert the layout, then replace all items in a transaction
    const cargaLayout = await db.$transaction(async (tx) => {
      const layout = await tx.cargaLayout.upsert({
        where: { mudancaId },
        create: {
          mudancaId,
          caminhaoId,
          ocupacaoPercentual,
        },
        update: {
          caminhaoId,
          ocupacaoPercentual,
        },
      });

      // Delete all existing positioned items and recreate
      await tx.cargaItem.deleteMany({ where: { cargaLayoutId: layout.id } });

      if (itens.length > 0) {
        await tx.cargaItem.createMany({
          data: itens.map(({ itemId, x, y, z, rotacao }) => ({
            cargaLayoutId: layout.id,
            itemId,
            x,
            y,
            z,
            rotacao,
          })),
        });
      }

      return tx.cargaLayout.findUniqueOrThrow({
        where: { id: layout.id },
        include: {
          caminhao: true,
          itens: {
            include: { item: true },
          },
        },
      });
    });

    return NextResponse.json(cargaLayout);
  } catch (error) {
    console.error(`PUT /api/mudancas/${mudancaId}/carga error:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
