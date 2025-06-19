import { NextRequest, NextResponse } from 'next/server';

import { getReviewsByProductId } from '@/services/server-action/reviews';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;

  const result = await getReviewsByProductId(productId);

  return NextResponse.json(result, { status: result?.status || 200 });
}
