import { useQuery } from "@tanstack/react-query";

async function fetchDistance(
  origin: string,
  destination: string
): Promise<number | null> {
  const params = new URLSearchParams({ origin, destination });
  const res = await fetch(`/api/distance?${params}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.distanciaKm ?? null;
}

export function useDistance(origin: string, destination: string) {
  return useQuery({
    queryKey: ["distance", origin, destination],
    queryFn: () => fetchDistance(origin, destination),
    enabled: origin.length >= 5 && destination.length >= 5,
    staleTime: 5 * 60 * 1000, // 5 min cache — same addresses = same distance
    retry: 1,
  });
}
