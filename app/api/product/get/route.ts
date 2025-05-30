import { NextRequest, NextResponse } from 'next/server';

import { getProduct } from '@/services/server-action/products';

export async function GET(request: NextRequest) {
  const productSlugs = request.nextUrl.searchParams.get('product');

  const result = await getProduct(productSlugs);

  return NextResponse.json(result, { status: result?.status || 200 });
}
