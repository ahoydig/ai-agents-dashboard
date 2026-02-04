import { NextRequest, NextResponse } from "next/server";
import type { ReplayRequest, ReplayResponse } from "@/types/replay";

const AGENTS_API_URL = process.env.AGENTS_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body: ReplayRequest = await request.json();

    if (!AGENTS_API_URL) {
      return NextResponse.json(
        { error: "AGENTS_API_URL is not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(`${AGENTS_API_URL}/replay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Replay failed: ${error}` },
        { status: response.status }
      );
    }

    const data: ReplayResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Replay error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
