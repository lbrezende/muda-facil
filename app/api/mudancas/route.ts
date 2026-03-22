import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkUsageLimit } from "@/lib/subscription";
import { mudancaSchema } from "@/lib/validations";
import { calculateDistance } from "@/lib/distance";
import { generateAutoQuotes } from "@/lib/quoting";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const mudancas = await db.mudanca.findMany({
      where: { userId: session.user.id },
      include: {
        caminhao: true,
        cargaLayout: true,
        cotacoes: {
          take: 3,
          orderBy: { precoCentavos: "asc" },
          include: {
            transportadora: {
              select: {
                id: true,
                nome: true,
                notaMedia: true,
              },
            },
          },
        },
        _count: {
          select: { cotacoes: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(mudancas);
  } catch (error) {
    console.error("GET /api/mudancas error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = mudancaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    // Check plan limit for active mudanças
    const user = await db.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: {
        id: true,
        plan: true,
        trialEndsAt: true,
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
        stripeSubscriptionId: true,
        name: true,
        email: true,
        image: true,
      },
    });

    const activeCount = await db.mudanca.count({
      where: {
        userId: session.user.id,
        status: { in: ["RASCUNHO", "COTANDO", "CONFIRMADA"] },
      },
    });

    const limitCheck = checkUsageLimit(user, "mudancasAtivas", activeCount);

    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: "Limite do plano atingido",
          message: `Seu plano permite no máximo ${limitCheck.limit} mudança(s) ativa(s). Faça upgrade para criar mais.`,
          limit: limitCheck,
        },
        { status: 403 }
      );
    }

    const {
      enderecoOrigem,
      enderecoDestino,
      dataDesejada,
      caminhaoId,
      numComodos,
      distanciaKm: providedDistance,
    } = parsed.data;

    // Use distance from frontend if provided, otherwise try to calculate (non-blocking, fast)
    let distanciaKm = providedDistance ?? null;
    if (!distanciaKm) {
      try {
        distanciaKm = await Promise.race([
          calculateDistance(enderecoOrigem, enderecoDestino),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);
      } catch {
        // Non-blocking — distance is optional
      }
    }

    // Create the mudança
    const mudanca = await db.mudanca.create({
      data: {
        userId: session.user.id,
        enderecoOrigem,
        enderecoDestino,
        dataDesejada: dataDesejada ? new Date(dataDesejada) : null,
        caminhaoId: caminhaoId ?? null,
        numComodos: numComodos ?? 1,
        distanciaKm: distanciaKm ?? 500, // Default 500km if not calculated
      },
    });

    // Auto-generate quotes if we have distance and numComodos
    const effectiveComodos = numComodos ?? 1;
    if (distanciaKm && distanciaKm > 0) {
      try {
        const autoQuotes = await generateAutoQuotes(
          distanciaKm,
          effectiveComodos
        );

        // Save top 10 quotes as Cotacao records
        const quotesToSave = autoQuotes.slice(0, 10);
        if (quotesToSave.length > 0) {
          await db.cotacao.createMany({
            data: quotesToSave.map((q) => ({
              mudancaId: mudanca.id,
              transportadoraId: q.transportadoraId,
              precoCentavos: q.precoCentavos,
              seguroIncluso: q.seguroIncluso,
              dataDisponivel: dataDesejada
                ? new Date(dataDesejada)
                : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              validade: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ), // 7 days validity
            })),
          });
        }
      } catch (err) {
        console.error("Auto-quote generation failed (non-blocking):", err);
      }
    }

    // Return the full mudança with cotações
    const result = await db.mudanca.findUnique({
      where: { id: mudanca.id },
      include: {
        caminhao: true,
        cargaLayout: true,
        cotacoes: {
          take: 3,
          orderBy: { precoCentavos: "asc" },
          include: {
            transportadora: {
              select: {
                id: true,
                nome: true,
                notaMedia: true,
              },
            },
          },
        },
        _count: {
          select: { cotacoes: true },
        },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/mudancas error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
