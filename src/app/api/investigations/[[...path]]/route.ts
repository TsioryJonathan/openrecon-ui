import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function forward(
  request: NextRequest,
  path: string[]
): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  }

  const suffix = path.length ? `/${path.join("/")}` : "";
  const target = new URL(`${BASE_URL}/api/investigations${suffix}`);
  for (const [key, value] of request.nextUrl.searchParams) {
    target.searchParams.append(key, value);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const headers: Record<string, string> = {
    "X-API-Key": process.env.API_KEY ?? "",
    "X-User-Id": session.user.id,
  };
  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  const upstream = await fetch(target.toString(), {
    method: request.method,
    headers,
    body: hasBody ? await request.text() : undefined,
  });

  const text = await upstream.text();
  const contentType = upstream.headers.get("content-type") ?? "application/json";
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": contentType },
  });
}

export async function GET(request: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await ctx.params;
  return forward(request, path);
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await ctx.params;
  return forward(request, path);
}