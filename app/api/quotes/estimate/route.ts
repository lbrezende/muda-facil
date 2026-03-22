import { NextResponse } from "next/server";
import { generateAutoQuotes } from "@/lib/quoting";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const distanciaKm = parseFloat(searchParams.get("distanciaKm") || "0");
  const numComodos = parseInt(searchParams.get("numComodos") || "1", 10);

  if (distanciaKm <= 0 || numComodos <= 0) {
    return NextResponse.json(
      { error: "distanciaKm and numComodos must be positive" },
      { status: 400 }
    );
  }

  try {
    const quotes = await generateAutoQuotes(distanciaKm, numComodos);
    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("Quote estimation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quotes" },
      { status: 500 }
    );
  }
}
