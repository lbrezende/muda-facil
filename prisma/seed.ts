/**
 * prisma/seed.ts
 *
 * Populates the MudaFácil database with:
 *   - 40+ catalog items (customizado: false, userId: null)
 *   - 4 truck types
 *   - 5 mock transportadoras
 *
 * Run:
 *   npx prisma db seed
 *
 * Requires tsx as a dev dependency:
 *   npm install -D tsx
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Item catalog ────────────────────────────────────────────────────────────

const items = [
  // QUARTO
  {
    nome: "Cama solteiro",
    categoria: "QUARTO" as const,
    larguraCm: 90,
    alturaCm: 45,
    profundidadeCm: 190,
    pesoKg: 25,
    volumeM3: 0.77,
  },
  {
    nome: "Cama casal",
    categoria: "QUARTO" as const,
    larguraCm: 140,
    alturaCm: 45,
    profundidadeCm: 190,
    pesoKg: 35,
    volumeM3: 1.2,
  },
  {
    nome: "Cama queen",
    categoria: "QUARTO" as const,
    larguraCm: 160,
    alturaCm: 50,
    profundidadeCm: 200,
    pesoKg: 45,
    volumeM3: 1.6,
  },
  {
    nome: "Cama king",
    categoria: "QUARTO" as const,
    larguraCm: 193,
    alturaCm: 50,
    profundidadeCm: 203,
    pesoKg: 55,
    volumeM3: 1.96,
  },
  {
    nome: "Colchão solteiro",
    categoria: "QUARTO" as const,
    larguraCm: 88,
    alturaCm: 20,
    profundidadeCm: 188,
    pesoKg: 12,
    volumeM3: 0.33,
  },
  {
    nome: "Colchão casal",
    categoria: "QUARTO" as const,
    larguraCm: 138,
    alturaCm: 25,
    profundidadeCm: 188,
    pesoKg: 18,
    volumeM3: 0.65,
  },
  {
    nome: "Guarda-roupa 2 portas",
    categoria: "QUARTO" as const,
    larguraCm: 120,
    alturaCm: 200,
    profundidadeCm: 50,
    pesoKg: 60,
    volumeM3: 1.2,
  },
  {
    nome: "Guarda-roupa 4 portas",
    categoria: "QUARTO" as const,
    larguraCm: 200,
    alturaCm: 200,
    profundidadeCm: 55,
    pesoKg: 90,
    volumeM3: 2.2,
  },
  {
    nome: "Cômoda",
    categoria: "QUARTO" as const,
    larguraCm: 80,
    alturaCm: 85,
    profundidadeCm: 45,
    pesoKg: 25,
    volumeM3: 0.31,
  },
  {
    nome: "Criado-mudo",
    categoria: "QUARTO" as const,
    larguraCm: 45,
    alturaCm: 55,
    profundidadeCm: 35,
    pesoKg: 8,
    volumeM3: 0.09,
  },
  {
    nome: "Penteadeira",
    categoria: "QUARTO" as const,
    larguraCm: 100,
    alturaCm: 140,
    profundidadeCm: 40,
    pesoKg: 20,
    volumeM3: 0.56,
  },

  // SALA
  {
    nome: "Sofá 2 lugares",
    categoria: "SALA" as const,
    larguraCm: 150,
    alturaCm: 80,
    profundidadeCm: 85,
    pesoKg: 35,
    volumeM3: 1.02,
  },
  {
    nome: "Sofá 3 lugares",
    categoria: "SALA" as const,
    larguraCm: 200,
    alturaCm: 80,
    profundidadeCm: 85,
    pesoKg: 45,
    volumeM3: 1.36,
  },
  {
    nome: "Sofá de canto",
    categoria: "SALA" as const,
    larguraCm: 250,
    alturaCm: 85,
    profundidadeCm: 200,
    pesoKg: 65,
    volumeM3: 2.5,
  },
  {
    nome: "Rack de TV",
    categoria: "SALA" as const,
    larguraCm: 180,
    alturaCm: 55,
    profundidadeCm: 40,
    pesoKg: 30,
    volumeM3: 0.4,
  },
  {
    nome: "Mesa de centro",
    categoria: "SALA" as const,
    larguraCm: 100,
    alturaCm: 45,
    profundidadeCm: 60,
    pesoKg: 12,
    volumeM3: 0.27,
  },
  {
    nome: "Estante",
    categoria: "SALA" as const,
    larguraCm: 120,
    alturaCm: 180,
    profundidadeCm: 30,
    pesoKg: 35,
    volumeM3: 0.65,
  },
  {
    nome: "Poltrona",
    categoria: "SALA" as const,
    larguraCm: 75,
    alturaCm: 85,
    profundidadeCm: 75,
    pesoKg: 18,
    volumeM3: 0.48,
  },

  // COZINHA
  {
    nome: "Geladeira",
    categoria: "COZINHA" as const,
    larguraCm: 70,
    alturaCm: 170,
    profundidadeCm: 65,
    pesoKg: 70,
    volumeM3: 0.77,
  },
  {
    nome: "Geladeira duplex",
    categoria: "COZINHA" as const,
    larguraCm: 80,
    alturaCm: 180,
    profundidadeCm: 70,
    pesoKg: 85,
    volumeM3: 1.01,
  },
  {
    nome: "Fogão 4 bocas",
    categoria: "COZINHA" as const,
    larguraCm: 55,
    alturaCm: 85,
    profundidadeCm: 60,
    pesoKg: 35,
    volumeM3: 0.28,
  },
  {
    nome: "Fogão 5 bocas",
    categoria: "COZINHA" as const,
    larguraCm: 76,
    alturaCm: 87,
    profundidadeCm: 62,
    pesoKg: 45,
    volumeM3: 0.41,
  },
  {
    nome: "Microondas",
    categoria: "COZINHA" as const,
    larguraCm: 45,
    alturaCm: 28,
    profundidadeCm: 35,
    pesoKg: 12,
    volumeM3: 0.04,
  },
  {
    nome: "Mesa 4 lugares",
    categoria: "COZINHA" as const,
    larguraCm: 120,
    alturaCm: 75,
    profundidadeCm: 80,
    pesoKg: 20,
    volumeM3: 0.72,
  },
  {
    nome: "Mesa 6 lugares",
    categoria: "COZINHA" as const,
    larguraCm: 160,
    alturaCm: 75,
    profundidadeCm: 90,
    pesoKg: 30,
    volumeM3: 1.08,
  },
  {
    nome: "Cadeira",
    categoria: "COZINHA" as const,
    larguraCm: 45,
    alturaCm: 90,
    profundidadeCm: 45,
    pesoKg: 5,
    volumeM3: 0.18,
  },

  // ESCRITORIO
  {
    nome: "Mesa de escritório",
    categoria: "ESCRITORIO" as const,
    larguraCm: 120,
    alturaCm: 75,
    profundidadeCm: 60,
    pesoKg: 20,
    volumeM3: 0.54,
  },
  {
    nome: "Cadeira de escritório",
    categoria: "ESCRITORIO" as const,
    larguraCm: 60,
    alturaCm: 110,
    profundidadeCm: 60,
    pesoKg: 12,
    volumeM3: 0.4,
  },
  {
    nome: "Estante de livros",
    categoria: "ESCRITORIO" as const,
    larguraCm: 80,
    alturaCm: 200,
    profundidadeCm: 30,
    pesoKg: 30,
    volumeM3: 0.48,
  },
  {
    nome: "Gaveteiro",
    categoria: "ESCRITORIO" as const,
    larguraCm: 40,
    alturaCm: 60,
    profundidadeCm: 50,
    pesoKg: 15,
    volumeM3: 0.12,
  },

  // BANHEIRO
  {
    nome: "Máquina de lavar",
    categoria: "BANHEIRO" as const,
    larguraCm: 60,
    alturaCm: 85,
    profundidadeCm: 55,
    pesoKg: 50,
    volumeM3: 0.28,
  },
  {
    nome: "Secadora",
    categoria: "BANHEIRO" as const,
    larguraCm: 60,
    alturaCm: 85,
    profundidadeCm: 60,
    pesoKg: 45,
    volumeM3: 0.31,
  },

  // AREA_SERVICO
  {
    nome: "Tábua de passar",
    categoria: "AREA_SERVICO" as const,
    larguraCm: 35,
    alturaCm: 5,
    profundidadeCm: 120,
    pesoKg: 3,
    volumeM3: 0.02,
  },
  {
    nome: "Tanque",
    categoria: "AREA_SERVICO" as const,
    larguraCm: 55,
    alturaCm: 85,
    profundidadeCm: 50,
    pesoKg: 15,
    volumeM3: 0.23,
  },

  // CAIXAS
  {
    nome: "Caixa P",
    categoria: "CAIXAS" as const,
    larguraCm: 35,
    alturaCm: 30,
    profundidadeCm: 30,
    pesoKg: 5,
    volumeM3: 0.03,
  },
  {
    nome: "Caixa M",
    categoria: "CAIXAS" as const,
    larguraCm: 50,
    alturaCm: 40,
    profundidadeCm: 40,
    pesoKg: 10,
    volumeM3: 0.08,
  },
  {
    nome: "Caixa G",
    categoria: "CAIXAS" as const,
    larguraCm: 60,
    alturaCm: 50,
    profundidadeCm: 50,
    pesoKg: 15,
    volumeM3: 0.15,
  },
  {
    nome: "Caixa de livros",
    categoria: "CAIXAS" as const,
    larguraCm: 35,
    alturaCm: 25,
    profundidadeCm: 30,
    pesoKg: 20,
    volumeM3: 0.03,
  },
  {
    nome: "Mala grande",
    categoria: "CAIXAS" as const,
    larguraCm: 75,
    alturaCm: 50,
    profundidadeCm: 30,
    pesoKg: 8,
    volumeM3: 0.11,
  },
  {
    nome: "Saco de roupa",
    categoria: "CAIXAS" as const,
    larguraCm: 50,
    alturaCm: 80,
    profundidadeCm: 40,
    pesoKg: 5,
    volumeM3: 0.16,
  },
];

// ─── Trucks ──────────────────────────────────────────────────────────────────

const caminhoes = [
  {
    nome: "Fiorino",
    tipo: "Fiorino",
    capacidadeM3: 1.5,
    capacidadeKg: 600,
    comprimentoCm: 165,
    larguraCm: 110,
    alturaCm: 105,
  },
  {
    nome: "HR / VUC",
    tipo: "HR",
    capacidadeM3: 6,
    capacidadeKg: 1500,
    comprimentoCm: 310,
    larguraCm: 175,
    alturaCm: 175,
  },
  {
    nome: "Caminhão 3/4",
    tipo: "3/4",
    capacidadeM3: 12,
    capacidadeKg: 3000,
    comprimentoCm: 450,
    larguraCm: 210,
    alturaCm: 210,
  },
  {
    nome: "Baú",
    tipo: "Baú",
    capacidadeM3: 20,
    capacidadeKg: 5000,
    comprimentoCm: 600,
    larguraCm: 240,
    alturaCm: 240,
  },
];

// ─── Carriers ────────────────────────────────────────────────────────────────

const transportadoras = [
  {
    nome: "TransMudar Express",
    cidade: "SP",
    notaMedia: 4.8,
    totalAvaliacoes: 234,
    tiposCaminhao: ["HR", "3/4", "Baú"],
  },
  {
    nome: "MudaJá",
    cidade: "SP",
    notaMedia: 4.5,
    totalAvaliacoes: 189,
    tiposCaminhao: ["Fiorino", "HR", "3/4"],
  },
  {
    nome: "Frete Amigo",
    cidade: "RJ",
    notaMedia: 4.2,
    totalAvaliacoes: 156,
    tiposCaminhao: ["HR", "3/4", "Baú"],
  },
  {
    nome: "CarregaBem",
    cidade: "SP",
    notaMedia: 4.6,
    totalAvaliacoes: 312,
    tiposCaminhao: ["Fiorino", "HR", "3/4", "Baú"],
  },
  {
    nome: "Mudanças Confiança",
    cidade: "MG",
    notaMedia: 4.3,
    totalAvaliacoes: 98,
    tiposCaminhao: ["3/4", "Baú"],
  },
];

// ─── Demo mudanças (real addresses) ─────────────────────────────────────────

const mudancasDemo = [
  {
    id: "demo-mudanca-1",
    enderecoOrigem: "Rua Augusta, 1200 - Consolação, São Paulo - SP",
    enderecoDestino: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP",
    status: "COTANDO" as const,
    caminhaoTipo: "HR",
  },
  {
    id: "demo-mudanca-2",
    enderecoOrigem: "Rua Oscar Freire, 379 - Jardim Paulista, São Paulo - SP",
    enderecoDestino: "Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP",
    status: "RASCUNHO" as const,
    caminhaoTipo: "3/4",
  },
  {
    id: "demo-mudanca-3",
    enderecoOrigem: "Rua Visconde de Pirajá, 550 - Ipanema, Rio de Janeiro - RJ",
    enderecoDestino: "Av. Atlântica, 1702 - Copacabana, Rio de Janeiro - RJ",
    status: "CONFIRMADA" as const,
    caminhaoTipo: "Baú",
  },
  {
    id: "demo-mudanca-4",
    enderecoOrigem: "Av. Afonso Pena, 1901 - Funcionários, Belo Horizonte - MG",
    enderecoDestino: "Rua da Bahia, 1148 - Centro, Belo Horizonte - MG",
    status: "RASCUNHO" as const,
    caminhaoTipo: "Fiorino",
  },
  {
    id: "demo-mudanca-5",
    enderecoOrigem: "Rua XV de Novembro, 300 - Centro, Curitiba - PR",
    enderecoDestino: "Av. Batel, 1868 - Batel, Curitiba - PR",
    status: "CONCLUIDA" as const,
    caminhaoTipo: "HR",
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Seeding items catalog...");

  for (const item of items) {
    await prisma.item.upsert({
      where: {
        // Items in the catalog are unique by name + category + not customised
        // We use a composite that Prisma can resolve via the id field when no
        // unique constraint exists, so we rely on findFirst + create pattern
        // via a stable synthetic key approach: fall back to id-based upsert
        // with a where clause that always misses so it always creates — but
        // that would duplicate on re-runs. Instead we use nome as a proxy:
        // ensure no two catalog items share the same nome.
        id: `catalog-${item.categoria}-${item.nome.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: {
        ...item,
        customizado: false,
        userId: null,
      },
      create: {
        id: `catalog-${item.categoria}-${item.nome.toLowerCase().replace(/\s+/g, "-")}`,
        ...item,
        customizado: false,
        userId: null,
      },
    });
  }

  console.log(`  ${items.length} items upserted.`);

  console.log("Seeding caminhoes...");

  for (const caminhao of caminhoes) {
    await prisma.caminhao.upsert({
      where: {
        id: `truck-${caminhao.tipo.toLowerCase().replace(/\//g, "-")}`,
      },
      update: caminhao,
      create: {
        id: `truck-${caminhao.tipo.toLowerCase().replace(/\//g, "-")}`,
        ...caminhao,
      },
    });
  }

  console.log(`  ${caminhoes.length} caminhoes upserted.`);

  console.log("Seeding transportadoras...");

  for (const transportadora of transportadoras) {
    await prisma.transportadora.upsert({
      where: {
        id: `carrier-${transportadora.nome.toLowerCase().replace(/\s+/g, "-")}`,
      },
      update: transportadora,
      create: {
        id: `carrier-${transportadora.nome.toLowerCase().replace(/\s+/g, "-")}`,
        ...transportadora,
      },
    });
  }

  console.log(`  ${transportadoras.length} transportadoras upserted.`);

  // Seed demo mudanças (requires at least one user in the database)
  console.log("Seeding demo mudanças...");

  const firstUser = await prisma.user.findFirst();

  if (firstUser) {
    for (const mudanca of mudancasDemo) {
      const caminhao = await prisma.caminhao.findFirst({
        where: { tipo: mudanca.caminhaoTipo },
      });

      await prisma.mudanca.upsert({
        where: { id: mudanca.id },
        update: {
          enderecoOrigem: mudanca.enderecoOrigem,
          enderecoDestino: mudanca.enderecoDestino,
          status: mudanca.status,
          caminhaoId: caminhao?.id ?? null,
        },
        create: {
          id: mudanca.id,
          userId: firstUser.id,
          enderecoOrigem: mudanca.enderecoOrigem,
          enderecoDestino: mudanca.enderecoDestino,
          status: mudanca.status,
          caminhaoId: caminhao?.id ?? null,
          dataDesejada: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        },
      });
    }

    console.log(`  ${mudancasDemo.length} demo mudanças upserted for user ${firstUser.email}.`);
  } else {
    console.log("  Skipped — no users found. Login first, then re-run seed.");
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
