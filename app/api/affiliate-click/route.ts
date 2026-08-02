import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  campaignId: z.string().min(1),
  placement: z.string().min(1),
  pagePath: z.string().min(1)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({ ok: true, clickedAt: new Date().toISOString() });
}
