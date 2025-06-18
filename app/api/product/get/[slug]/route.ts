import { NextRequest, NextResponse } from 'next/server';

import { getProduct } from '@/services/server-action/products';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const result = await getProduct(slug);

  return NextResponse.json(result, { status: result?.status || 200 });
}
