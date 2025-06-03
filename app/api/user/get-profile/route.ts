import { NextRequest, NextResponse } from 'next/server';

import { connectMongoDB } from '@/lib/mongodb';
import { serverErrorHandler } from '@/lib/utils/utils';

import { getUserById } from '@/services/server-action/actions';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (userId) {
      await connectMongoDB();

      const user = await getUserById(userId);

      if (user) {
        return NextResponse.json(
          { success: true, data: user, message: 'Пользователь найден' },
          { status: 200 },
        );
      }
    }

    return NextResponse.json(
      { success: false, message: 'Пользователь не найден' },
      { status: 404 },
    );
  } catch (error: any) {
    const result = serverErrorHandler(error);

    return NextResponse.json(
      { success: result.success, message: result.message, error: result.error },
      { status: result.status },
    );
  }
}
