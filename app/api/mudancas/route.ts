import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkUsageLimit } from "@/lib/subscription";
import { mudancaSchema } from "@/lib/validations";
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

    const { enderecoOrigem, enderecoDestino, dataDesejada, caminhaoId } = parsed.data;

    const mudanca = await db.mudanca.create({
      data: {
        userId: session.user.id,
        enderecoOrigem,
        enderecoDestino,
        dataDesejada: dataDesejada ? new Date(dataDesejada) : null,
        caminhaoId: caminhaoId ?? null,
      },
      include: {
        caminhao: true,
        cargaLayout: true,
        _count: {
          select: { cotacoes: true },
        },
      },
    });

    return NextResponse.json(mudanca, { status: 201 });
  } catch (error) {
    console.error("POST /api/mudancas error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
