import { NextResponse } from "next/server";
import { z } from "zod";
import { getLotteriesWithRelations } from "@/lib/cms";
import { isAllowedExternalUrl } from "@/lib/security";

const schema = z.object({
  title: z.string().min(1),
  officialApplicationUrl: z.string().refine(isAllowedExternalUrl).optional()
});

export async function GET() {
  const lotteries = await getLotteriesWithRelations();
  return NextResponse.json({ data: lotteries });
}

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  return NextResponse.json({ data: parsed.data }, { status: 201 });
}
