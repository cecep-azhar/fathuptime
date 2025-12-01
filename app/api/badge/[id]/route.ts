import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { monitors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Badge SVG endpoint
// GET /api/badge/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const monitor = await db.query.monitors.findFirst({
      where: eq(monitors.id, params.id),
    });

    if (!monitor) {
      return new NextResponse(generateBadge("unknown", "gray"), {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-cache",
        },
      });
    }

    const status = monitor.status;
    const color = status === "up" ? "green" : status === "down" ? "red" : "yellow";
    const label = status === "up" ? "online" : status === "down" ? "offline" : "pending";

    return new NextResponse(generateBadge(label, color), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return new NextResponse(generateBadge("error", "gray"), {
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  }
}

function generateBadge(label: string, color: string): string {
  const colors: Record<string, string> = {
    green: "#4ade80",
    red: "#f87171",
    yellow: "#fbbf24",
    gray: "#9ca3af",
  };

  const bgColor = colors[color] || colors.gray;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="90" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="a">
    <rect width="90" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#a)">
    <path fill="#555" d="M0 0h45v20H0z"/>
    <path fill="${bgColor}" d="M45 0h45v20H45z"/>
    <path fill="url(#b)" d="M0 0h90v20H0z"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="22.5" y="15" fill="#010101" fill-opacity=".3">status</text>
    <text x="22.5" y="14">status</text>
    <text x="67.5" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="67.5" y="14">${label}</text>
  </g>
</svg>`.trim();
}
