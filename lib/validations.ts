import { z } from "zod";

export const categoriaItemEnum = z.enum([
  "QUARTO",
  "COZINHA",
  "SALA",
  "ESCRITORIO",
  "BANHEIRO",
  "AREA_SERVICO",
  "CAIXAS",
]);

export const mudancaStatusEnum = z.enum([
  "RASCUNHO",
  "COTANDO",
  "CONFIRMADA",
  "CONCLUIDA",
]);

export const mudancaSchema = z.object({
  enderecoOrigem: z
    .string()
    .min(5, "Endereço de origem é obrigatório")
    .max(300, "Endereço muito longo"),
  enderecoDestino: z
    .string()
    .min(5, "Endereço de destino é obrigatório")
    .max(300, "Endereço muito longo"),
  dataDesejada: z.string().datetime().optional(),
  caminhaoId: z.string().cuid().optional(),
  numComodos: z.number().int().min(1).max(100).optional(),
  distanciaKm: z.number().min(0).optional(),
});

export const itemSchema = z.object({
  nome: z
    .string()
    .min(1, "Nome do item é obrigatório")
    .max(100, "Nome muito longo"),
  categoria: categoriaItemEnum,
  larguraCm: z.number().int().min(1).max(500),
  alturaCm: z.number().int().min(1).max(500),
  profundidadeCm: z.number().int().min(1).max(500),
  pesoKg: z.number().min(0.1).max(2000),
  volumeM3: z.number().min(0.001).max(50),
});

export const cargaItemSchema = z.object({
  cargaLayoutId: z.string().cuid(),
  itemId: z.string().cuid(),
  x: z.number().min(0),
  y: z.number().min(0),
  rotacao: z.number().int().min(0).max(360),
});

export const cotacaoFilterSchema = z.object({
  precoMax: z.number().int().optional(),
  notaMinima: z.number().min(0).max(5).optional(),
  seguroIncluso: z.boolean().optional(),
  tipoCaminhao: z.string().optional(),
  dataDisponivel: z.string().datetime().optional(),
  ordenarPor: z.enum(["preco", "nota", "data"]).optional(),
});

export type MudancaInput = z.infer<typeof mudancaSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type CargaItemInput = z.infer<typeof cargaItemSchema>;
export type CotacaoFilter = z.infer<typeof cotacaoFilterSchema>;
