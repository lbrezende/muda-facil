// Category-to-color mapping for 3D cargo blocks

export const CATEGORY_COLORS: Record<string, string> = {
  QUARTO: '#8B5CF6',
  COZINHA: '#F59E0B',
  SALA: '#3B82F6',
  ESCRITORIO: '#10B981',
  BANHEIRO: '#06B6D4',
  AREA_SERVICO: '#6366F1',
  CAIXAS: '#D97706',
};

export const CATEGORY_COLORS_LIGHT: Record<string, string> = {
  QUARTO: '#DDD6FE',
  COZINHA: '#FDE68A',
  SALA: '#BFDBFE',
  ESCRITORIO: '#A7F3D0',
  BANHEIRO: '#A5F3FC',
  AREA_SERVICO: '#C7D2FE',
  CAIXAS: '#FED7AA',
};

export function getCategoryColor(categoria: string): string {
  return CATEGORY_COLORS[categoria] || '#9CA3AF';
}

export function getCategoryColorLight(categoria: string): string {
  return CATEGORY_COLORS_LIGHT[categoria] || '#E5E7EB';
}
