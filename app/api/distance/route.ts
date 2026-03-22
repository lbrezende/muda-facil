import { NextResponse } from "next/server";
import { calculateDistance } from "@/lib/distance";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin");
  const destination = searchParams.get("destination");

  if (!origin || !destination) {
    return NextResponse.json(
      { error: "origin and destination are required" },
      { status: 400 }
    );
  }

  try {
    const distanciaKm = await calculateDistance(origin, destination);
    return NextResponse.json({ distanciaKm });
  } catch {
    return NextResponse.json({ distanciaKm: null });
  }
}
