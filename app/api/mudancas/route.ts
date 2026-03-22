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
          include: { transportadora: true },
          orderBy: { precoCentavos: "asc" },
          take: 3,
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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

    const { enderecoOrigem, enderecoDestino, dataDesejada, caminhaoId, numComodos, distanciaKm: inputDistancia } = parsed.data;

    // Calculate distance: use user-provided value or auto-calculate
    let distanciaKm = inputDistancia ?? null;
    if (!distanciaKm) {
      distanciaKm = await calculateDistance(enderecoOrigem, enderecoDestino);
    }

    const mudanca = await db.mudanca.create({
      data: {
        userId: session.user.id,
        enderecoOrigem,
        enderecoDestino,
        dataDesejada: dataDesejada ? new Date(dataDesejada) : null,
        caminhaoId: caminhaoId ?? null,
        numComodos: numComodos ?? 1,
        distanciaKm,
      },
      include: {
        caminhao: true,
        cargaLayout: true,
        _count: {
          select: { cotacoes: true },
        },
      },
    });

    // Auto-generate quotes from all transportadoras
    if (distanciaKm && distanciaKm > 0) {
      try {
        const quotes = await generateAutoQuotes(distanciaKm, numComodos ?? 1);
        const validadeDate = new Date();
        validadeDate.setDate(validadeDate.getDate() + 7); // quotes valid for 7 days

        for (const quote of quotes) {
          const dataDisponivel = new Date();
          dataDisponivel.setDate(dataDisponivel.getDate() + quote.tempoEstimadoDias);

          await db.cotacao.create({
            data: {
              mudancaId: mudanca.id,
              transportadoraId: quote.transportadoraId,
              precoCentavos: quote.precoCentavos,
              dataDisponivel,
              seguroIncluso: quote.seguroIncluso,
              validade: validadeDate,
            },
          });
        }
      } catch (quotingError) {
        console.error("Auto-quoting error (non-fatal):", quotingError);
        // Non-fatal: mudança is still created
      }
    }

    // Re-fetch with updated cotacao count
    const result = await db.mudanca.findUnique({
      where: { id: mudanca.id },
      include: {
        caminhao: true,
        cargaLayout: true,
        cotacoes: {
          include: { transportadora: true },
          orderBy: { precoCentavos: "asc" },
          take: 3,
        },
        _count: {
          select: { cotacoes: true },
        },
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("POST /api/mudancas error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
