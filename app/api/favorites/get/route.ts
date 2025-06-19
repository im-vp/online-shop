import { NextRequest, NextResponse } from 'next/server';

import { getUserFavoritesProducts } from '@/services/server-action/favorites';

export async function GET(request: NextRequest) {
  const result = await getUserFavoritesProducts();

  return NextResponse.json(result, { status: result?.status || 200 });
}
